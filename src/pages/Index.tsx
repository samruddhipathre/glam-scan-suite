import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Camera,
  Sparkles,
  ShoppingBag,
  MessageSquare,
  Scan,
  Share2,
} from "lucide-react";
import heroImage from "@/assets/hero-image.png";
import skinAnalysis from "@/assets/skin-analysis-feature.png";
import catalogPreview from "@/assets/catalog-preview.png";

const Index = () => {
  const features = [
    {
      icon: Camera,
      title: "Virtual Try-On",
      description: "See how clothes look on you in real-time with AR technology",
      link: "/virtual-tryon",
    },
    {
      icon: Scan,
      title: "Skin Analysis",
      description: "AI-powered skin analysis for personalized recommendations",
      link: "/skin-analysis",
    },
    {
      icon: Sparkles,
      title: "Smart Recommendations",
      description: "Get clothing suggestions based on your body shape and preferences",
      link: "/shop",
    },
    {
      icon: MessageSquare,
      title: "Fashion Chatbot",
      description: "Get instant fashion advice from our AI assistant",
      link: "/chat",
    },
    {
      icon: ShoppingBag,
      title: "Easy Shopping",
      description: "Browse curated collections with smart filters and sizing",
      link: "/shop",
    },
    {
      icon: Share2,
      title: "Share Your Look",
      description: "Share your virtual try-on looks with friends instantly",
      link: "/virtual-tryon",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative gradient-hero overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold">
                Your Personal
                <span className="block gradient-primary bg-clip-text text-transparent">
                  Fashion AI Assistant
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Experience the future of online shopping with AI-powered virtual try-on,
                skin analysis, and personalized fashion recommendations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/virtual-tryon">
                  <Button variant="hero" size="xl" className="group">
                    Try Virtual Try-On
                    <Camera className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </Button>
                </Link>
                <Link to="/shop">
                  <Button variant="outline" size="xl">
                    Browse Collection
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-float">
              <img
                src={heroImage}
                alt="Virtual Try-On Demo"
                className="rounded-2xl shadow-elegant w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Revolutionary Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powered by advanced AI technology to transform your shopping experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase 1 */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">AI-Powered Skin Analysis</h2>
              <p className="text-lg text-muted-foreground">
                Our advanced AI analyzes your skin tone, undertone, and features to
                recommend colors and styles that complement you perfectly. Get
                personalized fashion advice tailored to your unique beauty.
              </p>
              <Link to="/skin-analysis">
                <Button variant="gradient" size="lg">
                  Start Analysis
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div>
              <img
                src={skinAnalysis}
                alt="Skin Analysis Feature"
                className="rounded-2xl shadow-elegant w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Styles Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Trending Styles</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the hottest looks curated by our AI fashion experts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="overflow-hidden hover:shadow-elegant transition-all duration-300">
              <div className="aspect-[3/4] bg-gradient-hero"></div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">Casual Chic</h3>
                <p className="text-sm text-muted-foreground mb-3">Effortless everyday style</p>
                <Link to="/shop">
                  <Button variant="outline" size="sm" className="w-full">
                    Shop Style
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-elegant transition-all duration-300">
              <div className="aspect-[3/4] bg-gradient-hero"></div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">Office Elegance</h3>
                <p className="text-sm text-muted-foreground mb-3">Professional & polished</p>
                <Link to="/shop">
                  <Button variant="outline" size="sm" className="w-full">
                    Shop Style
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-elegant transition-all duration-300">
              <div className="aspect-[3/4] bg-gradient-hero"></div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">Evening Glamour</h3>
                <p className="text-sm text-muted-foreground mb-3">Statement-making looks</p>
                <Link to="/shop">
                  <Button variant="outline" size="sm" className="w-full">
                    Shop Style
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Showcase 2 */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src={catalogPreview}
                alt="Fashion Catalog"
                className="rounded-2xl shadow-elegant w-full"
              />
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <h2 className="text-4xl font-bold">Premium Fashion Collection</h2>
              <p className="text-lg text-muted-foreground">
                Explore our carefully curated collection with detailed fabric information,
                accurate sizing, and competitive prices. Every item can be virtually
                tried on with realistic AI-powered fitting.
              </p>
              <Link to="/shop">
                <Button variant="gradient" size="lg">
                  Browse Collection
                  <ShoppingBag className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Style?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of fashion-forward individuals using Avatar to discover
            their perfect look
          </p>
          <Link to="/virtual-tryon">
            <Button
              variant="secondary"
              size="xl"
              className="shadow-glow hover:scale-105"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 Avatar. Powered by AI Fashion Technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
