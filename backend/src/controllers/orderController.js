import User from "../models/user.js";
import Order from "../models/order.js";
import Shoe from "../models/Shoe.js";

/**
 * POST /api/orders/place
 * Place an order for items in cart
 * Body: { shippingAddress, paymentMethod }
 */
export const placeOrder = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("cart.product");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.cart || user.cart.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const { shippingAddress, paymentMethod } = req.body;

    // prepare order items
    const orderItems = [];
    let totalPrice = 0;

    for (const item of user.cart) {
      const shoe = await Shoe.findById(item.product._id);
      if (!shoe) continue;

      if (shoe.stock < item.quantity)
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${shoe.name}` });

      // deduct stock
      shoe.stock -= item.quantity;
      await shoe.save();

      const price = shoe.price * item.quantity;
      totalPrice += price;

      orderItems.push({
        product: shoe._id,
        size: item.size,
        quantity: item.quantity,
        price: shoe.price,
      });
    }

    // create order
    const order = new Order({
      user: user._id,
      orderItems,
      shippingAddress,
      payment: { method: paymentMethod },
      totalPrice,
    });

    await order.save();

    // clear user's cart
    user.cart = [];
    await user.save();

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/orders/history
 * Get all orders of current user
 */
export const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
