import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, Camera } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Import clothing images
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
import dressBurgundy from "@/assets/clothes/dress-burgundy.png";
import kurtaWhite from "@/assets/clothes/kurta-white.png";
import kurtaNavy from "@/assets/clothes/kurta-navy.png";
import skirtBeige from "@/assets/clothes/skirt-beige.png";
import joggersGray from "@/assets/clothes/joggers-gray.png";
import shortsDenim from "@/assets/clothes/shorts-denim.png";
import shirtLinen from "@/assets/clothes/shirt-linen.png";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  sizes: string[];
  color: string;
  image?: string;
}

const Shop = () => {
  const [selectedSize, setSelectedSize] = useState<{ [key: number]: string }>({});
  const [selectedCategory, setSelectedCategory] = useState("all");

  const products: Product[] = [
    // Tops
    {
      id: 1,
      name: "Premium Black T-Shirt",
      price: 1299,
      category: "tops",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      color: "Black",
      image: tshirtBlack,
    },
    {
      id: 2,
      name: "Classic White Shirt",
      price: 1899,
      category: "tops",
      sizes: ["S", "M", "L", "XL", "XXL"],
      color: "White",
      image: shirtWhite,
    },
    {
      id: 3,
      name: "Navy Polo Shirt",
      price: 1599,
      category: "tops",
      sizes: ["S", "M", "L", "XL", "XXL"],
      color: "Navy Blue",
      image: poloNavy,
    },
    {
      id: 4,
      name: "Flannel Shirt",
      price: 1799,
      category: "tops",
      sizes: ["S", "M", "L", "XL"],
      color: "Red Check",
      image: flannelRed,
    },
    {
      id: 5,
      name: "Linen Shirt",
      price: 2099,
      category: "tops",
      sizes: ["S", "M", "L", "XL"],
      color: "Cream",
      image: shirtLinen,
    },
    {
      id: 6,
      name: "Maroon Sweater",
      price: 2199,
      category: "tops",
      sizes: ["S", "M", "L", "XL"],
      color: "Maroon",
      image: sweaterMaroon,
    },
    {
      id: 7,
      name: "Gray Cardigan",
      price: 2499,
      category: "tops",
      sizes: ["S", "M", "L", "XL"],
      color: "Gray",
      image: cardiganGray,
    },
    // Outerwear
    {
      id: 8,
      name: "Blue Denim Jacket",
      price: 3499,
      category: "outerwear",
      sizes: ["S", "M", "L", "XL"],
      color: "Blue",
      image: jacketBlue,
    },
    {
      id: 9,
      name: "Red Hoodie",
      price: 2299,
      category: "outerwear",
      sizes: ["S", "M", "L", "XL", "XXL"],
      color: "Red",
      image: hoodieRed,
    },
    {
      id: 10,
      name: "Charcoal Blazer",
      price: 5499,
      category: "outerwear",
      sizes: ["S", "M", "L", "XL"],
      color: "Charcoal",
      image: blazerCharcoal,
    },
    {
      id: 11,
      name: "Beige Trench Coat",
      price: 4999,
      category: "outerwear",
      sizes: ["S", "M", "L", "XL"],
      color: "Beige",
      image: trenchcoatBeige,
    },
    {
      id: 12,
      name: "Green Bomber Jacket",
      price: 3299,
      category: "outerwear",
      sizes: ["S", "M", "L", "XL"],
      color: "Green",
      image: bomberGreen,
    },
    {
      id: 13,
      name: "Olive Utility Jacket",
      price: 3799,
      category: "outerwear",
      sizes: ["S", "M", "L", "XL"],
      color: "Olive",
      image: utilityOlive,
    },
    // Bottoms
    {
      id: 14,
      name: "Slim Fit Jeans",
      price: 2199,
      category: "bottoms",
      sizes: ["28", "30", "32", "34", "36"],
      color: "Dark Blue",
      image: jeansBlue,
    },
    {
      id: 15,
      name: "Formal Trousers",
      price: 1899,
      category: "bottoms",
      sizes: ["28", "30", "32", "34", "36"],
      color: "Black",
      image: trousersBlack,
    },
    {
      id: 16,
      name: "Khaki Chinos",
      price: 1999,
      category: "bottoms",
      sizes: ["28", "30", "32", "34", "36"],
      color: "Khaki",
      image: chinosKhaki,
    },
    {
      id: 17,
      name: "Gray Joggers",
      price: 1599,
      category: "bottoms",
      sizes: ["S", "M", "L", "XL", "XXL"],
      color: "Gray",
      image: joggersGray,
    },
    {
      id: 18,
      name: "Denim Shorts",
      price: 1399,
      category: "bottoms",
      sizes: ["28", "30", "32", "34"],
      color: "Blue",
      image: shortsDenim,
    },
    {
      id: 19,
      name: "Beige Pleated Skirt",
      price: 1799,
      category: "bottoms",
      sizes: ["XS", "S", "M", "L"],
      color: "Beige",
      image: skirtBeige,
    },
    // Dresses
    {
      id: 20,
      name: "Black Midi Dress",
      price: 3299,
      category: "dresses",
      sizes: ["XS", "S", "M", "L", "XL"],
      color: "Black",
      image: dressBlack,
    },
    {
      id: 21,
      name: "Floral Maxi Dress",
      price: 2899,
      category: "dresses",
      sizes: ["XS", "S", "M", "L", "XL"],
      color: "Floral",
      image: dressFloral,
    },
    {
      id: 22,
      name: "Burgundy Cocktail Dress",
      price: 3499,
      category: "dresses",
      sizes: ["XS", "S", "M", "L", "XL"],
      color: "Burgundy",
      image: dressBurgundy,
    },
    // Ethnic Wear
    {
      id: 23,
      name: "White Cotton Kurta",
      price: 1699,
      category: "ethnic",
      sizes: ["S", "M", "L", "XL", "XXL"],
      color: "White",
      image: kurtaWhite,
    },
    {
      id: 24,
      name: "Navy Embroidered Kurta",
      price: 2299,
      category: "ethnic",
      sizes: ["S", "M", "L", "XL", "XXL"],
      color: "Navy Blue",
      image: kurtaNavy,
    },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const addToCart = (productId: number) => {
    if (!selectedSize[productId]) {
      toast.error("Please select a size first");
      return;
    }
    toast.success("Added to cart!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Fashion Collection</h1>
          <p className="text-muted-foreground text-lg">
            Curated pieces selected just for you
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 items-center">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="tops">Tops</SelectItem>
              <SelectItem value="bottoms">Bottoms</SelectItem>
              <SelectItem value="dresses">Dresses</SelectItem>
              <SelectItem value="outerwear">Outerwear</SelectItem>
              <SelectItem value="ethnic">Ethnic Wear</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1"></div>

          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} items
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="hover:shadow-elegant transition-all duration-300"
            >
              <CardContent className="p-4 space-y-4">
                <div className="aspect-[3/4] bg-gradient-hero rounded-lg flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <p className="text-muted-foreground">Product Image</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ₹{product.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {product.color}
                    </span>
                  </div>
                </div>

                <Select
                  value={selectedSize[product.id] || ""}
                  onValueChange={(value) =>
                    setSelectedSize({ ...selectedSize, [product.id]: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="gradient"
                    onClick={() => addToCart(product.id)}
                    className="w-full"
                  >
                    <ShoppingCart className="mr-1 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Link to="/virtual-tryon">
                    <Button variant="outline" className="w-full">
                      <Camera className="mr-1 h-4 w-4" />
                      Try On
                    </Button>
                  </Link>
                </div>

                <Button variant="ghost" className="w-full" size="sm">
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
