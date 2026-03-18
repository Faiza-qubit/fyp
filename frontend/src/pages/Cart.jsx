import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { getCartItems, removeCartItem } from "@/lib/cart";

export default function Cart() {
  const [, setLocation] = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");
  const [items, setItems] = useState([]);

  const loadItems = () => {
    setItems(getCartItems());
  };

  useEffect(() => {
    loadItems();
    const onCartUpdate = () => loadItems();
    window.addEventListener("cart-updated", onCartUpdate);
    return () => window.removeEventListener("cart-updated", onCartUpdate);
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price || 0), 0),
    [items]
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white pt-20 px-6 flex items-center justify-center">
        <Card className="w-full max-w-xl p-8 bg-neutral-900 border border-white/10 text-center">
          <h1 className="text-3xl font-bold mb-3">Login Required</h1>
          <p className="text-gray-300 mb-6">
            Please login or sign up to view your cart items.
          </p>
          <Button
            onClick={() => setLocation("/login")}
            className="bg-yellow-500 text-black hover:bg-yellow-400"
          >
            Go to Login / Signup
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <Card className="p-10 bg-neutral-900 border border-white/10 text-center">
            <ShoppingBag className="w-10 h-10 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-300 mb-5">Your cart is empty.</p>
            <Link href="/shop">
              <Button className="bg-yellow-500 text-black hover:bg-yellow-400">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">

            {items.map((item) => (
              <Card
                key={item.cartItemId}
                className="p-4 bg-neutral-900 border border-white/10 flex items-center gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />

                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-400">Size: US {item.size}</p>
                  <p className="text-sm text-gray-400">Color: {item.colorName}</p>

                  {/* DEBUG */}
                  <p className="text-xs text-gray-500">ID: {item.shoeId}</p>
                </div>

                <p className="font-bold text-yellow-500">${item.price}</p>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCartItem(item.cartItemId)}
                  className="text-gray-300 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>
            ))}

            {/* ⭐ ORDER SUMMARY + CHECKOUT BUTTON */}
            <Card className="p-6 bg-neutral-900 border border-white/10 mt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg">Total</p>
                <p className="text-2xl font-bold text-yellow-500">
                  ${total.toFixed(2)}
                </p>
              </div>

              <Button
                className="w-full bg-yellow-500 text-black hover:bg-yellow-400"
                onClick={() => setLocation("/payment")}
              >
                Proceed to Payment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>

          </div>
        )}
      </div>
    </div>
  );
}