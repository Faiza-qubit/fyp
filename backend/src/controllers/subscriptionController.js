import Subscription from "../models/Subscription.js";

export const checkSubscription = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const exists = await Subscription.findOne({ email: normalizedEmail });

    return res.json({
      alreadySubscribed: !!exists,
      message: exists ? "Already subscribed" : "Not subscribed",
    });
  } catch (err) {
    console.error("Check subscription error:", err);
    res.status(500).json({ message: "Error checking subscription" });
  }
};


// ✅ SUBSCRIBE USER
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const upsertResult = await Subscription.updateOne(
      { email: normalizedEmail },
      { $setOnInsert: { email: normalizedEmail } },
      { upsert: true }
    );

    const alreadySubscribed = upsertResult.upsertedCount === 0;

    return res.status(200).json({
      success: true,
      alreadySubscribed,
      message: alreadySubscribed
        ? "This email is already subscribed."
        : "Subscription successful.",
    });

  } catch (err) {
    console.error("Subscription error:", err);

    return res.status(500).json({
      success: false,
      message: "Subscription failed",
    });
  }
};