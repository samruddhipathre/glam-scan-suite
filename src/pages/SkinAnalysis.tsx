import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, Sparkles } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const SkinAnalysis = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysis, setAnalysis] = useState({
    skinTone: "",
    undertone: "",
    recommendedColors: [] as string[],
    suitableStyles: [] as string[],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setAnalysisComplete(false);
        toast.success("Photo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);

    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis({
        skinTone: "Fair to Medium",
        undertone: "Warm",
        recommendedColors: [
          "Coral",
          "Peach",
          "Gold",
          "Olive Green",
          "Warm Browns",
          "Terracotta",
        ],
        suitableStyles: [
          "Bohemian",
          "Classic",
          "Casual Chic",
          "Modern Minimal",
        ],
      });
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast.success("Analysis complete!");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Skin Analysis</h1>
          <p className="text-muted-foreground text-lg">
            Discover colors and styles that complement your unique beauty
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
                        Upload a clear photo of your face for accurate analysis
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
                      {isAnalyzing ? "Analyzing..." : "Analyze"}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setImage(null);
                        setAnalysisComplete(false);
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
                      <span>Analyzing skin tone...</span>
                      <span className="text-primary">60%</span>
                    </div>
                    <Progress value={60} />
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

              {!analysisComplete ? (
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-center px-4">
                    Upload and analyze your photo to see personalized recommendations
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Skin Tone</h3>
                      <p className="text-muted-foreground">{analysis.skinTone}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Undertone</h3>
                      <p className="text-muted-foreground">{analysis.undertone}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Recommended Colors</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {analysis.recommendedColors.map((color, index) => (
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
                      <h3 className="font-semibold mb-3">Suitable Styles</h3>
                      <div className="space-y-2">
                        {analysis.suitableStyles.map((style, index) => (
                          <div
                            key={index}
                            className="bg-muted p-3 rounded-lg text-sm"
                          >
                            {style}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button variant="gradient" size="lg" className="w-full">
                    <Sparkles className="mr-2 h-5 w-5" />
                    See Recommended Outfits
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              Why Skin Analysis Matters
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold">Personalized Colors</h4>
                <p className="text-sm text-muted-foreground">
                  Discover colors that enhance your natural beauty and make you glow
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold">Confidence Boost</h4>
                <p className="text-sm text-muted-foreground">
                  Wear colors that complement you perfectly and feel more confident
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold">Smart Shopping</h4>
                <p className="text-sm text-muted-foreground">
                  Make better purchasing decisions with AI-powered recommendations
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
