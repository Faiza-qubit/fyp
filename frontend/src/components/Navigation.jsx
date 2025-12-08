import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Search, ShoppingBag, Menu, X, Scan, Sparkles, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount] = useState(2); // TODO: remove mock

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "New Arrivals", href: "#new" },
    { name: "Collections", href: "#collections" },
    { name: "Virtual Try-On", href: "#try-on" },
    { name: "About", href: "#about" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-primary/20 shadow-lg shadow-primary/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* ---- LOGO (updated to Link) ---- */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              className="relative"
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-yellow-400 to-primary bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                  size
                </span>
                <span className="text-foreground">wise</span>
              </span>

              <motion.span
                className="absolute -top-1 -right-2 text-primary"
                animate={{ rotate: [0, 20, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-3 h-3" />
              </motion.span>
            </motion.div>
          </Link>

          {/* ---- DESKTOP NAV LINKS ---- */}
          <div className="hidden md:flex items-center gap-8">
            {/* Existing anchors */}
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -2 }}
              >
                {link.name}
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-yellow-400 rounded-full"
                  initial={{ width: "0%" }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}

            {/* ---- NEW SHOP LINK ---- */}
            <Link
              to="/shop"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
            >
              Shop
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary to-yellow-400 rounded-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* ---- RIGHT CONTROLS ---- */}
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
              <Search className="w-5 h-5" />
            </Button>

            <div className="relative">
              <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
                <ShoppingBag className="w-5 h-5" />
              </Button>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary to-yellow-500 text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-primary/30"
                >
                  {cartCount}
                </motion.span>
              )}
            </div>

            <Link href="/login">
              <Button variant="outline" className="hidden sm:flex gap-2 border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary rounded-full px-5 transition-all duration-300">
                <Plus className="w-4 h-4" />
                Quick Add
              </Button>
            </Link>

            <Button className="hidden sm:flex gap-2 bg-gradient-to-r from-primary to-yellow-500 hover:from-primary/90 hover:to-yellow-500/90 text-primary-foreground font-semibold rounded-full px-6 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105">
              <Scan className="w-4 h-4" />
              Try Virtual Fit
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="md:hidden text-muted-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* ---- MOBILE MENU ---- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="md:hidden bg-background/95 border-t border-primary/20"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="block text-lg font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}

              {/* ---- MOBILE SHOP LINK ---- */}
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg font-medium text-foreground hover:text-primary transition-colors"
              >
                Shop
              </Link>

              <div className="space-y-3 mt-4">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full gap-2 border-primary/50 text-foreground hover:bg-primary/10 rounded-full">
                    <Plus className="w-4 h-4" />
                    Quick Add
                  </Button>
                </Link>

                <Button className="w-full gap-2 bg-gradient-to-r from-primary to-yellow-500 text-primary-foreground font-semibold rounded-full">
                  <Scan className="w-4 h-4" />
                  Try Virtual Fit
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
