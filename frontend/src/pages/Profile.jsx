import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "wouter";

const API_BASE_URL = "http://localhost:5000/api";

export default function Profile() {
  const token = localStorage.getItem("token");
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
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    setLocation("/");
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
          }
        );

        setOrders(ordersResponse.data || []);
      } catch {
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
      <div className="min-h-screen bg-black text-white pt-24 px-6">
        Loading profile...
      </div>
    );
  }
return (
  <div className="h-screen bg-black text-white pt-28 px-6 pb-10 overflow-hidden">

    <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 h-full">

      {/* ⭐ PROFILE CARD (FIXED) */}
      <div className="bg-[#0c0c0c] border border-yellow-500/20 
                      rounded-3xl p-8 
                      shadow-[0_0_40px_rgba(255,204,0,0.08)]
                      h-fit">

        <h1 className="text-3xl font-bold mb-2">
          Profile
        </h1>

        <p className="text-gray-400 mb-6">
          Your saved AI foot measurements
        </p>

        <div className="space-y-2 text-sm mb-8">
          <p>
            <span className="text-gray-500">Name:</span> {user?.name}
          </p>
          <p>
            <span className="text-gray-500">Email:</span> {user?.email}
          </p>
        </div>

        {/* ⭐ MEASUREMENT PANEL */}
        <div className="bg-[#111] border border-yellow-500/30 
                        rounded-2xl p-6 text-center">

          <h3 className="text-2xl font-bold text-yellow-400 mb-5">
            Foot Measurements
          </h3>

          <div className="space-y-3 text-lg">

            <p>
              Foot Length:
              <span className="ml-2 font-bold text-white">
                {footProfile.footLengthCm} cm
              </span>
            </p>

            <p>
              Foot Width:
              <span className="ml-2 font-bold text-white">
                {footProfile.footWidthCm} cm
              </span>
            </p>

            <p className="text-xl font-bold text-yellow-400 mt-4">
              US {footProfile.usSize} (EU {footProfile.euSize})
            </p>

          </div>
        </div>

        {/* ⭐ LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full mt-8 py-3 rounded-xl 
                     bg-yellow-500 text-black font-bold
                     hover:bg-yellow-400 transition 
                     shadow-lg shadow-yellow-500/30"
        >
          Logout
        </button>

      </div>

      {/* ⭐ ORDER HISTORY (SCROLLABLE) */}
      <div className="lg:col-span-2 
                      bg-[#0c0c0c] border border-yellow-500/20 
                      rounded-3xl p-8 
                      shadow-[0_0_40px_rgba(255,204,0,0.05)]
                      h-full overflow-y-auto">

        <h2 className="text-2xl font-bold mb-6">
          Order History
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-400">No orders yet.</p>
        ) : (
          <div className="space-y-5 pb-10">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-white/10 rounded-xl p-5 
                           flex items-center justify-between 
                           hover:border-yellow-500/40 transition"
              >
                <div>
                  <p className="font-semibold">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-400">
                    Status: {order.status}
                  </p>
                  <p className="text-sm text-gray-400">
                    Size: {order.shoeSize || "-"}
                  </p>
                  <p className="text-sm text-gray-400">
                    Color: {order.shoeColor || "-"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-yellow-500 font-bold text-lg">
                    ${Number(order.amount || 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  </div>
);
}