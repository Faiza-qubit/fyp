import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ShoeCard from "@/components/ui/ShoeCard";
import { SHOES } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search, Filter, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortOrder, setSortOrder] = useState("featured");

  const categories = ["Running", "Casual", "Formal", "Sneakers"];
  const genders = ["Men", "Women", "Unisex"];
  const brands = ["Nike", "Adidas", "Puma", "Clarks", "Gucci"];
  const colors = ["Black", "White", "Red", "Blue", "Green"];

  const categoriesCounts = useMemo(() => {
    const counts = {};
    categories.forEach(cat => {
      counts[cat] = SHOES.filter(s => s.category === cat).length;
    });
    return counts;
  }, []);

  const gendersCounts = useMemo(() => {
    const counts = {};
    genders.forEach(gen => {
      counts[gen] = SHOES.filter(s => s.gender === gen).length;
    });
    return counts;
  }, []);

  const brandsCounts = useMemo(() => {
    const counts = {};
    brands.forEach(brand => {
      counts[brand] = SHOES.filter(s => s.brand === brand).length;
    });
    return counts;
  }, []);

  const colorsCounts = useMemo(() => {
    const counts = {};
    colors.forEach(col => {
      counts[col] = SHOES.filter(s => s.color === col).length;
    });
    return counts;
  }, []);

  // Filter + sort
  const filteredShoes = useMemo(() => {
    let shoes = SHOES.filter(shoe => {
      const matchesSearch =
        shoe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shoe.brand.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length > 0
          ? selectedCategories.includes(shoe.category)
          : true;

      let effectiveGenders = [...selectedGenders];
      if (selectedGenders.some(g => g === "Men" || g === "Women")) {
        effectiveGenders = [...new Set([...effectiveGenders, "Unisex"])];
      }
      const matchesGender =
        selectedGenders.length > 0
          ? effectiveGenders.includes(shoe.gender)
          : true;

      const matchesBrand =
        selectedBrands.length > 0
          ? selectedBrands.includes(shoe.brand)
          : true;

      const matchesColor =
        selectedColors.length > 0
          ? selectedColors.includes(shoe.color)
          : true;

      return matchesSearch && matchesCategory && matchesGender && matchesBrand && matchesColor;
    });

    if (sortOrder === "price-low")
      shoes.sort((a, b) => a.price - b.price);
    else if (sortOrder === "price-high")
      shoes.sort((a, b) => b.price - a.price);
    else if (sortOrder === "newest")
      shoes.sort((a, b) => b.id - a.id);

    return shoes;
  }, [searchQuery, selectedCategories, selectedGenders, selectedBrands, selectedColors, sortOrder]);

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSearchQuery("");
  };

  // Modern Filter Section with Accordions
  const FilterSection = () => {
    const [openSections, setOpenSections] = useState({
      category: false,
      gender: false,
      brand: false,
      color: false,
    });

    const toggleSection = (section) => {
      setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
      <div className="space-y-6">
        <h2 className="font-serif text-3xl font-bold text-white mb-4">Shop</h2>

        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-xl text-white">Filters</h3>
          {(selectedCategories.length || selectedGenders.length || selectedBrands.length || selectedColors.length || searchQuery) && (
            <span
              onClick={resetFilters}
              className="text-sm text-yellow-400 cursor-pointer hover:underline"
            >
              Reset All
            </span>
          )}
        </div>

        {/* Category Accordion */}
        <div>
          <button
            onClick={() => toggleSection('category')}
            className={`flex items-center justify-between w-full text-sm uppercase tracking-wide font-bold transition-colors duration-300 hover:text-yellow-400 ${openSections.category ? 'text-yellow-400' : 'text-white'
              }`}
          >
            Category
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openSections.category ? 'rotate-180 text-yellow-400' : 'text-gray-400'}`} />
          </button>
          <AnimatePresence>
            {openSections.category && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden mt-3 space-y-2"
              >
                {categories.map(cat => (
                  <div key={cat} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${cat}`}
                      checked={selectedCategories.includes(cat)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, cat]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(c => c !== cat));
                        }
                      }}
                      className="data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 border-gray-600"
                    />
                    <label
                      htmlFor={`cat-${cat}`}
                      className="text-sm font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {cat} ({categoriesCounts[cat]})
                    </label>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <hr className="my-4 border-neutral-700" />

        {/* Gender Accordion */}
        <div>
          <button
            onClick={() => toggleSection('gender')}
            className={`flex items-center justify-between w-full text-sm uppercase tracking-wide font-bold transition-colors duration-300 hover:text-yellow-400 ${openSections.gender ? 'text-yellow-400' : 'text-white'
              }`}
          >
            Gender
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openSections.gender ? 'rotate-180 text-yellow-400' : 'text-gray-400'}`} />
          </button>
          <AnimatePresence>
            {openSections.gender && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden mt-3 space-y-2"
              >
                {genders.map(gen => (
                  <div key={gen} className="flex items-center space-x-2">
                    <Checkbox
                      id={`gen-${gen}`}
                      checked={selectedGenders.includes(gen)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedGenders([...selectedGenders, gen]);
                        } else {
                          setSelectedGenders(selectedGenders.filter(g => g !== gen));
                        }
                      }}
                      className="data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 border-gray-600"
                    />
                    <label
                      htmlFor={`gen-${gen}`}
                      className="text-sm font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {gen} ({gendersCounts[gen]})
                    </label>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <hr className="my-4 border-neutral-700" />

        {/* Brand Accordion */}
        <div>
          <button
            onClick={() => toggleSection('brand')}
            className={`flex items-center justify-between w-full text-sm uppercase tracking-wide font-bold transition-colors duration-300 hover:text-yellow-400 ${openSections.brand ? 'text-yellow-400' : 'text-white'
              }`}
          >
            Brand
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openSections.brand ? 'rotate-180 text-yellow-400' : 'text-gray-400'}`} />
          </button>
          <AnimatePresence>
            {openSections.brand && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden mt-3 space-y-2"
              >
                {brands.map(brand => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBrands([...selectedBrands, brand]);
                        } else {
                          setSelectedBrands(selectedBrands.filter(b => b !== brand));
                        }
                      }}
                      className="data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 border-gray-600"
                    />
                    <label
                      htmlFor={`brand-${brand}`}
                      className="text-sm font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {brand} ({brandsCounts[brand]})
                    </label>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <hr className="my-4 border-neutral-700" />

        {/* Color Accordion */}
        <div>
          <button
            onClick={() => toggleSection('color')}
            className={`flex items-center justify-between w-full text-sm uppercase tracking-wide font-bold transition-colors duration-300 hover:text-yellow-400 ${openSections.color ? 'text-yellow-400' : 'text-white'
              }`}
          >
            Color
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openSections.color ? 'rotate-180 text-yellow-400' : 'text-gray-400'}`} />
          </button>
          <AnimatePresence>
            {openSections.color && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden mt-3 space-y-2"
              >
                {colors.map(col => (
                  <div key={col} className="flex items-center space-x-2">
                    <Checkbox
                      id={`col-${col}`}
                      checked={selectedColors.includes(col)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedColors([...selectedColors, col]);
                        } else {
                          setSelectedColors(selectedColors.filter(c => c !== col));
                        }
                      }}
                      className="data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 border-gray-600"
                    />
                    <label
                      htmlFor={`col-${col}`}
                      className="text-sm font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {col} ({colorsCounts[col]})
                    </label>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-900 text-white">

      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Header with Gradient and Animation */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">
            <span className="text-white">Shop</span>{" "}
            <span className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              Footwear
            </span>
          </h1>
          <p className="text-white text-lg mb-8">
            Discover our curated collection of premium sneakers, boots, and performance footwear designed for the modern era.
          </p>

          {/* Search + Sort */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search shoes or brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-neutral-900/50 border border-white/10 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none transition-all duration-300 ease-in-out backdrop-blur-sm"
              />
            </div>

            <div className="flex gap-2 shrink-0 items-center">
              {/* Filters (Sheet for all screens) */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-14 px-6 border-white/10 text-white hover:bg-white/5 rounded-xl flex items-center gap-2 transition-all duration-300 hover:border-yellow-400 hover:text-yellow-400"
                  >
                    <Filter className="h-5 w-5" /> Filters
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="bg-neutral-900/95 border-r-white/10 w-[320px] p-0 backdrop-blur-md"
                >
                  <ScrollArea className="h-full p-6">
                    <FilterSection />
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px] h-14 bg-neutral-900/50 border-white/10 text-white rounded-xl text-base focus:ring-yellow-400 backdrop-blur-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-white/10 text-white">
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Content Layout (no sidebar) */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-400 font-medium">
              Showing {filteredShoes.length} products
            </span>
          </div>

          {filteredShoes.length === 0 ? (
            <motion.div
              className="text-center py-20 bg-neutral-900/30 rounded-2xl border border-white/5 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your filters or search query.
              </p>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300"
              >
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredShoes.map((shoe, index) => (
                  <motion.div
                    key={shoe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
                  >
                    <ShoeCard shoe={shoe} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}