import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../src/components/ui/toaster";
import { TooltipProvider } from "../src/components/ui/tooltip";

// Pages
import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import AdminLogin from "../src/pages/AdminLogin";   // ✅ Added
import NotFound from "../src/pages/not-found";
import Shop from "../src/pages/Shop";
import ProductDetails from "../src/pages/ProductDetails";
import Payment from "../src/pages/Payment";
import Admin from "../src/pages/Admin";
import StockAnalysis from "../src/pages/StockAnalysis";  // ✅ New page


// Layout
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/product/:id" component={ProductDetails} />
      <Route path="/payment" component={Payment} />
      <Route path="/login" component={Login} />

      {/* Admin Login BEFORE Admin */}
      <Route path="/admin-login" component={AdminLogin} />   {/* ✅ NEW */}
      <Route path="/admin" component={Admin} />              {/* Admin page */}
      <Route path="/stock-analysis" component={StockAnalysis} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />

        {/* Navigation always visible */}
        <Navigation />

        {/* Main content */}
        <main className="min-h-screen bg-background text-foreground pt-20">
          <Router />
        </main>

        {/* Footer always visible */}
        <Footer />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
