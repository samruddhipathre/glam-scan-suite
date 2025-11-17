import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Sparkles, ShoppingBag } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface SkinAnalysisResult {
  skinTone: string;
  undertone: string;
  seasonalPalette: string;
  bestColors: string[];
  avoidColors: string[];
  metalRecommendation: string;
  styleAdvice: string;
}

const SkinAnalysis = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysis, setAnalysis] = useState<SkinAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setAnalysisComplete(false);
        setAnalysis(null);
        toast.success("Photo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setAnalysisComplete(false);

    try {
      console.log('Calling analyze-skin edge function...');
      const { data, error } = await supabase.functions.invoke('analyze-skin', {
        body: { image }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No analysis data returned from AI');
      }

      setAnalysis(data);
      setAnalysisComplete(true);
      toast.success("Skin analysis complete!");
    } catch (error: any) {
      console.error('Skin analysis error:', error);
      const errorMessage = error?.message || 'Failed to analyze skin tone';
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Skin Analysis</h1>
          <p className="text-muted-foreground text-lg">
            Discover colors and styles that complement your unique beauty with AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold">Upload Your Photo</h2>

              {!image ? (
                <div className="space-y-4">
                  <div className="aspect-square bg-gradient-hero rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                    <div className="text-center p-8">
                      <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground mb-4">
                        Upload a clear, well-lit photo of your face for accurate AI analysis
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="gradient"
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Photo
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <img
                    src={image}
                    alt="Your photo"
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="gradient"
                      size="lg"
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setImage(null);
                        setAnalysisComplete(false);
                        setAnalysis(null);
                      }}
                    >
                      Change Photo
                    </Button>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>AI analyzing skin tone and undertones...</span>
                      <span className="text-primary">Processing</span>
                    </div>
                    <Progress value={66} />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Our AI is analyzing your unique features...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-2xl font-semibold">Analysis Results</h2>

              {!analysisComplete || !analysis ? (
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-center px-4">
                    Upload and analyze your photo to see personalized AI recommendations
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-semibold mb-1 text-sm">Skin Tone</h3>
                        <p className="text-sm">{analysis.skinTone}</p>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-semibold mb-1 text-sm">Undertone</h3>
                        <p className="text-sm">{analysis.undertone}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-hero p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Seasonal Palette</h3>
                      <p className="text-lg font-medium">{analysis.seasonalPalette}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Best Colors for You</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {analysis.bestColors.map((color, index) => (
                          <div
                            key={index}
                            className="bg-secondary p-3 rounded-lg text-center text-sm font-medium hover:shadow-elegant transition-all"
                          >
                            {color}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Colors to Avoid</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.avoidColors.map((color, index) => (
                          <div
                            key={index}
                            className="bg-muted px-3 py-2 rounded-lg text-sm"
                          >
                            {color}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Metal Recommendation</h3>
                      <p className="text-sm capitalize">{analysis.metalRecommendation}</p>
                    </div>

                    <div className="bg-primary/10 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Personalized Style Advice</h3>
                      <p className="text-sm text-muted-foreground">{analysis.styleAdvice}</p>
                    </div>
                  </div>

                  <Link to="/shop">
                    <Button variant="gradient" size="lg" className="w-full">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Shop Recommended Styles
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              Why AI Skin Analysis Matters
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold">Scientifically Accurate</h4>
                <p className="text-sm text-muted-foreground">
                  AI-powered analysis using advanced computer vision to determine your exact skin tone and undertone
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold">Perfect Color Matching</h4>
                <p className="text-sm text-muted-foreground">
                  Get colors that enhance your natural beauty based on color theory and seasonal analysis
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold">Shop with Confidence</h4>
                <p className="text-sm text-muted-foreground">
                  Make smarter purchasing decisions with AI-backed color and style recommendations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkinAnalysis;
