import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, Share2, ShoppingCart, RefreshCw } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import tshirtBlack from "@/assets/clothes/tshirt-black.png";
import shirtWhite from "@/assets/clothes/shirt-white.png";
import jacketBlue from "@/assets/clothes/jacket-blue.png";
import hoodieRed from "@/assets/clothes/hoodie-red.png";

const clothes = [
  { id: 1, name: "Black T-Shirt", image: tshirtBlack, price: "$29.99" },
  { id: 2, name: "White Shirt", image: shirtWhite, price: "$39.99" },
  { id: 3, name: "Blue Jacket", image: jacketBlue, price: "$79.99" },
  { id: 4, name: "Red Hoodie", image: hoodieRed, price: "$49.99" },
];

const VirtualTryOn = () => {
  const [image, setImage] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<typeof clothes[0] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        toast.success("Photo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } } 
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

  const processVirtualTryOn = (clothing: typeof clothes[0]) => {
    if (!image) return;
    
    setIsProcessing(true);
    setSelectedClothing(clothing);
    
    // Simulate AI processing with canvas overlay
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`${clothing.name} applied! This is a demo - real AI coming soon!`);
    }, 1500);
  };

  const shareLook = () => {
    toast.success("Share functionality will be available soon!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Virtual Try-On</h1>
          <p className="text-muted-foreground text-lg">
            See how clothes look on you using AI technology
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
                      src={image}
                      alt="Your photo"
                      className="w-full aspect-[3/4] object-cover rounded-lg"
                    />
                    {selectedClothing && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={selectedClothing.image}
                          alt={selectedClothing.name}
                          className="w-1/2 h-auto opacity-80 mix-blend-multiply"
                        />
                      </div>
                    )}
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setImage(null);
                        setSelectedClothing(null);
                      }}
                      className="w-full"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Change Photo
                    </Button>
                    {selectedClothing && (
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => setSelectedClothing(null)}
                        className="w-full"
                      >
                        Remove Outfit
                      </Button>
                    )}
                  </div>
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
                    Upload or capture your photo first to see the magic happen
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Select an outfit to try on:
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {clothes.map((item) => (
                        <button
                          key={item.id}
                          className="group relative aspect-square bg-muted rounded-lg hover:ring-2 hover:ring-primary transition-all overflow-hidden"
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
                        Applying virtual try-on...
                      </p>
                    </div>
                  )}

                  {selectedClothing && (
                    <div className="space-y-3 pt-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="font-semibold">{selectedClothing.name}</p>
                        <p className="text-xl text-primary font-bold">{selectedClothing.price}</p>
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
                  <li>1. Upload or capture your photo</li>
                  <li>2. Select an outfit from our collection</li>
                  <li>3. See how it looks on you instantly</li>
                  <li>4. Add to cart or share with friends</li>
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
