import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch, useLocation } from "wouter";
import ProtectedRoute from "../src/components/ProtectedRoute";
import { Toaster } from "../src/components/ui/toaster";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";

// Pages
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/not-found";
import NewArrivals from "./pages/NewArrivals";
import Payment from "./pages/Payment";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import StockAnalysis from "./pages/StockAnalysis";
import Cart from "./pages/Cart";
import Collections from "./pages/Collections";
import VirtualTryOnPage from "./pages/VirtualTryOnPage";
import MeasureFeet from "./pages/measureFeet";
import FootTryOn from "./pages/FootTryOn";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import VirtualTryOn from "./components/VirtualTryOn";

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
      {/* Public */}
      <Route path="/" component={Home} />
      <Route path="/new-arrivals" component={NewArrivals} />
      <Route path="/collections" component={Collections} />
      <Route path="/about" component={About} />
      <Route path="/virtual-try-on" component={VirtualTryOn} />

      {/* Measure Feet Page */}
      <ProtectedRoute
        path="/measure-feet"
        component={MeasureFeet}
        isLoggedIn={isLoggedIn}
      />

      {/* Virtual Try On Page */}
      <ProtectedRoute
        path="/virtual-try-on/:id"
        component={VirtualTryOnPage}
        isLoggedIn={isLoggedIn}
      />

      {/* Existing */}
      <ProtectedRoute path="/shop" component={Shop} isLoggedIn={isLoggedIn} />
      <ProtectedRoute
        path="/product/:id"
        component={ProductDetails}
        isLoggedIn={isLoggedIn}
      />
      <Route path="/cart" component={Cart} />
      <ProtectedRoute
        path="/profile"
        component={Profile}
        isLoggedIn={isLoggedIn}
      />

      <Route path="/payment" component={Payment} />
      <Route
        path="/login"
        component={() => <Login setIsLoggedIn={setIsLoggedIn} />}
      />

      {/* Admin */}
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin" component={Admin} />
      <Route path="/stock-analysis" component={StockAnalysis} />

      <Route component={NotFound} />
    </Switch>
  );
}
function App() {
  // ✅ Track login state dynamically
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem("accessToken"),
  );
  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
    };

    // run once
    checkAuth();

    // listen for login/logout changes
    window.addEventListener("auth-changed", checkAuth);

    return () => {
      window.removeEventListener("auth-changed", checkAuth);
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
