import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import ProtectedRoute from "../src/components/ProtectedRoute";
import { Toaster } from "../src/components/ui/toaster";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";

// Pages
import Admin from "../src/pages/Admin";
import AdminLogin from "../src/pages/AdminLogin";
import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import NotFound from "../src/pages/not-found";
import Payment from "../src/pages/Payment";
import ProductDetails from "../src/pages/ProductDetails";
import Shop from "../src/pages/Shop";
import StockAnalysis from "../src/pages/StockAnalysis";

// Layout
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";

function Router({ isLoggedIn, setIsLoggedIn }) {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <ProtectedRoute path="/shop" component={Shop} isLoggedIn={isLoggedIn} />
      <ProtectedRoute path="/product/:id" component={ProductDetails} isLoggedIn={isLoggedIn} />
      <Route path="/payment" component={Payment} />
      <Route path="/login" component={() => <Login setIsLoggedIn={setIsLoggedIn} />} />

      {/* Admin */}
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin" component={Admin} />
      <Route path="/stock-analysis" component={StockAnalysis} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // ✅ Track login state dynamically
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Optional: listen to changes in localStorage (multi-tab support)
  useEffect(() => {
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />

        {/* Navigation */}
        <Navigation />

        {/* Main */}
        <main className="min-h-screen bg-background text-foreground pt-20">
          <Router isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </main>

        {/* Footer */}
        <Footer />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
