import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your personal fashion AI assistant. I can help you with outfit suggestions, styling advice, color matching, and more. What can I help you with today?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    "What colors suit my skin tone?",
    "Suggest a formal outfit",
    "How to style wide-leg pants?",
    "Summer wardrobe essentials",
  ];

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isUser: true,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const userInput = input;
    setInput("");
    setIsLoading(true);

    try {
      console.log('Sending message to AI...');
      
      const { data, error } = await supabase.functions.invoke('fashion-chat', {
        body: {
          messages: updatedMessages.map(m => ({
            role: m.isUser ? 'user' : 'assistant',
            content: m.text
          }))
        }
      });

      if (error) {
        console.error('Error calling fashion-chat:', error);
        throw error;
      }

      if (!data?.message) {
        throw new Error('No response from AI');
      }

      console.log('AI response received');

      const aiResponse: Message = {
        id: updatedMessages.length + 1,
        text: data.message,
        isUser: false,
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      toast.error('Failed to get response. Please try again.');
      
      // Remove the user message if AI failed
      setMessages(messages);
      setInput(userInput);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Fashion AI Assistant</h1>
          <p className="text-muted-foreground text-lg">
            Get instant fashion advice and styling tips
          </p>
        </div>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            {/* Chat Messages */}
            <div className="space-y-4 mb-6 h-[500px] overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.isUser
                        ? "gradient-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {!message.isUser && (
                      <Sparkles className="h-4 w-4 mb-2 text-primary" />
                    )}
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Try asking:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-left justify-start h-auto py-2"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about fashion..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isLoading && sendMessage()}
                className="flex-1"
                disabled={isLoading}
              />
              <Button variant="gradient" onClick={sendMessage} disabled={isLoading}>
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Style Advice</h3>
              <p className="text-xs text-muted-foreground">
                Get personalized fashion tips
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Outfit Ideas</h3>
              <p className="text-xs text-muted-foreground">
                Discover new combinations
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Color Matching</h3>
              <p className="text-xs text-muted-foreground">
                Perfect color palettes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
