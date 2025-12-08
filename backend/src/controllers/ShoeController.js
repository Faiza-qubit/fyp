import Shoe from "../models/Shoe.js";

// GET all shoes
export const getAllShoes = async (req, res) => {
  try {
    const shoes = await Shoe.find();
    res.status(200).json(shoes);
  } catch (err) {
    console.error("Error fetching shoes:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST a new shoe
export const createShoe = async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    const requiredFields = ["name", "brand", "category", "gender", "color", "price"];
    for (let field of requiredFields) {
      if (!data[field]) return res.status(400).json({ message: `Missing ${field}` });
    }

    const shoe = new Shoe({
      ...data,
      price: Number(data.price),
      stock: Number(data.stock) || 50,
      sizes: Array.isArray(data.sizes)
        ? data.sizes
        : data.sizes?.split(",").map((s) => s.trim()) || [],
      arEnabled: data.arEnabled || false,
    });

    await shoe.save();
    res.status(201).json(shoe);
  } catch (err) {
    console.error("Error saving shoe:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET shoe by ID
export const getShoeById = async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);
    if (!shoe) return res.status(404).json({ message: "Shoe not found" });
    res.status(200).json(shoe);
  } catch (err) {
    console.error("Error fetching shoe:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE shoe
export const updateShoe = async (req, res) => {
  try {
    const data = {
      ...req.body,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      sizes: Array.isArray(req.body.sizes)
        ? req.body.sizes
        : req.body.sizes?.split(",").map((s) => s.trim()) || [],
      arEnabled: req.body.arEnabled || false,
    };

    const shoe = await Shoe.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!shoe) return res.status(404).json({ message: "Shoe not found" });
    res.status(200).json(shoe);
  } catch (err) {
    console.error("Error updating shoe:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE shoe
export const deleteShoe = async (req, res) => {
  try {
    const shoe = await Shoe.findByIdAndDelete(req.params.id);
    if (!shoe) return res.status(404).json({ message: "Shoe not found" });
    res.status(200).json({ message: "Shoe deleted" });
  } catch (err) {
    console.error("Error deleting shoe:", err);
    res.status(500).json({ message: "Server error" });
  }
};
