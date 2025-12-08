import { useEffect, useState, useRef } from "react";
import { Users, Package, Scan, RotateCcw, Award, Truck, Zap, Shield } from "lucide-react";
import { motion, useInView } from "framer-motion";

// Mock data
const stats = [
  {
    icon: Users,
    value: 500000,
    suffix: "+",
    label: "Happy Customers",
    description: "Worldwide satisfaction",
    gradient: "from-primary to-yellow-500",
  },
  {
    icon: Package,
    value: 1000,
    suffix: "+",
    label: "Shoe Models",
    description: "Curated collection",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Scan,
    value: 2,
    suffix: "M+",
    label: "Virtual Try-Ons",
    description: "AR experiences delivered",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: RotateCcw,
    value: 99,
    suffix: "%",
    label: "Satisfaction Rate",
    description: "Customer happiness",
    gradient: "from-red-500 to-primary",
  },
];

const features = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "Handcrafted with the finest materials for lasting comfort.",
    gradient: "from-primary to-yellow-500",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Complimentary shipping on all orders over $150.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Easy Returns",
    description: "30-day hassle-free return policy for peace of mind.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Zap,
    title: "AR Technology",
    description: "Try before you buy with our cutting-edge virtual fitting.",
    gradient: "from-red-500 to-primary",
  },
];

function AnimatedCounter({ value, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1);
    if (num >= 1000) return Math.floor(num / 1000) + "K";
    return num.toString();
  };

  return (
    <span
      ref={ref}
      className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-yellow-400 to-primary bg-clip-text text-transparent"
    >
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-card/50 to-background relative overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"
          animate={{ y: [0, 100, 0], x: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[100px]"
          animate={{ y: [0, -100, 0], x: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
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
            <Award className="w-4 h-4" />
            Why Choose Us
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-primary via-yellow-400 to-primary bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our growing community of satisfied customers who have experienced the
            future of shoe shopping.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="text-center group"
            >
              <motion.div
                className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${stat.gradient} rounded-2xl mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <stat.icon className="w-10 h-10 text-white" />
              </motion.div>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-lg font-semibold text-foreground mt-2">{stat.label}</p>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="bg-gradient-to-b from-card to-card/50 border border-primary/10 rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 group shadow-lg hover:shadow-xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
