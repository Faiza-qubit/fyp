import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const API_BASE_URL = "http://localhost:5000/api"; // Update to your backend URL

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const [, setLocation] = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Determine backend endpoint
      const endpoint = isSignUp ? `${API_BASE_URL}/signup` : `${API_BASE_URL}/login`;

      // Send request to backend
      const response = await axios.post(
        endpoint,
        isSignUp ? { name, email, password } : { email, password }
      );

      const { token } = response.data;
      if (!token) throw new Error("No token received from backend");

      // Save token in localStorage
      localStorage.setItem("token", token);

      // ✅ Update login state in App
      if (setIsLoggedIn) setIsLoggedIn(true);

      // Redirect to Shop page
      setLocation("/shop");
    } catch (err) {
      console.error("Login/Signup error:", err);

      // Axios errors
      if (err.response?.data?.message) setError(err.response.data.message);
      else setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background motion blobs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[100px]"
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link href="/">
          <motion.span
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer mb-8"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </motion.span>
        </Link>

        <Card className="p-8 lg:p-10 bg-gradient-to-b from-card to-card/50 border-primary/20 shadow-2xl shadow-primary/10 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp ? "Sign up to start shopping" : "Sign in to access Quick Add features"}
            </p>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Login"}
            </Button>
          </form>

          <div className="text-center mt-4">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline">
              {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
