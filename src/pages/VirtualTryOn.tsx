import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, Share2, ShoppingCart, RefreshCw, Ruler } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import tshirtBlack from "@/assets/clothes/tshirt-black.png";
import shirtWhite from "@/assets/clothes/shirt-white.png";
import jacketBlue from "@/assets/clothes/jacket-blue.png";
import hoodieRed from "@/assets/clothes/hoodie-red.png";
import cardiganGray from "@/assets/clothes/cardigan-gray.png";
import trenchcoatBeige from "@/assets/clothes/trenchcoat-beige.png";
import bomberGreen from "@/assets/clothes/bomber-green.png";
import poloNavy from "@/assets/clothes/polo-navy.png";
import flannelRed from "@/assets/clothes/flannel-red.png";
import sweaterMaroon from "@/assets/clothes/sweater-maroon.png";
import blazerCharcoal from "@/assets/clothes/blazer-charcoal.png";
import utilityOlive from "@/assets/clothes/utility-olive.png";
import jeansBlue from "@/assets/clothes/jeans-blue.png";
import trousersBlack from "@/assets/clothes/trousers-black.png";
import chinosKhaki from "@/assets/clothes/chinos-khaki.png";
import dressBlack from "@/assets/clothes/dress-black.png";
import dressFloral from "@/assets/clothes/dress-floral.png";
import kurtaWhite from "@/assets/clothes/kurta-white.png";
import kurtaNavy from "@/assets/clothes/kurta-navy.png";
import skirtBeige from "@/assets/clothes/skirt-beige.png";

const clothes = [
  { id: 1, name: "Black T-Shirt", image: tshirtBlack, price: "₹1299" },
  { id: 2, name: "White Shirt", image: shirtWhite, price: "₹1899" },
  { id: 3, name: "Blue Jacket", image: jacketBlue, price: "₹3499" },
  { id: 4, name: "Red Hoodie", image: hoodieRed, price: "₹2299" },
  { id: 5, name: "Gray Cardigan", image: cardiganGray, price: "₹2499" },
  { id: 6, name: "Beige Trench Coat", image: trenchcoatBeige, price: "₹4999" },
  { id: 7, name: "Green Bomber Jacket", image: bomberGreen, price: "₹3299" },
  { id: 8, name: "Navy Polo Shirt", image: poloNavy, price: "₹1599" },
  { id: 9, name: "Flannel Shirt", image: flannelRed, price: "₹1799" },
  { id: 10, name: "Maroon Sweater", image: sweaterMaroon, price: "₹2199" },
  { id: 11, name: "Charcoal Blazer", image: blazerCharcoal, price: "₹5499" },
  { id: 12, name: "Olive Utility Jacket", image: utilityOlive, price: "₹3799" },
  { id: 13, name: "Slim Fit Jeans", image: jeansBlue, price: "₹2199" },
  { id: 14, name: "Black Trousers", image: trousersBlack, price: "₹1899" },
  { id: 15, name: "Khaki Chinos", image: chinosKhaki, price: "₹1999" },
  { id: 16, name: "Black Midi Dress", image: dressBlack, price: "₹3299" },
  { id: 17, name: "Floral Maxi Dress", image: dressFloral, price: "₹2899" },
  { id: 18, name: "White Cotton Kurta", image: kurtaWhite, price: "₹1699" },
  { id: 19, name: "Navy Embroidered Kurta", image: kurtaNavy, price: "₹2299" },
  { id: 20, name: "Beige Pleated Skirt", image: skirtBeige, price: "₹1799" },
];

interface BodyMeasurements {
  bodyType: string;
  measurements: {
    chest: number;
    waist: number;
    hips: number;
    shoulders: number;
    height: number;
  };
  recommendedSize: string;
  fitAdvice: string;
}

