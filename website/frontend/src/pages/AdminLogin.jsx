// src/pages/AdminLogin.jsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Lock, Shield } from "lucide-react";
import { useState } from "react";

// ⭐ Wouter navigation hook
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ⭐ Wouter navigate function
  const [location, navigate] = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hardcoded admin password
    if (password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");   // ⭐ Wouter navigation
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-neutral-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-neutral-900/80 backdrop-blur-xl border-white/10 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl mb-4">
              <Shield className="w-12 h-12 text-black" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Admin Access
            </h1>
            <p className="text-gray-400 mt-2">Enter password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="pl-12 h-14 bg-neutral-800 border-white/10 text-white placeholder-gray-500 rounded-xl text-lg"
                autoFocus
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-center font-medium"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold text-lg h-14 rounded-xl shadow-xl transition-all duration-300"
            >
              Access Dashboard
            </Button>

            <p className="text-center text-xs text-gray-500 mt-6">
              Hint: password is{" "}
              <code className="text-yellow-400 font-mono">admin123</code>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
