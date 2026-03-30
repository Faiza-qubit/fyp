import { useParams, Link, useLocation } from "wouter";
import { SHOES } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Ruler, ShoppingCart, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addCartItem } from "@/lib/cart";

export default function ProductDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const shoe = SHOES.find((s) => String(s.id) === String(id));

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (shoe?.images?.length) {
      setSelectedImage(shoe.images[0]);
    }
  }, [shoe]);

  const selectedColor = shoe?.colors || ["#000"];

  const getColorStyle = (colors) => {
    if (!colors) return {};

    if (colors.length === 1) {
      return { backgroundColor: colors[0] };
    }

    if (colors.length === 2) {
      return {
        background: `linear-gradient(90deg, ${colors[0]} 50%, ${colors[1]} 50%)`,
      };
    }

    if (colors.length === 3) {
      return {
        background: `linear-gradient(
          90deg,
          ${colors[0]} 33%,
          ${colors[1]} 33%,
          ${colors[1]} 66%,
          ${colors[2]} 66%
        )`,
      };
    }
  };

  const handleAddToCart = () => {
    addCartItem({
      shoeId: shoe._id || shoe.id,
      name: shoe.name,
      brand: shoe.brand,
      price: shoe.price,
      size: selectedSize || shoe.sizes?.[0],
      colors: selectedColor,
      colorName: "Default",
      image: selectedImage,
    });

    setLocation("/cart");
  };

  if (!shoe)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Shoe not found
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-6">
      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* BACK */}
        <Link
          href="/shop"
          className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-yellow-500 mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* ⭐ IMAGE GALLERY */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 relative aspect-square md:aspect-[4/3]"
          >
            {selectedImage && (
              <img
                src={selectedImage}
                alt={shoe.name}
                className="w-full h-full object-cover"
              />
            )}

            <div className="absolute bottom-4 left-4 flex gap-3">
              {shoe.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border ${
                    selectedImage === img
                      ? "border-yellow-500"
                      : "border-white/20 opacity-60 hover:opacity-100"
                  } bg-black cursor-pointer`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* ⭐ DETAILS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-sm text-gray-400 uppercase">
              {shoe.brand}
            </span>

            <h1 className="font-serif text-4xl font-bold mb-4">{shoe.name}</h1>

            <span className="text-3xl font-bold text-yellow-500 mb-6">
              ${shoe.price}
            </span>

            {shoe.arEnabled && (
              <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 px-3 py-1.5 rounded-md text-sm font-semibold mb-6 w-fit">
                <Sparkles className="w-4 h-4" />
                AR Try-On Available
              </div>
            )}

            <div className="flex items-center gap-2 mb-6 text-sm font-medium text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Free Shipping
            </div>

            <p className="text-gray-400 mb-8">{shoe.description}</p>

            {/* ⭐ SIZE */}
            <div className="mb-8">
              <span className="text-base font-bold block mb-3">
                Select Size
              </span>

              <div className="grid grid-cols-5 gap-3">
                {shoe.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 rounded-lg border ${
                      selectedSize === size
                        ? "border-yellow-500 bg-yellow-500 text-black"
                        : "border-white/10 hover:border-yellow-500"
                    }`}
                  >
                    US {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ⭐ COLOR */}
            <div className="mb-8">
              <span className="text-base font-bold block mb-3">Color</span>

              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                  style={getColorStyle(selectedColor)}
                />
              </div>
            </div>

            {/* ⭐ BUTTONS */}
            <div className="flex gap-4">
              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                className="flex-1 h-14 bg-yellow-500 text-black font-bold rounded-xl"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>

              {/* Virtual Try-On */}
              <Button
                onClick={() => setLocation(`/virtual-try-on/${shoe.id}`)}
                className="flex-1 h-14 bg-black border border-yellow-500 text-yellow-400 font-bold rounded-xl hover:bg-yellow-500 hover:text-black"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Try-On
              </Button>
            </div>
          </motion.div>
        </div>

        {/* ⭐ TABS FULL */}
        <div className="border-t border-white/10 pt-8">
          <Tabs defaultValue="description">
            <TabsList className="bg-transparent gap-8 border-b border-white/10">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="sizeguide">Size Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <div className="bg-neutral-900 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4">Product Details</h3>

                <p className="text-gray-400 mb-6">{shoe.description}</p>

                <div className="grid grid-cols-2 gap-6 max-w-lg">
                  <DetailRow label="Brand" value={shoe.brand} />
                  <DetailRow label="Category" value={shoe.category} />
                  <DetailRow label="Gender" value={shoe.gender} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sizeguide" className="pt-6">
              <Link href="/measure-feet">
                <Button className="bg-yellow-500 text-black font-bold">
                  <Ruler className="mr-2 w-4 h-4" />
                  Measure Your Feet
                </Button>
              </Link>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-2">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-amber-400">{value}</span>
    </div>
  );
}
