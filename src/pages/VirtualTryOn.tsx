import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, Share2, ShoppingCart } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

const VirtualTryOn = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        toast.success("Camera started!");
      }
    } catch (error) {
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

  const processVirtualTryOn = () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Virtual try-on applied! (Demo mode)");
    }, 2000);
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
                  <img
                    src={image}
                    alt="Your photo"
                    className="w-full aspect-[3/4] object-cover rounded-lg"
                  />
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setImage(null)}
                    className="w-full"
                  >
                    Change Photo
                  </Button>
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
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((item) => (
                        <button
                          key={item}
                          className="aspect-square bg-muted rounded-lg hover:ring-2 hover:ring-primary transition-all"
                          onClick={processVirtualTryOn}
                        >
                          <div className="h-full flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">
                              Outfit {item}
                            </p>
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

                  <div className="space-y-3">
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
                      Share with Friends
                    </Button>
                  </div>
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
