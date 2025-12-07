// src/pages/Admin.jsx
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SHOES } from "@/lib/mockData";
import {
    AlertCircle,
    DollarSign,
    Edit,
    Package,
    Plus,
    Search,
    Sparkles,
    Trash2,
    TrendingUp,
} from "lucide-react";

const categories = ["Running", "Casual", "Formal", "Sneakers"];
const genders = ["Men", "Women", "Unisex"];
const brands = ["Nike", "Adidas", "Puma", "Clarks", "Gucci", "Jordan", "New Balance"];
const colors = ["Black", "White", "Red", "Blue", "Green", "Gold", "Gray"];

export default function Admin() {
  const [shoes, setShoes] = useState(SHOES);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingShoe, setEditingShoe] = useState(null);
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    category: "",
    gender: "",
    color: "",
    description: "",
    sizes: "8,9,10,11,12",
    stock: "",
    image: "https://via.placeholder.com/400",
    arEnabled: false,
  });

  // Stats
  const stats = {
    totalProducts: shoes.length,
    totalStock: shoes.reduce((acc, s) => acc + (s.stock || 50), 0),
    totalValue: shoes.reduce((acc, s) => acc + s.price * (s.stock || 50), 0),
    lowStock: shoes.filter(s => (s.stock || 50) < 10).length,
  };

  // Filtered shoes based on search
  const filteredShoes = useMemo(() => {
    return shoes.filter(
      (shoe) =>
        shoe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shoe.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [shoes, searchTerm]);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const newShoe = {
      id: editingShoe ? editingShoe.id : Date.now(),
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock) || 50,
      sizes: formData.sizes.split(",").map(s => s.trim()),
      rating: editingShoe?.rating || 4.8,
      reviews: editingShoe?.reviews || 128,
    };

    if (editingShoe) {
      setShoes(shoes.map((s) => (s.id === editingShoe.id ? newShoe : s)));
    } else {
      setShoes([...shoes, newShoe]);
    }

    setIsAddOpen(false);
    setEditingShoe(null);
    setFormData({
      name: "",
      brand: "",
      price: "",
      category: "",
      gender: "",
      color: "",
      description: "",
      sizes: "8,9,10,11,12",
      stock: "",
      image: "https://via.placeholder.com/400",
      arEnabled: false,
    });
  };

  const handleEdit = (shoe) => {
    setEditingShoe(shoe);
    setFormData({
      name: shoe.name,
      brand: shoe.brand,
      price: shoe.price.toString(),
      category: shoe.category,
      gender: shoe.gender,
      color: shoe.color,
      description: shoe.description || "",
      sizes: Array.isArray(shoe.sizes) ? shoe.sizes.join(",") : "8,9,10,11,12",
      stock: (shoe.stock || 50).toString(),
      image: shoe.image,
      arEnabled: shoe.arEnabled || false,
    });
    setIsAddOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this shoe permanently?")) {
      setShoes(shoes.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-neutral-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </h1>
          <p className="text-xl text-gray-400">Manage your luxury shoe inventory</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Package, label: "Total Products", value: stats.totalProducts, color: "from-blue-500 to-cyan-400" },
            { icon: TrendingUp, label: "In Stock", value: stats.totalStock, color: "from-green-500 to-emerald-400" },
            { icon: DollarSign, label: "Inventory Value", value: `$${stats.totalValue.toLocaleString()}`, color: "from-yellow-500 to-amber-400" },
            { icon: AlertCircle, label: "Low Stock", value: stats.lowStock, color: "from-red-500 to-pink-400" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="bg-neutral-900/50 backdrop-blur border border-white/10 rounded-2xl p-6 text-center">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-sm text-gray-400 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-0 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search shoes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-neutral-900/50 border-white/10 text-white placeholder-gray-500 rounded-xl h-12"
            />
          </div>

          {/* Add/Edit Dialog */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold rounded-xl shadow-xl shadow-yellow-500/20"
                onClick={() => {
                  setEditingShoe(null);
                  setFormData({
                    name: "",
                    brand: "",
                    price: "",
                    category: "",
                    gender: "",
                    color: "",
                    description: "",
                    sizes: "8,9,10,11,12",
                    stock: "",
                    image: "https://via.placeholder.com/400",
                    arEnabled: false,
                  });
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Shoe
              </Button>
              
            </DialogTrigger>

            <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  {editingShoe ? "Edit Shoe" : "Add New Shoe"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-neutral-800 border-white/10"
                    />
                  </div>
                  <div>
                    <Label>Brand</Label>
                    <Select
                      value={formData.brand}
                      onValueChange={(v) => setFormData({ ...formData, brand: v })}
                    >
                      <SelectTrigger className="bg-neutral-800 border-white/10">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price / Category / Gender */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-neutral-800 border-white/10"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => setFormData({ ...formData, category: v })}
                    >
                      <SelectTrigger className="bg-neutral-800 border-white/10">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(v) => setFormData({ ...formData, gender: v })}
                    >
                      <SelectTrigger className="bg-neutral-800 border-white/10">
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genders.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Color / Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Color</Label>
                    <Select
                      value={formData.color}
                      onValueChange={(v) => setFormData({ ...formData, color: v })}
                    >
                      <SelectTrigger className="bg-neutral-800 border-white/10">
                        <SelectValue placeholder="Color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Stock Quantity</Label>
                    <Input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="50"
                      className="bg-neutral-800 border-white/10"
                    />
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <Label>Sizes (comma separated)</Label>
                  <Input
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="8, 9, 10, 11, 12"
                    className="bg-neutral-800 border-white/10"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label>Description (optional)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-neutral-800 border-white/10 min-h-24"
                  />
                </div>

                {/* Image Upload / URL */}
                <div>
                  <Label>Image</Label>
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    {/* URL input */}
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Paste image URL"
                      className="bg-neutral-800 border-white/10 flex-1"
                    />
                    {/* File upload */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setFormData({ ...formData, image: event.target.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="bg-neutral-800 border-white/10 px-2 py-1 rounded-xl text-sm cursor-pointer"
                    />
                  </div>
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="mt-4 w-32 h-32 object-cover rounded-lg border border-white/10"
                    />
                  )}
                </div>

                {/* AR Checkbox */}
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    id="arEnabled"
                    checked={formData.arEnabled}
                    onChange={(e) => setFormData({ ...formData, arEnabled: e.target.checked })}
                    className="accent-yellow-400"
                  />
                  <label htmlFor="arEnabled" className="text-gray-300 font-medium">AR Enabled</label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold">
                    {editingShoe ? "Update Shoe" : "Add Shoe"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-black font-bold rounded-xl shadow-xl shadow-blue-500/20"
            onClick={() => setLocation("/stock-analysis")}
            >
            <Package className="w-5 h-5 mr-2" />
            View Stock Analysis
            </Button>

        </div>

        {/* Shoes Table */}
        <div className="bg-neutral-900/50 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
          <ScrollArea className="h-96">
            <table className="w-full">
              <thead className="bg-neutral-800/50 sticky top-0 z-10">
                <tr>
                  <th className="text-left p-6 font-medium text-gray-300">Image</th>
                  <th className="text-left p-6 font-medium text-gray-300">Name</th>
                  <th className="text-left p-6 font-medium text-gray-300">Brand</th>
                  <th className="text-left p-6 font-medium text-gray-300">Price</th>
                  <th className="text-left p-6 font-medium text-gray-300">Stock</th>
                  <th className="text-left p-6 font-medium text-gray-300">AR</th>
                  <th className="text-left p-6 font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredShoes.map((shoe) => (
                    <motion.tr key={shoe.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-6">
                        <img src={shoe.image} alt={shoe.name} className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                      </td>
                      <td className="p-6 font-medium">{shoe.name}</td>
                      <td className="p-6">
                        <Badge variant="outline" className="border-yellow-400/30 text-yellow-400">{shoe.brand}</Badge>
                      </td>
                      <td className="p-6 font-bold text-yellow-400">${shoe.price}</td>
                      <td className="p-6">
                        <span className={shoe.stock < 10 ? "text-red-400" : "text-green-400"}>{shoe.stock || 50} left</span>
                      </td>
                      <td className="p-6">{shoe.arEnabled ? <Sparkles className="w-4 h-4 text-yellow-400" /> : "-"}</td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(shoe)}><Edit className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => handleDelete(shoe.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
