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
  ],
  support: [
    { name: "Size Guide", href: "#" },
    { name: "Shipping Info", href: "#" },
    { name: "Returns", href: "#" },
    { name: "FAQ", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
    { name: "Contact", href: "#" },
  ],
};

const socialLinks = [
  { name: "Instagram", href: "#" },
  { name: "Twitter", href: "#" },
  { name: "Facebook", href: "#" },
];

export default function Footer() {
  
  // 🔥 HANDLE CLICK (SCROLL TO TOP)
  const handleClick = (e, href) => {
    if (href === "#") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gradient-to-b from-card to-background border-t border-primary/10 relative overflow-hidden">
      
      {/* BACKGROUND EFFECT */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]"
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        
        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-16">
          
          {/* BRAND */}
          <div className="col-span-2 lg:col-span-1">
            <motion.a href="#" onClick={(e) => handleClick(e, "#")} className="inline-block mb-6">
              <span className="text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-yellow-400 to-primary bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                  size
                </span>
                <span className="text-foreground">wise</span>
              </span>
              <Sparkles className="inline ml-1 w-4 h-4 text-primary" />
            </motion.a>

            <p className="text-muted-foreground/80 text-sm mb-6">
              Redefining footwear with AR technology and modern design.
            </p>

            <div className="space-y-2">
              {[{
                icon: MapPin,
                text: "123 Fashion Ave, NY",
              },{
                icon: Phone,
                text: "+1 (555) 123-4567",
              },{
                icon: Mail,
                text: "hello@sizewise.com",
              }].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 text-sm text-muted-foreground/80"
                  whileHover={{ x: 3, color: "#d4af37" }}
                >
                  <item.icon className="w-4 h-4 text-primary" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* LINKS */}
          {[{
            title: "Shop",
            links: footerLinks.shop,
          },{
            title: "Support",
            links: footerLinks.support,
          },{
            title: "Company",
            links: footerLinks.company,
          }].map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-4">
                {section.title}
              </h3>

              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      onClick={(e) => handleClick(e, link.href)}
                      className="text-sm text-muted-foreground/80 transition-all inline-block"
                      whileHover={{ x: 4, color: "#d4af37" }}
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* SOCIAL + PAYMENTS */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h3 className="font-semibold text-foreground mb-4">
              Follow Us
            </h3>

            <div className="flex flex-wrap gap-3 mb-6">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="text-sm text-muted-foreground/80"
                  whileHover={{ y: -2, color: "#d4af37" }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            <h3 className="font-semibold text-foreground mb-4">
              We Accept
            </h3>

            <div className="flex gap-3">
              {[SiVisa, SiMastercard, SiApplepay, SiGooglepay].map(
                (Icon, i) => (
                  <motion.div
                    key={i}
                    className="w-12 h-8 bg-muted/40 rounded-lg flex items-center justify-center border border-primary/10"
                    whileHover={{ scale: 1.08 }}
                  >
                    <Icon className="w-6 h-4 text-muted-foreground" />
                  </motion.div>
                )
              )}
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-primary/10" />

        {/* BOTTOM */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex gap-6 text-sm text-muted-foreground/80">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Secure Checkout
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Encrypted Payments
            </div>
          </div>

          <p className="text-sm text-muted-foreground/70">
            © 2024 sizewise. All rights reserved.
          </p>

          <div className="flex gap-4 text-sm text-muted-foreground/80">
            {["Privacy Policy", "Terms"].map((item) => (
              <motion.a
                key={item}
                href="#"
                onClick={(e) => handleClick(e, "#")}
                whileHover={{ color: "#d4af37" }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}