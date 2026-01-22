import User from "../models/user.js";
import Shoe from "../models/Shoe.js";

/**
 * GET /api/cart
 * Get all items in user's cart
 */
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("addresses");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ cart: user.cart || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/cart/add
 * Body: { productId, size, quantity }
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const shoe = await Shoe.findById(productId);
    if (!shoe) return res.status(404).json({ message: "Shoe not found" });

    if (!shoe.sizes.includes(size))
      return res.status(400).json({ message: "Selected size not available" });

    if (shoe.stock < quantity)
      return res.status(400).json({ message: "Insufficient stock" });

    // check if item already in cart
    const existingItem = user.cart?.find(
      (c) => c.product.toString() === productId && c.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      if (!user.cart) user.cart = [];
      user.cart.push({ product: productId, size, quantity });
    }

    await user.save();
    res.status(200).json({ cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /api/cart/update
 * Body: { productId, size, quantity }
 */
export const updateCartItem = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const item = user.cart.find(
      (c) => c.product.toString() === productId && c.size === size
    );
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    if (quantity <= 0) {
      // remove item
      user.cart = user.cart.filter(
        (c) => !(c.product.toString() === productId && c.size === size)
      );
    } else {
      // check stock
      const shoe = await Shoe.findById(productId);
      if (shoe.stock < quantity)
        return res.status(400).json({ message: "Insufficient stock" });

      item.quantity = quantity;
    }

    await user.save();
    res.status(200).json({ cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /api/cart/remove/:productId?size=
 */
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { size } = req.query;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(
      (c) => !(c.product.toString() === productId && c.size === size)
    );

    await user.save();
    res.status(200).json({ cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
