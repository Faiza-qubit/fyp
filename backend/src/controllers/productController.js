import Shoe from "../models/Shoe.js";

export const getProducts = async (req,res) => {
  try {
    const { brand, category, gender, color, minPrice, maxPrice } = req.query;
    let filter = {};
    if (brand) filter.brand = brand;
    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (color) filter.color = color;
    if (minPrice || maxPrice) filter.price = { $gte: minPrice || 0, $lte: maxPrice || 999999 };

    const shoes = await Shoe.find(filter);
    res.json(shoes);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (req,res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);
    if (!shoe) return res.status(404).json({ message:"Shoe not found" });
    res.json(shoe);
  } catch(err){
    res.status(500).json({ message: err.message });
  }
};
