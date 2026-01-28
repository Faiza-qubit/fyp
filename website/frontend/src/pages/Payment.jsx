import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, CreditCard, Lock, ShoppingBag, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";
const STRIPE_PUBLISHABLE_KEY = "pk_test_51Sc8iyHLnZ9m3Jv2RutezcRpbj7DMNFWIdH3zbVg7kSFPWeU86z7ZH8q1lCCYSWd4EDq4kKAps4jcdH51TPtY3rV00bgBglRz4"; // Replace with your actual key

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Separate component for the payment form using Stripe
function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Scroll to top when a success message appears so the banner is visible
  useEffect(() => {
    if (successMessage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [successMessage]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    amount: 120.00,
    shoeSize: "10",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Error",
        description: "Stripe is not loaded",
        variant: "destructive",
      });
      return;
    }

    // Basic validation
    if (!formData.fullName || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create payment intent
      const intentResponse = await axios.post(
        `${API_BASE_URL}/payments/create-intent`,
        {
          amount: formData.amount,
          email: formData.email,
          fullName: formData.fullName,
          shoeSize: formData.shoeSize,
        }
      );

      if (!intentResponse.data.success) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret, paymentIntentId } = intentResponse.data;

      // Step 2: Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.fullName,
            email: formData.email,
          },
        },
      });

      if (result.error) {
        toast({
          title: "Payment Failed",
          description: result.error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Check payment status
      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        // Step 3: Confirm payment in backend
        try {
          await axios.post(`${API_BASE_URL}/payments/confirm`, {
            paymentIntentId: paymentIntentId,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode,
            country: formData.country,
            shoeSize: formData.shoeSize,
            amount: formData.amount,
          });
          setSuccessMessage({
            title: "Payment Confirmed",
            description: "Thank you for your purchase. Your order is now being prepared.",
          });
        } catch (backendError) {
          console.error("Backend confirmation error:", backendError);
          toast({
            title: "Payment Recorded",
            description: "Your payment was successful but there was an issue saving the order. Please contact support.",
          });
        }
      } else if (result.paymentIntent && result.paymentIntent.status === "requires_action") {
        toast({
          title: "Additional Authentication Required",
          description: "Please complete the additional authentication step in the popup.",
          variant: "destructive",
        });
      } else {
        throw new Error("Payment processing failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#FFFFFF",
        "::placeholder": {
          color: "#a0a0a0",
        },
      },
      invalid: {
        color: "#ef4444",
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-6">
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-6xl">
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-emerald-400/50 bg-emerald-900/20 p-5 shadow-lg"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-emerald-300">Success</p>
                <h3 className="text-2xl font-semibold text-white">{successMessage.title}</h3>
                <p className="text-gray-200 mt-1">{successMessage.description}</p>
              </div>
              <div className="flex gap-3 pt-3 md:pt-0">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/shop")}
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  Continue Shopping
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-emerald-500 text-black hover:bg-emerald-400"
                >
                  Go to Home
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        {/* Back Button */}
        <Link
          href="/shop"
          className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-yellow-500 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Shop
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-5xl font-bold mb-4">Checkout</h1>
          <p className="text-gray-400 text-lg">
            Complete your purchase securely with Stripe
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: PAYMENT FORM */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* BILLING INFORMATION */}
              <div className="bg-neutral-900 rounded-2xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-yellow-500" />
                  Billing Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="fullName" className="text-gray-300 mb-2 block">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                      disabled={loading}
                      className="bg-neutral-800 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-500 h-12 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-300 mb-2 block">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                      disabled={loading}
                      className="bg-neutral-800 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-500 h-12 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-300 mb-2 block">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="bg-neutral-800 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-500 h-12"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-gray-300 mb-2 block">
                      Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street, Apt 4B"
                      className="bg-neutral-800 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-500 h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-gray-300 mb-2 block">
                      City
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className="bg-neutral-800 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-500 h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="zipCode" className="text-gray-300 mb-2 block">
                      ZIP Code
                    </Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      className="bg-neutral-800 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-500 h-12"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="country" className="text-gray-300 mb-2 block">
                      Country
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="United States"
                      className="bg-neutral-800 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-500 h-12"
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT INFORMATION */}
              <div className="bg-neutral-900 rounded-2xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-yellow-500" />
                  Payment Details
                </h2>

                <div className="mb-6">
                  <Label className="text-gray-300 mb-2 block">
                    Card Information *
                  </Label>
                  <div className="bg-neutral-800 border border-white/10 rounded-lg p-4 focus-within:border-yellow-500 transition-colors">
                    <CardElement options={cardElementOptions} />
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span>Your payment information is encrypted and secure with Stripe</span>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                size="lg"
                disabled={!stripe || loading}
                className="w-full h-14 text-lg font-bold bg-yellow-500 text-black hover:bg-yellow-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Complete Payment"
                )}
              </Button>
            </form>
          </motion.div>

          {/* RIGHT: ORDER SUMMARY */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/10 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              {/* Item */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-neutral-800 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">Selected Shoe</h3>
                    <p className="text-gray-400 text-sm">Size: US {formData.shoeSize}</p>
                    <p className="text-yellow-500 font-bold mt-1">${formData.amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${formData.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span>${(formData.amount * 0.1).toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-2xl font-bold text-yellow-500">
                    ${(formData.amount * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span>Secure Checkout (Stripe)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <ShoppingBag className="w-4 h-4 text-yellow-500" />
                  <span>30-Day Return Policy</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Main Payment component with Stripe provider
export default function Payment() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}
