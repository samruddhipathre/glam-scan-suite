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
      name: "Denim Blue Jacket",
      price: 3499,
      category: "outerwear",
      sizes: ["S", "M", "L", "XL"],
      color: "Blue",
      image: jacketBlue,
    },
    {
      id: 4,
      name: "Cozy Red Hoodie",
      price: 2299,
      category: "outerwear",
      sizes: ["S", "M", "L", "XL", "XXL"],
      color: "Red",
      image: hoodieRed,
    },
    {
      id: 5,
      name: "Classic Blazer",
      price: 4999,
      category: "outerwear",
      sizes: ["XS", "S", "M", "L", "XL"],
      color: "Black",
    },
    {
      id: 6,
      name: "Silk Blouse",
      price: 2499,
      category: "tops",
      sizes: ["XS", "S", "M", "L"],
      color: "Ivory",
    },
    {
      id: 7,
      name: "Wide Leg Trousers",
      price: 2799,
      category: "bottoms",
      sizes: ["XS", "S", "M", "L", "XL"],
      color: "Navy",
    },
    {
      id: 8,
      name: "Leather Jacket",
      price: 8999,
      category: "outerwear",
      sizes: ["S", "M", "L"],
      color: "Brown",
    },
    {
      id: 9,
      name: "Midi Dress",
      price: 3499,
      category: "dresses",
      sizes: ["XS", "S", "M", "L", "XL"],
      color: "Burgundy",
    },
    {
      id: 10,
      name: "Cashmere Sweater",
      price: 4599,
      category: "tops",
      sizes: ["S", "M", "L", "XL"],
      color: "Camel",
    },
    {
      id: 11,
      name: "Cotton Polo Shirt",
      price: 1599,
      category: "tops",
      sizes: ["S", "M", "L", "XL", "XXL"],
      color: "Navy Blue",
    },
    {
      id: 12,
      name: "Slim Fit Jeans",
      price: 2199,
      category: "bottoms",
      sizes: ["28", "30", "32", "34", "36"],
      color: "Dark Blue",
    },
    {
      id: 13,
      name: "Formal Trousers",
      price: 1899,
      category: "bottoms",
      sizes: ["28", "30", "32", "34", "36"],
      color: "Charcoal Grey",
    },
    {
      id: 14,
      name: "Casual Kurta",
      price: 1699,
      category: "ethnic",
      sizes: ["S", "M", "L", "XL", "XXL"],
      color: "White",
    },
    {
      id: 15,
      name: "Designer Kurta Set",
      price: 3299,
      category: "ethnic",
      sizes: ["S", "M", "L", "XL"],
      color: "Royal Blue",
    },
    {
      id: 16,
      name: "Printed Summer Dress",
      price: 2499,
      category: "dresses",
      sizes: ["XS", "S", "M", "L", "XL"],
      color: "Floral",
    },
    {
      id: 17,
      name: "Sports Track Pants",
      price: 1299,
      category: "bottoms",
      sizes: ["S", "M", "L", "XL", "XXL"],
      color: "Black",
    },
    {
      id: 18,
      name: "Bomber Jacket",
      price: 3999,
      category: "outerwear",
      sizes: ["S", "M", "L", "XL"],
      color: "Olive Green",
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
