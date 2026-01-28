import { motion } from "framer-motion";
import { ArrowRight, Award, RotateCcw, Scan, Shield, Zap } from "lucide-react";
import { useLocation } from "wouter";
import heroShoe from "../assets/hero_luxury_sneaker_spotlight.png";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
// Or use: UserCog, Settings, Lock, Crown for a more premium feel
const floatingParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 10 + 10,
  delay: Math.random() * 5,
}));

export default function HeroSection() {
  // Inside HeroSection:
const [, setLocation] = useLocation()
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-16">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[100px]"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/5"
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        />

        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary) / 0.3) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6"
            >
              {[{ icon: RotateCcw, text: "360° View" },
                { icon: Scan, text: "AR Try-On" },
                { icon: Award, text: "Premium Quality" },
              ].map((badge, index) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <Badge 
                    variant="outline" 
                    className="border-primary/50 text-primary gap-1.5 px-3 py-1.5 bg-primary/5 backdrop-blur-sm hover:bg-primary/10 transition-colors cursor-default"
                  >
                    <badge.icon className="w-3 h-3" />
                    {badge.text}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.span 
                className="block text-foreground"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                Find Your
              </motion.span>
              <motion.span 
                className="block relative"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <span className="bg-gradient-to-r from-primary via-yellow-400 to-primary bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                  Perfect Fit
                </span>
                <motion.span
                  className="absolute -right-8 top-0"
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                </motion.span>
              </motion.span>
            </motion.h1>

            <motion.p 
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Experience luxury footwear like never before. Try shoes virtually with our 
              cutting-edge AR technology before making your perfect choice.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-yellow-500 hover:from-primary/90 hover:to-yellow-500/90 text-primary-foreground font-semibold rounded-full px-8 gap-2 shadow-xl shadow-primary/25 transition-all duration-300"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Scan className="w-5 h-5" />
                  </motion.span>
                  Try Virtual Fit
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/50 text-foreground hover:bg-primary/10 rounded-full px-8 gap-2 backdrop-blur-sm"
                  onClick={() => setLocation("/shop")}
                >
                  Shop Collection
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              {[{ value: "500K+", label: "Happy Customers", id: "customers" },
                { value: "1000+", label: "Shoe Models", id: "models" },
                { value: "4.9", label: "Average Rating", id: "rating" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group cursor-default"
                >
                  <p 
                    className="text-3xl font-bold bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent group-hover:animate-pulse-glow"
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center perspective-1000"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full border-2 border-primary/30"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div 
                className="absolute w-72 h-72 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] rounded-full border border-primary/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute w-80 h-80 sm:w-[26rem] sm:h-[26rem] lg:w-[32rem] lg:h-[32rem] rounded-full border border-primary/10"
                animate={{ rotate: -360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <motion.div
              className="relative z-10"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-primary/30 via-yellow-500/20 to-transparent rounded-full blur-3xl scale-90"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ rotateY: { duration: 20, repeat: Infinity, ease: "linear" } }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.img
                  src={heroShoe}
                  alt="Premium luxury sneaker with golden accents"
                  className="w-72 h-72 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] object-contain drop-shadow-2xl"
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ filter: "drop-shadow(0 25px 50px rgba(212, 175, 55, 0.3))" }}
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 80, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="absolute top-10 right-0 lg:right-5 bg-card/90 backdrop-blur-xl border border-primary/30 rounded-2xl p-4 shadow-2xl shadow-primary/10"
            >
              <p className="text-xs text-muted-foreground">Starting from</p>
              <motion.p 
                className="text-2xl font-bold bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                $299
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -80, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.4, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="absolute bottom-10 left-0 lg:left-5 bg-card/90 backdrop-blur-xl border border-primary/30 rounded-2xl p-4 shadow-2xl shadow-primary/10"
            >
              <p className="text-xs text-muted-foreground">Free Shipping</p>
              <p className="text-sm font-medium text-foreground">Orders over $150</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <motion.div
            className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center pt-2"
            animate={{ borderColor: ["rgba(212, 175, 55, 0.3)", "rgba(212, 175, 55, 0.8)", "rgba(212, 175, 55, 0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className="w-1.5 h-3 bg-gradient-to-b from-primary to-yellow-400 rounded-full"
              animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
            {/* Floating Admin Panel Button - Only for admins */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute top-8 right-6 z-50"
      >
        <motion.a
          href="/admin-login" // Change to your actual admin route
          className="group relative flex items-center justify-center w-14 h-14 bg-card/80 backdrop-blur-xl border border-primary/30 rounded-full shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          title="Admin Dashboard"
        >
          {/* Admin Icon - Using Lucide Shield (common for admin) */}
          <Shield className="w-6 h-6 text-primary group-hover:text-yellow-400 transition-colors" />

          {/* Optional: You can use UserCog or Settings instead */}
          {/* <UserCog className="w-6 h-6 text-primary" /> */}

          {/* Pulse ring effect */}
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></span>
          <span className="absolute inset-0 rounded-full bg-primary/10 scale-150 animate-pulse"></span>
        </motion.a>

        {/* Tooltip */}
        <span className="absolute -bottom-10 right-0 whitespace-nowrap text-xs font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Admin Panel
        </span>
      </motion.div>
    </section>
  );
}
