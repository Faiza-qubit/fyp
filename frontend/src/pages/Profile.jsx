import { useEffect, useState, useRef } from "react";
import { SHOES } from "@/lib/mockData";
import axios from "axios";
import { useLocation } from "wouter";
import { apiUrl } from "@/lib/api";

export default function Profile() {
  const token =
    sessionStorage.getItem("accessToken") || localStorage.getItem("token");
  const [, setLocation] = useLocation();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [footProfile, setFootProfile] = useState({
    footLengthCm: 0,
    footWidthCm: 0,
    euSize: 0,
    usSize: 0,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setLocation("/login");
  };

  useEffect(() => {
    if (!token) {
      setLocation("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const meResponse = await axios.get(apiUrl("/me"), {
          headers: { Authorization: `Bearer ${token}` },
        });

        const currentUser = meResponse.data.user;
        setUser(currentUser);

        setFootProfile({
          footLengthCm: currentUser?.footProfile?.footLengthCm || 0,
          footWidthCm: currentUser?.footProfile?.footWidthCm || 0,
          euSize: currentUser?.footProfile?.euSize || 0,
          usSize: currentUser?.footProfile?.usSize || 0,
        });

        const ordersResponse = await axios.get(apiUrl("/payments/my-orders"), {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(ordersResponse.data || []);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setLocation("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [setLocation, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-zinc-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  const userName = user?.name || "User";
  const getShoeName = (shoeId) => {
    const shoe = SHOES.find((s) => String(s.id) === String(shoeId));
    return shoe ? shoe.name : `Shoe #${shoeId}`;
  };
  return (
    <>
      {/* Embedded scrollbar styles */}
      <style>{`
           .custom-scrollbar::-webkit-scrollbar {
  width: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #facc15, #f59e0b);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #fde047, #fbbf24);
}

.smooth-scroll {
  scroll-behavior: smooth;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #f59e0b rgba(0, 0, 0, 0.7);
}
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white pb-12">
        {/* Subtle background glow */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(245,158,11,0.04),transparent_50%)] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-12 md:pt-16">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 tracking-tight bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent">
            {userName}'s Profile
          </h1>

          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-4">
              <div className="bg-black/70 backdrop-blur-xl border border-yellow-600/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50 transition-all duration-300 hover:shadow-yellow-900/20">
                <div className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-5 rounded-full bg-gradient-to-br from-yellow-600 to-amber-700 flex items-center justify-center text-black font-bold text-4xl md:text-5xl">
                  {userName[0]?.toUpperCase() || "?"}
                </div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold">{userName}</h2>
                  <p className="text-gray-400 text-sm md:text-base mt-1">
                    {user?.email}
                  </p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-yellow-600/40 to-transparent my-6" />

                <h3 className="text-xl md:text-2xl font-semibold text-yellow-400 mb-5 text-center tracking-wide">
                  Foot Profile
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-zinc-900/60 rounded-2xl p-4 border border-yellow-500/20 text-center">
                    <p className="text-gray-400 text-xs md:text-sm mb-1">
                      Length
                    </p>
                    <p className="text-xl md:text-2xl font-bold">
                      {footProfile.footLengthCm}{" "}
                      <span className="text-base font-normal">cm</span>
                    </p>
                  </div>
                  <div className="bg-zinc-900/60 rounded-2xl p-4 border border-yellow-500/20 text-center">
                    <p className="text-gray-400 text-xs md:text-sm mb-1">
                      Width
                    </p>
                    <p className="text-xl md:text-2xl font-bold">
                      {footProfile.footWidthCm}{" "}
                      <span className="text-base font-normal">cm</span>
                    </p>
                  </div>
                </div>

                <div className="text-center py-5 px-6 bg-gradient-to-br from-yellow-950/30 to-black/50 rounded-2xl border border-yellow-600/25">
                  <p className="text-gray-400 text-xs md:text-sm mb-1">Size</p>
                  <p className="text-4xl md:text-5xl font-black text-yellow-400 tracking-wider">
                    US {footProfile.usSize}
                  </p>
                  <p className="text-lg md:text-xl text-gray-300 mt-1">
                    EU {footProfile.euSize}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-8 w-full py-3.5 md:py-4 rounded-2xl font-bold text-base md:text-lg bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black shadow-lg shadow-yellow-600/30 transition-all duration-300 active:scale-[0.98]"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* RIGHT ORDERS */}
            <div className="lg:col-span-8">
              <div className="bg-black/70 border border-yellow-600/25 rounded-3xl p-6 shadow-xl h-[97vh] flex flex-col">
                <h2 className="text-2xl font-bold mb-6">
                  Order History ({orders.length})
                </h2>

                {orders.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-16 md:py-24">
                    <div className="text-6xl md:text-7xl mb-6 opacity-40">
                      🛍️
                    </div>
                    <p className="text-xl md:text-2xl font-medium">
                      No orders yet
                    </p>
                    <p className="mt-3 text-base md:text-lg">
                      Your purchases will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5 overflow-y-auto flex-1 pr-3 custom-scrollbar smooth-scroll">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 
             transition-all duration-300 
             hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/10"
                      >
                        {/* HEADER */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-semibold text-lg">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </p>

                            <p className="text-sm text-gray-400 mt-1">
                              Status:{" "}
                              <span className="text-yellow-400">
                                {order.status}
                              </span>
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-gray-400">
                              Total Price including Tax
                            </p>
                            <p className="text-lg font-bold text-yellow-400">
                              ${Number(order.amount || 0).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>

                        {/* ITEMS */}
                        <div className="grid grid-cols-2 gap-3">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="bg-black/40 px-3 py-3 rounded-lg border border-zinc-800"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-white font-medium">
                                    {getShoeName(item.shoeId)}
                                  </p>

                                  <p className="text-xs text-gray-400 mt-1">
                                    Size {item.size} • Qty {item.quantity}
                                  </p>
                                </div>

                                <p className="text-yellow-400 font-semibold text-sm">
                                  $
                                  {(
                                    Number(item.price || 0) *
                                    Number(item.quantity || 1)
                                  ).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
