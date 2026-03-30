import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";

import {
  getCartItems,
  removeCartItem,
  increaseQuantity,
  decreaseQuantity,
} from "@/lib/cart";

export default function Cart() {
  const [, setLocation] = useLocation();
  const [items, setItems] = useState([]);

  // ✅ FIX: define login state properly
  const isLoggedIn = !!sessionStorage.getItem("accessToken");

  const loadItems = () => {
    setItems(getCartItems());
  };

  useEffect(() => {
    loadItems();

    const onCartUpdate = () => loadItems();
    window.addEventListener("cart-updated", onCartUpdate);

    return () =>
      window.removeEventListener("cart-updated", onCartUpdate);
  }, []);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * (item.quantity || 1),
        0
      ),
    [items]
  );

  // ✅ LOGIN CHECK UI
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white pt-20 px-6 flex items-center justify-center">
        <Card className="w-full max-w-xl p-8 bg-neutral-900 border border-white/10 text-center">
          <h1 className="text-3xl font-bold mb-3">Login Required</h1>
          <p className="text-gray-300 mb-6">
            Please login or sign up to view your cart items.
          </p>
          <Button
           onClick={() => setLocation("/login?redirect=cart")}
            className="bg-yellow-500 text-black hover:bg-yellow-400"
          >
            Go to Login / Signup
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 px-6 pb-32">
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
          <div className="space-y-5">
            {items.map((item) => (
              <Card
                key={item.cartItemId}
                className="p-5 bg-neutral-900 border border-white/10 flex items-center justify-between rounded-xl hover:border-yellow-500/30 transition-all"
              >
                {/* LEFT SIDE */}
                <div className="flex items-center gap-5 flex-1">
                  {/* IMAGE */}
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg bg-black"
                    />
                  )}

                  {/* INFO */}
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-semibold">{item.name}</p>

                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {item.brand}
                    </p>

                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>Size: US {item.size}</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-8">
                  {/* QUANTITY */}
                  <div className="flex items-center bg-black/40 border border-white/10 rounded-lg px-2 py-1 gap-2">
                    <button
                      onClick={() => decreaseQuantity(item.cartItemId)}
                      className="px-2 text-gray-300 hover:text-yellow-500"
                    >
                      −
                    </button>

                    <span className="w-6 text-center">
                      {item.quantity || 1}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item.cartItemId)}
                      className="px-2 text-gray-300 hover:text-yellow-500"
                    >
                      +
                    </button>
                  </div>

                  {/* PRICE */}
                  <p className="text-lg font-bold text-yellow-500 min-w-[80px] text-right">
                    $
                    {(
                      Number(item.price || 0) *
                      (item.quantity || 1)
                    ).toFixed(2)}
                  </p>

                  {/* DELETE */}
                  <button
                    onClick={() =>
                      removeCartItem(item.cartItemId)
                    }
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}

            {/* ORDER SUMMARY */}
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