const VirtualTryOn = () => {
  const [image, setImage] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<typeof clothes[0] | null>(null);
  const [tryonImage, setTryonImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzingBody, setIsAnalyzingBody] = useState(false);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurements | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setTryonImage(null);
        setSelectedClothing(null);
        setBodyMeasurements(null);
        toast.success("Photo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 1920 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
        toast.success("Camera started!");
      }
    } catch (error) {
      console.error("Camera error:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const photoData = canvas.toDataURL("image/jpeg");
        setImage(photoData);
        setTryonImage(null);
        setSelectedClothing(null);
        setBodyMeasurements(null);
        stopCamera();
        toast.success("Photo captured!");
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  const analyzeBody = async () => {
    if (!image) return;
    
    setIsAnalyzingBody(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-body', {
        body: { image }
      });

      if (error) throw error;

      setBodyMeasurements(data);
      toast.success("Body analysis complete!");
    } catch (error: any) {
      console.error('Body analysis error:', error);
      const message = error?.message || '';
      if (message.includes('Rate limit')) {
        toast.error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (message.includes('credits')) {
        toast.error('AI credits depleted. Please add credits in Settings → Workspace → Usage.');
      } else {
        toast.error('Failed to analyze body measurements. Please try again.');
      }
    } finally {
      setIsAnalyzingBody(false);
    }
  };

  const convertImageToBase64 = (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    });
  };

  const processVirtualTryOn = async (clothing: typeof clothes[0]) => {
    if (!image) return;
    
    setIsProcessing(true);
    setSelectedClothing(clothing);
    
    try {
      if (!bodyMeasurements) {
        toast.message('Tip: Run Body Analysis for a better fit');
      }
      // Convert clothing image to base64
      console.log('Converting clothing image to base64...');
      const clothingImageBase64 = await convertImageToBase64(clothing.image);
      console.log('Clothing image converted successfully');
      
      console.log('Calling generate-tryon edge function...');
      const { data, error } = await supabase.functions.invoke('generate-tryon', {
        body: { 
          userImage: image,
          clothingImage: clothingImageBase64,
          clothingName: clothing.name,
          bodyMeasurements
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        if (error.message?.includes('Rate limit')) {
          toast.error("Rate limit exceeded. Please wait a moment and try again.");
        } else if (error.message?.includes('credits')) {
          toast.error("AI credits depleted. Please add credits to continue.");
        } else {
          toast.error(error.message || "Failed to generate virtual try-on. Please try again.");
        }
        return;
      }

      if (!data?.tryonImage) {
        console.error('No tryonImage in response:', data);
        toast.error("No try-on image returned from AI");
        return;
      }

      setTryonImage(data.tryonImage);
      toast.success(`${clothing.name} applied successfully!`);
    } catch (error: any) {
      console.error('Virtual try-on error:', error);
      toast.error(error?.message || "Failed to generate virtual try-on. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const shareLook = () => {
    toast.success("Share functionality coming soon!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Virtual Try-On</h1>
          <p className="text-muted-foreground text-lg">
            See realistic virtual try-on with AI-powered body analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Camera/Upload Section */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold">Your Photo</h2>

              {!image && !isCameraActive && (
                <div className="space-y-4">
                  <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Upload or capture a photo to begin
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="gradient"
                      size="lg"
                      onClick={startCamera}
                      className="w-full"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Take Photo
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-5 w-5" />
                      Upload Photo
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {isCameraActive && (
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full aspect-[3/4] rounded-lg bg-black"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="gradient" size="lg" onClick={capturePhoto}>
                      <Camera className="mr-2 h-5 w-5" />
                      Capture
                    </Button>
                    <Button variant="outline" size="lg" onClick={stopCamera}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {image && !isCameraActive && (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={tryonImage || image}
                      alt="Your photo"
                      className="w-full aspect-[3/4] object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setImage(null);
                        setTryonImage(null);
                        setSelectedClothing(null);
                        setBodyMeasurements(null);
                      }}
                      className="w-full"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Change Photo
                    </Button>
                    <Button
                      variant="gradient"
                      size="lg"
                      onClick={analyzeBody}
                      disabled={isAnalyzingBody}
                      className="w-full"
                    >
                      <Ruler className="mr-2 h-4 w-4" />
                      {isAnalyzingBody ? "Analyzing..." : "Body Analysis"}
                    </Button>
                  </div>

                  {bodyMeasurements && (
                    <Card className="bg-muted">
                      <CardContent className="p-4 space-y-2">
                        <h3 className="font-semibold text-sm">Body Analysis Results</h3>
                        <div className="text-xs space-y-1">
                          <p><span className="font-medium">Body Type:</span> {bodyMeasurements.bodyType}</p>
                          <p><span className="font-medium">Recommended Size:</span> {bodyMeasurements.recommendedSize}</p>
                          <p className="text-muted-foreground pt-1">{bodyMeasurements.fitAdvice}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Virtual Try-On Controls */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-2xl font-semibold">Try On Clothing</h2>

              {!image ? (
                <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-center px-4">
                    Upload or capture your photo first to see realistic AI try-on
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Select an outfit to try on with AI:
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {clothes.map((item) => (
                        <button
                          key={item.id}
                          className="group relative aspect-square bg-muted rounded-lg hover:ring-2 hover:ring-primary transition-all overflow-hidden disabled:opacity-50"
                          onClick={() => processVirtualTryOn(item)}
                          disabled={isProcessing}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-background/95 p-2 text-center">
                            <p className="text-xs font-medium">{item.name}</p>
                            <p className="text-xs text-primary">{item.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {isProcessing && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">
                        AI is generating realistic try-on...
                      </p>
                    </div>
                  )}

                  {selectedClothing && tryonImage && (
                    <div className="space-y-3 pt-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="font-semibold">{selectedClothing.name}</p>
                        <p className="text-xl text-primary font-bold">{selectedClothing.price}</p>
                        {bodyMeasurements && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Recommended size: {bodyMeasurements.recommendedSize}
                          </p>
                        )}
                      </div>
                      <Button variant="gradient" size="lg" className="w-full">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="lg" className="w-full">
                        Buy Now
                      </Button>
                      <Button
                        variant="ghost"
                        size="lg"
                        className="w-full"
                        onClick={shareLook}
                      >
                        <Share2 className="mr-2 h-5 w-5" />
                        Share Your Look
                      </Button>
                    </div>
                  )}
                </>
              )}

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">How it works:</h3>
                <ol className="text-sm text-muted-foreground space-y-2">
                  <li>1. Upload or capture your full-body photo</li>
                  <li>2. Get AI body analysis for perfect sizing</li>
                  <li>3. Select outfits to see realistic try-on</li>
                  <li>4. Add to cart with recommended size</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;
