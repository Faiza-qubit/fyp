import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Check, MessageSquare, Send, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

const ratingLabels = ["Poor", "Fair", "Good", "Great", "Excellent"];
const API_BASE_URL = "http://localhost:5000/api";


export default function FeedbackForm() {
  const [error, setError] = useState(""); // <-- Add this line
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  const userId = localStorage.getItem("userId"); // <-- get userId

  if (!userId || !name || !email || !category || !rating || !message) {
    setError("Please fill all fields");
    return;
  }

  console.log("submitting feedback");
  setIsSubmitting(true);
  console.log(userId, name, email, category, rating, message);

  try {
    console.log("sending to backend");
    const response = await axios.post(`${API_BASE_URL}/feedback`, {
      userId,  // <-- include userId
      name,
      email,
      category,
      rating,
      message
    });

    console.log("Feedback submitted:", response.data);
    setIsSubmitted(true);
    resetForm();
  } catch (err) {
    console.error("Error submitting feedback:", err);
    setError(err.response?.data?.message || "Failed to submit feedback");
  } finally {
    setIsSubmitting(false);
  }
};


  const resetForm = () => {
    setName("");
    setEmail("");
    setCategory("");
    setRating(0);
    setMessage("");
    setIsSubmitted(false);
    setError("");
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background via-card/30 to-background relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px]"
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <motion.span 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-yellow-500/20 text-primary font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <MessageSquare className="w-4 h-4" />
            We Value Your Input
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Share Your{" "}
            <span className="bg-gradient-to-r from-primary via-yellow-400 to-primary bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
              Feedback
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us improve your shopping experience. Your feedback matters and helps us 
            create better products and services for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="p-8 lg:p-10 bg-gradient-to-b from-card to-card/50 border-primary/20 shadow-2xl shadow-primary/5 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-r from-primary to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30"
                  >
                    <Check className="w-10 h-10 text-primary-foreground" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-foreground mb-3"
                  >
                    Thank You for Your Feedback!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-muted-foreground mb-6"
                  >
                    We appreciate you taking the time to share your thoughts with us.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      className="border-primary/50 hover:bg-primary/10 rounded-full px-6"
                      data-testid="button-submit-another"
                    >
                      Submit Another Response
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Name & Email */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="name" className="text-foreground font-medium">
                        Full Name <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-background/50 border-primary/20 focus:border-primary rounded-xl h-12"
                        required
                        data-testid="input-feedback-name"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="email" className="text-foreground font-medium">
                        Email Address <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background/50 border-primary/20 focus:border-primary rounded-xl h-12"
                        required
                        data-testid="input-feedback-email"
                      />
                    </motion.div>
                  </div>

                  {/* Category */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2"
                  >
                    <Label className="text-foreground font-medium">
                      Feedback Category <span className="text-primary">*</span>
                    </Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger 
                        className="bg-background/50 border-primary/20 focus:border-primary rounded-xl h-12"
                        data-testid="select-feedback-category"
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">Product Quality</SelectItem>
                        <SelectItem value="website">Website Experience</SelectItem>
                        <SelectItem value="shipping">Shipping & Delivery</SelectItem>
                        <SelectItem value="customer-service">Customer Service</SelectItem>
                        <SelectItem value="virtual-try-on">Virtual Try-On Feature</SelectItem>
                        <SelectItem value="suggestion">General Suggestion</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {/* Rating */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                    className="space-y-3"
                  >
                    <Label className="text-foreground font-medium">
                      Rate Your Experience <span className="text-primary">*</span>
                    </Label>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="focus:outline-none"
                            data-testid={`button-rating-${star}`}
                          >
                            <Star
                              className={`w-8 h-8 transition-all duration-200 ${
                                star <= (hoveredRating || rating)
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          </motion.button>
                        ))}
                      </div>
                      <AnimatePresence mode="wait">
                        {(hoveredRating || rating) > 0 && (
                          <motion.span
                            key={hoveredRating || rating}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="text-sm font-medium text-primary"
                          >
                            {ratingLabels[(hoveredRating || rating) - 1]}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="message" className="text-foreground font-medium">
                      Your Feedback <span className="text-primary">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your experience, suggestions, or any issues you've encountered..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-background/50 border-primary/20 focus:border-primary rounded-xl min-h-[150px] resize-none"
                      required
                      data-testid="textarea-feedback-message"
                    />
                  </motion.div>

                  {/* Submit */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 }}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4"
                  >
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Your feedback helps us improve
                    </p>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        size="lg"
                        className="bg-gradient-to-r from-primary to-yellow-500 hover:from-primary/90 hover:to-yellow-500/90 text-primary-foreground font-semibold rounded-full px-8 gap-2 shadow-xl shadow-primary/25"
                        disabled={isSubmitting || !name || !email || !category || !rating || !message}
                        data-testid="button-submit-feedback"
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                          />
                        ) : (
                          <>
                            Submit Feedback
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <Send className="w-4 h-4" />
                            </motion.span>
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
