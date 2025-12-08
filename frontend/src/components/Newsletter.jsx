import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Send, Sparkles, Check, Zap, Gift } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  { icon: Gift, text: "Early access to limited editions" },
  { icon: Zap, text: "Exclusive member discounts" },
  { icon: Sparkles, text: "VIP styling tips" },
];

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // todo: replace mock functionality with actual newsletter API
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      console.log("Newsletter signup:", email);
    }, 1000);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background via-card/30 to-background relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 30, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-yellow-500/5 rounded-full blur-[80px]"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]"
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-yellow-500 text-primary-foreground px-5 py-2.5 rounded-full mb-6 shadow-lg shadow-primary/25"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.span>
            <span className="text-sm font-semibold">Exclusive Access</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Never Miss{" "}
            <span className="bg-gradient-to-r from-primary via-yellow-400 to-primary bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
              A Drop
            </span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Subscribe to get early access to limited editions, exclusive discounts, 
            and be the first to know about our latest collections.
          </p>

          {/* Benefits */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.text}
                className="flex items-center gap-2 text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, color: "hsl(var(--primary))" }}
              >
                <benefit.icon className="w-5 h-5 text-primary" />
                <span className="text-sm">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Form or Confirmation */}
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/20 to-yellow-500/20 text-primary px-8 py-5 rounded-2xl border border-primary/30"
            >
              <motion.div
                className="w-10 h-10 bg-gradient-to-r from-primary to-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <Check className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <span className="font-semibold text-lg">You're on the list! Check your inbox.</span>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <motion.div className="flex-1" whileFocus={{ scale: 1.02 }}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 bg-card/50 backdrop-blur-sm border-primary/20 focus:border-primary rounded-full px-6 text-foreground placeholder:text-muted-foreground shadow-lg"
                  required
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gradient-to-r from-primary to-yellow-500 hover:from-primary/90 hover:to-yellow-500/90 text-primary-foreground font-semibold rounded-full px-8 gap-2 h-14 shadow-xl shadow-primary/25"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Subscribe
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
            </motion.form>
          )}

          <motion.p
            className="text-sm text-muted-foreground mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            Join <span className="text-primary font-semibold">50,000+</span> subscribers. Unsubscribe anytime.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
