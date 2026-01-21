import { useParams, Link } from "wouter";
import { SHOES } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Ruler, ShoppingCart, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductDetails() {
  const { id } = useParams();
  const shoeId = parseInt(id, 10);
  const shoe = SHOES.find((s) => s.id === shoeId);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(shoe?.colors?.[0] || "");

  if (!shoe)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Shoe not found
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-6">
      <div className="container mx-auto px-4 md:px-8 py-8">
        
        {/* Back Button */}
        <Link
          href="/shop"
          className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-yellow-500 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* LEFT: IMAGE SECTION */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 relative aspect-square md:aspect-[4/3]"
          >
            <img
              src={shoe.image}
              alt={shoe.name}
              className="w-full h-full object-cover"
            />

            {/* THUMBNAILS */}
            <div className="absolute bottom-4 left-4 flex gap-3">
              {[shoe.image, shoe.image].map((img, idx) => (
                <div
                  key={idx}
                  className={`w-16 h-16 rounded-lg overflow-hidden border ${
                    idx === 0
                      ? "border-yellow-500" 
                      : "border-white/20 opacity-60 hover:opacity-100"
                  } bg-black cursor-pointer`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: DETAILS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-1">
              <span className="text-sm tracking-wide text-gray-400 uppercase">
                {shoe.brand}
              </span>
            </div>

            <h1 className="font-serif text-4xl font-bold mb-4">
              {shoe.name}
            </h1>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-bold text-yellow-500">
                ${shoe.price}
              </span>
            </div>

            {/* AR BADGE */}
            {shoe.arEnabled && (
              <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 px-3 py-1.5 rounded-md text-sm font-semibold mb-6 w-fit">
                <Sparkles className="w-4 h-4" />
                AR Try-On Available
              </div>
            )}

            {/* SHIPPING */}
            <div className="flex items-center gap-2 mb-8 text-sm font-medium text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Free Shipping
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-400 leading-relaxed mb-8 max-w-lg">
              {shoe.description}
            </p>

            {/* SIZE SELECTOR */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-base font-bold">Select Size</span>
                <Link
                  href="/try-on"
                  className="text-sm text-yellow-400 hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-4 h-4" />
                  Measure Feet
                </Link>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {shoe.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 rounded-lg border text-sm font-semibold transition-all ${
                      selectedSize === size
                        ? "border-yellow-500 bg-yellow-500 text-black"
                        : "border-white/10 text-white hover:border-yellow-500"
                    }`}
                  >
                    US {size}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR SELECTOR */}
            <div className="mb-8">
              <span className="text-base font-bold block mb-3">
                Available Colors
              </span>

              <div className="flex gap-4">
                {shoe.colors?.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedColor === color
                        ? "border-yellow-500 ring-2 ring-yellow-500/40"
                        : "border-white/10"
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && (
                      <div className="w-2 h-2 bg-white rounded-full mix-blend-difference" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 mt-auto">
              {/* Add to Cart */}
              <Link href="/payment" className="flex-1">
                <Button
                  size="lg"
                  className="w-full h-14 text-base font-bold bg-yellow-500 text-black hover:bg-yellow-600 rounded-xl"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                </Button>
              </Link>

              {/* Try On AR */}
              {shoe.arEnabled && (
                <Link href={`/try-on?shoe=${shoe.id}`} className="flex-1">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-14 text-base font-bold border-white/20 hover:bg-white/10 rounded-xl"
                  >
                    <Sparkles className="w-5 h-5 mr-2" /> Try With AR
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* TABS SECTION */}
        <div className="border-t border-white/10 pt-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="bg-transparent w-full justify-start gap-8 p-0 h-auto border-b border-white/10 rounded-none">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-yellow-500 data-[state=active]:text-yellow-500 px-0 py-4 text-base font-bold"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="sizeguide"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-yellow-500 data-[state=active]:text-yellow-500 px-0 py-4 text-base font-bold"
              >
                Size Guide
              </TabsTrigger>
            </TabsList>

            {/* DESCRIPTION TAB */}
            <TabsContent value="description" className="pt-6">
              <div className="bg-neutral-900 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4">Product Details</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  {shoe.description}
                </p>

                <div className="grid grid-cols-2 gap-y-4 gap-x-8 max-w-lg">
                  <DetailRow label="Brand" value={shoe.brand} />
                  <DetailRow label="Category" value={shoe.category} />
                  <DetailRow label="Gender" value={shoe.gender} />
                </div>
              </div>
            </TabsContent>

            {/* SIZE GUIDE TAB */}
            <TabsContent value="sizeguide" className="pt-6">
              <div className="bg-neutral-900 rounded-xl p-6 border border-white/10 flex flex-col items-start">
                <h3 className="text-lg font-bold mb-2">Size Guide</h3>
                <p className="text-gray-400 mb-6">
                  Use our AI-powered measurement tool for the most accurate size
                  match.
                </p>
                <Link href="/try-on">
                  <Button className="bg-yellow-500 text-black font-bold flex items-center hover:bg-yellow-600">
                    <Ruler className="mr-2 w-4 h-4" /> Measure Your Feet
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

/* Small Component for Details */
function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-2">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-amber-400">{value}</span>
    </div>
  );
}
