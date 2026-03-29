import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from "wouter";

const API_BASE_URL = "http://localhost:5000/api";

export default function Profile() {
  const token = localStorage.getItem("token");
  const [, setLocation] = useLocation();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const [footProfile, setFootProfile] = useState({
    footLengthCm: 0,
    footWidthCm: 0,
    euSize: 0,
    usSize: 0,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    setLocation("/");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        // TODO: upload to backend here if needed
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setPreviewImage(null);
    // TODO: call backend to remove picture if needed
  };

  useEffect(() => {
    if (!token) {
      setLocation("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const meResponse = await axios.get(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const currentUser = meResponse.data.user;
        setUser(currentUser);

        if (currentUser?.profilePicture) {
          setPreviewImage(currentUser.profilePicture);
        }

        setFootProfile({
          footLengthCm: currentUser?.footProfile?.footLengthCm || 0,
          footWidthCm: currentUser?.footProfile?.footWidthCm || 0,
          euSize: currentUser?.footProfile?.euSize || 0,
          usSize: currentUser?.footProfile?.usSize || 0,
        });

        const ordersResponse = await axios.get(
          `${API_BASE_URL}/payments/my-orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

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
  const hasPicture = !!previewImage;

  return (
    <>
      {/* Embedded scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.9);
        }
        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(245, 158, 11, 0.6) rgba(0, 0, 0, 0.5);
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
                {/* Profile Picture + Controls */}
                <div className="relative mx-auto mb-5 group w-fit">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-yellow-500/50 shadow-xl shadow-yellow-900/40">
                    {hasPicture ? (
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-600 to-amber-700 flex items-center justify-center text-black font-bold text-4xl md:text-5xl">
                        {userName[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                  </div>

                  {/* Edit button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-black/80 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-yellow-600/90 border-2 border-yellow-400/40"
                    title="Change profile picture"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Remove button */}
                {hasPicture && (
                  <div className="text-center mb-4">
                    <button
                      onClick={handleRemovePicture}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors underline underline-offset-2"
                    >
                      Remove profile picture
                    </button>
                  </div>
                )}

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

            {/* Order History */}
            <div className="lg:col-span-8">
              <div className="bg-black/70 backdrop-blur-xl border border-yellow-600/25 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50 h-full flex flex-col transition-all duration-300 hover:shadow-yellow-900/15">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight flex items-center gap-3">
                  Order History
                  <span className="text-lg md:text-xl font-medium text-gray-500">
                    ({orders.length})
                  </span>
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
                  <div className="flex-1 overflow-y-auto pr-2 md:pr-4 custom-scrollbar space-y-4 md:space-y-5 max-h-[80vh]">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-zinc-900/50 border border-zinc-800/80 hover:border-yellow-600/50 rounded-xl md:rounded-2xl p-5 md:p-6 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md hover:shadow-yellow-900/10"
                      >
                        <div className="space-y-1.5">
                          <p className="font-semibold text-base md:text-lg">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs md:text-sm text-gray-400">
                            <p>
                              Status:{" "}
                              <span className="text-yellow-400 font-medium">
                                {order.status}
                              </span>
                            </p>
                            {order.shoeSize && <p>Size: {order.shoeSize}</p>}
                            {order.shoeColor && <p>Color: {order.shoeColor}</p>}
                          </div>
                        </div>

                        <div className="text-right sm:min-w-[140px] md:min-w-[160px]">
                          <p className="text-xl md:text-2xl font-bold text-yellow-400">
                            ${Number(order.amount || 0).toFixed(2)}
                          </p>
                          <p className="text-xs md:text-sm text-gray-500 mt-1">
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
