import Payment from "../models/Payment.js";
import Stripe from "stripe";

// Helper function to get Stripe instance
function getStripe() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeKey) {
    throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
  }
  
  if (!stripeKey.startsWith("sk_test_") && !stripeKey.startsWith("sk_live_")) {
    throw new Error("STRIPE_SECRET_KEY is invalid - should start with sk_test_ or sk_live_");
  }
  
  return new Stripe(stripeKey);
}

// POST create payment intent
export const createPaymentIntent = async (req, res) => {
  try {
    const stripe = getStripe();
    
    const {
      amount,
      email,
      fullName,
      shoeId,
      shoeSize,
      shoeColor,
    } = req.body;

    // Validate amount
    if (!amount || amount < 1) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        email,
        fullName,
        shoeId,
        shoeSize,
        shoeColor,
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    res.status(500).json({
      success: false,
      message: "Error creating payment intent",
      error: err.message,
    });
  }
};

// POST confirm payment
export const confirmPayment = async (req, res) => {
  try {
    const stripe = getStripe();
    
    const {
      paymentIntentId,
      fullName,
      email,
      phone,
      address,
      city,
      zipCode,
      country,
      shoeId,
      shoeSize,
      shoeColor,
      amount,
    } = req.body;

    // Validate required fields
    if (!paymentIntentId || !fullName || !email || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: paymentIntentId, fullName, email, amount",
      });
    }

    // Verify payment with Stripe
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (stripeErr) {
      return res.status(400).json({
        success: false,
        message: `Failed to retrieve payment from Stripe: ${stripeErr.message}`,
      });
    }

    if (!paymentIntent) {
      return res.status(400).json({
        success: false,
        message: "Payment intent not found",
      });
    }

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: `Payment status is '${paymentIntent.status}', not 'succeeded'`,
      });
    }

    // Create payment record in database
    const payment = new Payment({
      fullName,
      email,
      phone: phone || "",
      address: address || "",
      city: city || "",
      zipCode: zipCode || "",
      country: country || "",
      cardName: fullName,
      cardNumber: "****-****-****-****", // Stripe handles this securely
      expiryDate: "****",
      cvv: "***",
      shoeId: shoeId || null,
      shoeSize: shoeSize || "",
      shoeColor: shoeColor || "",
      amount,
      stripePaymentIntentId: paymentIntentId,
      status: "completed",
    });

    const savedPayment = await payment.save();
    console.log("Payment saved successfully:", savedPayment._id);

    res.status(201).json({
      success: true,
      message: "Payment confirmed successfully",
      payment: savedPayment,
    });
  } catch (err) {
    console.error("Error confirming payment:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    res.status(500).json({
      success: false,
      message: "Error confirming payment",
      error: err.message,
    });
  }
};

// GET all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(payment);
  } catch (err) {
    console.error("Error fetching payment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET payments by email
export const getPaymentsByEmail = async (req, res) => {
  try {
    const payments = await Payment.find({ email: req.params.email }).sort({
      createdAt: -1,
    });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ message: "Server error" });
  }
};
