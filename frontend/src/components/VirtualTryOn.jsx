import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Scan, Footprints, Sparkles, Check, ArrowRight, Smartphone, Zap, Camera } from "lucide-react";
import { motion } from "framer-motion";
import heroShoe from "../assets/hero_luxury_sneaker_spotlight.png";

const steps = [
  {
    icon: Camera,
    title: "Scan Your Feet",
    description: "Use your phone camera to capture precise measurements of your feet in seconds.",
    color: "from-primary to-yellow-500",
  },
  {
    icon: Sparkles,
    title: "Select Your Style",
    description: "Browse our collection and choose the perfect pair that matches your taste.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Check,
    title: "See Perfect Fit",
    description: "View how the shoes look on your feet with realistic AR visualization.",
    color: "from-orange-500 to-primary",
  },
];

const scanLines = Array.from({ length: 8 }, (_, i) => i);

export default function VirtualTryOn() {
  return (
    <section id="try-on" className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-card/30 to-background">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"
          animate={{ x: [-100, 100, -100], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[100px]"
          animate={{ y: [100, -100, 100], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
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
            <Zap className="w-4 h-4" />
            Revolutionary Technology
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Virtual Try-On{" "}
            <span className="bg-gradient-to-r from-primary via-yellow-400 to-primary bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Never worry about fit again. Our AR technology lets you see exactly how shoes will look
            and fit before you buy.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative mx-auto w-64 sm:w-80">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-primary/30 via-yellow-500/20 to-transparent rounded-[3rem] blur-3xl"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <motion.div 
                className="relative bg-gradient-to-b from-card to-card/80 border-2 border-primary/30 rounded-[3rem] p-3 shadow-2xl shadow-primary/20"
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="bg-background rounded-[2.5rem] overflow-hidden">
                  <div className="h-8 bg-gradient-to-r from-card to-card/80 flex items-center justify-center gap-1">
                    <motion.div 
                      className="w-16 h-1.5 bg-muted rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  
                  <div className="relative aspect-[9/16] bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center overflow-hidden">
                    {scanLines.map((line, i) => (
                      <motion.div
                        key={line}
                        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                        style={{ top: `${(i + 1) * 11}%` }}
                        animate={{ opacity: [0, 1, 0], x: [-100, 100, -100] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}

                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className="w-40 h-40 border-4 border-dashed border-primary/40 rounded-2xl flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          <Footprints className="w-16 h-16 text-primary/40" />
                        </motion.div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1], 
                        y: [0, -10, 0],
                        rotateY: [0, 5, 0, -5, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute bottom-12 left-1/2 -translate-x-1/2"
                    >
                      <img
                        src={heroShoe}
                        alt="Shoe AR preview"
                        className="w-44 h-44 object-contain drop-shadow-2xl"
                        style={{ filter: "drop-shadow(0 15px 30px rgba(212, 175, 55, 0.4))" }}
                      />
                    </motion.div>

                    <motion.div
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute top-4 right-4 bg-gradient-to-r from-primary to-yellow-500 text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg"
                    >
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Scan className="w-3 h-3" />
                      </motion.span>
                      Scanning...
                    </motion.div>

                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "70%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="absolute bottom-4 left-4 right-4 h-2 bg-muted rounded-full overflow-hidden"
                    >
                      <motion.div 
                        className="h-full bg-gradient-to-r from-primary to-yellow-500 rounded-full"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </motion.div>
                  </div>
                  
                  <div className="h-4 bg-gradient-to-r from-card to-card/80" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-6 -right-6 bg-gradient-to-r from-primary to-yellow-500 text-primary-foreground px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl shadow-primary/30 flex items-center gap-2"
              >
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Smartphone className="w-4 h-4" />
                </motion.span>
                Works on any phone
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2"
          >
            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.15 }}
                  whileHover={{ x: 10, scale: 1.02 }}
                >
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/40 transition-all duration-300 group overflow-visible">
                    <div className="flex gap-4">
                      <motion.div 
                        className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <step.icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <motion.span 
                            className="text-xs bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent font-bold"
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                          >
                            Step {index + 1}
                          </motion.span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="mt-8"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-yellow-500 hover:from-primary/90 hover:to-yellow-500/90 text-primary-foreground font-semibold rounded-full px-8 gap-2 w-full sm:w-auto shadow-xl shadow-primary/25"
                >
                  Start Virtual Try-On
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
