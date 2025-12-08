import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Star, ChevronLeft, ChevronRight, Quote, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data
const testimonials = [
  {
    id: 1,
    name: "Alexander Chen",
    role: "Professional Athlete",
    content: "The virtual try-on feature is incredible! I was able to find the perfect running shoes without stepping into a store. The fit was exactly as predicted.",
    rating: 5,
    initials: "AC",
    gradient: "from-primary to-yellow-500",
  },
  {
    id: 2,
    name: "Sophia Williams",
    role: "Fashion Designer",
    content: "As someone who's very particular about footwear, sizewise exceeded my expectations. The quality and attention to detail in every pair is remarkable.",
    rating: 5,
    initials: "SW",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    role: "Business Executive",
    content: "Finally, a brand that understands both style and comfort. My Oxford Sovereigns are perfect for long business meetings. Worth every penny.",
    rating: 5,
    initials: "MJ",
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    role: "Content Creator",
    content: "The AR technology is mind-blowing! I've bought five pairs already because I know exactly how they'll look. Zero returns so far!",
    rating: 5,
    initials: "ER",
    gradient: "from-red-500 to-primary",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-card/30 via-card/50 to-card/30 relative overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]"
          animate={{ x: [-100, 100, -100] }}
          transition={{ duration: 30, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px]"
          animate={{ x: [100, -100, 100] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-yellow-500/20 text-primary font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <MessageCircle className="w-4 h-4" />
            Customer Stories
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            What Our{" "}
            <span className="bg-gradient-to-r from-primary via-yellow-400 to-primary bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
              Customers
            </span>{" "}
            Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers 
            have to say about their experience.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="relative">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {visibleTestimonials.map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.id}-${currentIndex}`}
                  initial={{ opacity: 0, x: index === 0 ? -50 : 50, rotateY: index === 0 ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={{ opacity: 0, x: index === 0 ? -50 : 50, rotateY: index === 0 ? -10 : 10 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  style={{ perspective: "1000px" }}
                >
                  <Card 
                    className="p-6 lg:p-8 bg-gradient-to-b from-card to-card/50 border-primary/10 hover:border-primary/40 h-full relative overflow-visible transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <motion.div
                      className="absolute top-4 right-4"
                      animate={{ rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Quote className="w-12 h-12 text-primary/10" />
                    </motion.div>
                    
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="w-5 h-5 fill-primary text-primary" />
                        </motion.div>
                      ))}
                    </div>

                    <p className="text-foreground text-lg leading-relaxed mb-6">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Avatar className={`w-14 h-14 border-2 border-primary/30 shadow-lg bg-gradient-to-br ${testimonial.gradient}`}>
                          <AvatarFallback className="bg-transparent text-white font-bold text-lg">
                            {testimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <motion.div 
            className="flex items-center justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-primary/30 hover:border-primary hover:bg-primary/10 shadow-lg"
                onClick={prevTestimonial}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </motion.div>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "bg-gradient-to-r from-primary to-yellow-500 w-8" 
                      : "bg-primary/30 hover:bg-primary/50 w-2"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-primary/30 hover:border-primary hover:bg-primary/10 shadow-lg"
                onClick={nextTestimonial}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
