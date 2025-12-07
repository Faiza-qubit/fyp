import { Separator } from "../components/ui/separator";
import { 
  MapPin, 
  Phone, 
  Mail,
  CreditCard,
  Shield,
  Sparkles,
} from "lucide-react";
import { SiVisa, SiMastercard, SiApplepay, SiGooglepay } from "react-icons/si";
import { motion } from "framer-motion";

const footerLinks = {
  shop: [
    { name: "New Arrivals", href: "#" },
    { name: "Best Sellers", href: "#" },
    { name: "Men's Collection", href: "#" },
    { name: "Women's Collection", href: "#" },
    { name: "Sale", href: "#" },
  ],
  support: [
    { name: "Size Guide", href: "#" },
    { name: "Shipping Info", href: "#" },
    { name: "Returns & Exchanges", href: "#" },
    { name: "Order Tracking", href: "#" },
    { name: "FAQ", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Sustainability", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
    { name: "Contact", href: "#" },
  ],
};

const socialLinks = [
  { name: "Instagram", href: "#" },
  { name: "Twitter", href: "#" },
  { name: "Facebook", href: "#" },
  { name: "TikTok", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-card to-background border-t border-primary/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <motion.div 
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]"
          animate={{ y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <motion.a 
              href="#" 
              className="inline-block mb-6 group"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-yellow-400 to-primary bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                  size
                </span>
                <span className="text-foreground">wise</span>
              </span>
              <motion.span
                className="inline-block ml-1"
                animate={{ rotate: [0, 20, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-primary inline" />
              </motion.span>
            </motion.a>
            <p className="text-muted-foreground text-sm mb-6">
              Redefining footwear with cutting-edge AR technology and timeless design.
            </p>
            <div className="space-y-3">
              {[
                { icon: MapPin, text: "123 Fashion Ave, New York, NY 10001" },
                { icon: Phone, text: "+1 (555) 123-4567" },
                { icon: Mail, text: "hello@sizewise.com" },
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-3 text-sm text-muted-foreground group cursor-default"
                  whileHover={{ x: 5, color: "hsl(var(--primary))" }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon className="w-4 h-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {[{ title: "Shop", links: footerLinks.shop },
            { title: "Support", links: footerLinks.support },
            { title: "Company", links: footerLinks.company },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
                      whileHover={{ x: 5 }}
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            <h3 className="font-semibold text-foreground mb-4">We Accept</h3>
            <div className="flex flex-wrap gap-3">
              {[SiVisa, SiMastercard, SiApplepay, SiGooglepay].map((Icon, index) => (
                <motion.div 
                  key={index}
                  className="w-12 h-8 bg-muted/50 rounded-lg flex items-center justify-center border border-primary/10"
                  whileHover={{ scale: 1.1, borderColor: "hsl(var(--primary) / 0.5)" }}
                >
                  <Icon className="w-6 h-4 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-primary/10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div 
            className="flex items-center gap-6 text-sm text-muted-foreground"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {[{ icon: Shield, text: "Secure Checkout" },
              { icon: CreditCard, text: "Encrypted Payments" },
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <item.icon className="w-4 h-4 text-primary" />
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.p 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © 2024 sizewise. All rights reserved.
          </motion.p>

          <motion.div 
            className="flex gap-4 text-sm text-muted-foreground"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {[{ name: "Privacy Policy", id: "privacy" },
              { name: "Terms of Service", id: "terms" },
            ].map((link) => (
              <motion.a 
                key={link.id}
                href="#" 
                className="hover:text-primary transition-colors" 
                whileHover={{ scale: 1.05 }}
              >
                {link.name}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
