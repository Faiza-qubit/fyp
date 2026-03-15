import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch, useLocation } from "wouter";
import ProtectedRoute from "../src/components/ProtectedRoute";
import { Toaster } from "../src/components/ui/toaster";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";

// Pages
import Admin from "../src/pages/Admin";
import AdminLogin from "../src/pages/AdminLogin";
import About from "../src/pages/About";
import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import NotFound from "../src/pages/not-found";
import NewArrivals from "../src/pages/NewArrivals";
import Payment from "../src/pages/Payment";
import ProductDetails from "../src/pages/ProductDetails";
import Profile from "../src/pages/Profile";
import Shop from "../src/pages/Shop";
import StockAnalysis from "../src/pages/StockAnalysis";
import Cart from "../src/pages/Cart";
import Collections from "../src/pages/Collections";
import VirtualTryOnPage from "../src/pages/VirtualTryOnPage";

// Layout
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";

function ScrollToTopOnRouteChange() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router({ isLoggedIn, setIsLoggedIn }) {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/new-arrivals" component={NewArrivals} />
      <Route path="/collections" component={Collections} />
      <Route path="/virtual-try-on" component={VirtualTryOnPage} />
      <Route path="/about" component={About} />
      <ProtectedRoute path="/shop" component={Shop} isLoggedIn={isLoggedIn} />
      <ProtectedRoute path="/product/:id" component={ProductDetails} isLoggedIn={isLoggedIn} />
      <ProtectedRoute path="/cart" component={Cart} isLoggedIn={isLoggedIn} />
      <ProtectedRoute path="/profile" component={Profile} isLoggedIn={isLoggedIn} />
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
    const handleAuthChanged = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-changed", handleAuthChanged);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-changed", handleAuthChanged);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ScrollToTopOnRouteChange />

        {/* Navigation */}
        <Navigation isLoggedIn={isLoggedIn} />

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
