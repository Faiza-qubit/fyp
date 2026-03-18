import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";

const API_BASE_URL = "http://192.168.1.8:5000/api"; // Update to your backend URL

function getApiErrorMessage(err, fallbackMessage) {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }

  if (err?.code === "ERR_NETWORK") {
    return "Cannot connect to server. Please start backend on port 5000 and try again.";
  }

  return fallbackMessage;
}

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [resetPassword, setResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setLocation("/shop"); // already logged in → go shop
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Determine backend endpoint
      const endpoint = isSignUp
        ? `${API_BASE_URL}/signup`
        : `${API_BASE_URL}/login`;

      // Send request to backend
      const response = await axios.post(
        endpoint,
        isSignUp ? { name, email, password } : { email, password },
      );

      const { token, user } = response.data;
      if (!token) throw new Error("No token received from backend");

      // SAVE AUTH DATA
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("auth-changed"));

      // UPDATE LOGIN STATE
      if (setIsLoggedIn) setIsLoggedIn(true);

      // REDIRECT TO SHOP
      setLocation("/shop");
    } catch (err) {
      console.error("Auth error:", err);
      setError(getApiErrorMessage(err, "Login failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setResetMessage("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!resetPassword) {
      setError("Please enter a new password");
      return;
    }

    if (resetPassword !== confirmResetPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    const strongPassword = /^(?=.*\d)(?=.*[@$!%*#?&^_-]).{6,}$/;
    if (!strongPassword.test(resetPassword)) {
      setError(
        "Password must be 6+ characters with at least 1 number and 1 special character",
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
        email,
        newPassword: resetPassword,
      });

      setResetMessage(response.data.message || "Password updated successfully");
      setResetPassword("");
      setConfirmResetPassword("");
      setIsForgotMode(false);
      setIsSignUp(false);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to reset password"));
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
              {isForgotMode
                ? "Reset Password"
                : isSignUp
                  ? "Create Account"
                  : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground">
              {isForgotMode
                ? "Set a new password for your account"
                : isSignUp
                ? "Sign up to start shopping"
                : "Sign in to access Quick Add features"}
            </p>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {resetMessage && <p className="text-green-500 mt-2">{resetMessage}</p>}
          </div>

          <form onSubmit={isForgotMode ? handleForgotPassword : handleSubmit} className="space-y-5">
            {isSignUp && !isForgotMode && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">
                  Full Name
                </Label>
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
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
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
              <Label htmlFor="password" className="text-foreground font-medium">
                {isForgotMode ? "New Password" : "Password"}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isForgotMode ? "Enter your new password" : "Enter your password"}
                  value={isForgotMode ? resetPassword : password}
                  onChange={(e) =>
                    isForgotMode ? setResetPassword(e.target.value) : setPassword(e.target.value)
                  }
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

            {isForgotMode && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-foreground font-medium">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  value={confirmResetPassword}
                  onChange={(e) => setConfirmResetPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading
                ? "Loading..."
                : isForgotMode
                  ? "Reset Password"
                  : isSignUp
                    ? "Sign Up"
                    : "Login"}
            </Button>
          </form>

          <div className="text-center mt-4 space-y-2">
            {!isSignUp && !isForgotMode && (
              <button
                onClick={() => {
                  setIsForgotMode(true);
                  setIsSignUp(false);
                  setError("");
                  setResetMessage("");
                  setResetPassword("");
                  setConfirmResetPassword("");
                }}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Forgot Password?
              </button>
            )}

            {isForgotMode && (
              <button
                onClick={() => {
                  setIsForgotMode(false);
                  setResetPassword("");
                  setConfirmResetPassword("");
                  setError("");
                }}
                className="text-primary hover:underline block w-full"
              >
                Back to Login
              </button>
            )}

            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setIsForgotMode(false);
                setResetPassword("");
                setConfirmResetPassword("");
                setResetMessage("");
                setError("");
              }}
              className="text-primary hover:underline"
            >
              {isSignUp
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
