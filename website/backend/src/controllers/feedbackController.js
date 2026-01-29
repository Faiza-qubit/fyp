import Feedback from "../models/Feedback.js";

// Create new feedback
export const createFeedback = async (req, res) => {
  const { userId, name, email, category, rating, message } = req.body;

  if (!userId || !name || !email || !category || !rating || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newFeedback = await Feedback.create({
      userId,
      name,
      email,
      category,
      rating,
      message,
    });

    res.status(201).json({ message: "Feedback submitted successfully.", feedback: newFeedback });
    console.log("New feedback created:", newFeedback);
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Get all feedbacks (optional admin route)
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("userId", "name email");
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
};
