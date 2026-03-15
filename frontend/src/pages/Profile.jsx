import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const API_BASE_URL = "http://localhost:5000/api";

function parseMeasurementValue(value) {
  if (value === null || value === undefined || value === "") return "";
  const parsed = Number.parseFloat(String(value).replace(/[^\d.]/g, ""));
  return Number.isNaN(parsed) ? "" : parsed.toFixed(1);
}

function getRecommendedSizeByLength(lengthCm) {
  const length = Number.parseFloat(lengthCm);
  if (Number.isNaN(length) || length <= 0) return "";

  if (length < 22.5) return "EU 35";
  if (length < 23.0) return "EU 36";
  if (length < 23.7) return "EU 37";
  if (length < 24.3) return "EU 38";
  if (length < 25.0) return "EU 39";
  if (length < 25.7) return "EU 40";
  if (length < 26.3) return "EU 41";
  if (length < 27.0) return "EU 42";
  if (length < 27.7) return "EU 43";
  if (length < 28.3) return "EU 44";
  if (length < 29.0) return "EU 45";
  return "EU 46+";
}

function readMeasurementsFromStorage() {
  const possibleKeys = [
    "footMeasurements",
    "foot_measurements",
    "footDimensions",
    "foot_dimensions",
    "sizewise-foot-measurements",
  ];

  for (const key of possibleKeys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const data = JSON.parse(raw);

      const footLengthCm =
        parseMeasurementValue(data.footLengthCm) ||
        parseMeasurementValue(data.lengthCm) ||
        parseMeasurementValue(data.foot_length_cm) ||
        parseMeasurementValue(data.length);

      const footWidthCm =
        parseMeasurementValue(data.footWidthCm) ||
        parseMeasurementValue(data.widthCm) ||
        parseMeasurementValue(data.foot_width_cm) ||
        parseMeasurementValue(data.width);

      if (footLengthCm || footWidthCm) {
        return {
          footLengthCm,
          footWidthCm,
          recommendedSize: getRecommendedSizeByLength(footLengthCm),
        };
      }
    } catch {
      // Ignore invalid JSON and continue checking other keys.
    }
  }

  return null;
}

export default function Profile() {
  const token = localStorage.getItem("token");
  const [, setLocation] = useLocation();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [footProfile, setFootProfile] = useState({
    footLengthCm: "",
    footWidthCm: "",
    recommendedSize: "",
  });

  const [loadedFromMeasurements, setLoadedFromMeasurements] = useState(false);

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
          footLengthCm: currentUser?.footProfile?.footLengthCm || "",
          footWidthCm: currentUser?.footProfile?.footWidthCm || "",
          recommendedSize: currentUser?.footProfile?.recommendedSize || "",
        });

        const ordersResponse = await axios.get(`${API_BASE_URL}/payments/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(ordersResponse.data || []);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth-changed"));
        setLocation("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [setLocation, token]);

  const handleUseMeasuredDimensions = () => {
    const measured = readMeasurementsFromStorage();

    if (!measured) {
      setMessage("No saved foot measurements were found yet.");
      setLoadedFromMeasurements(false);
      return;
    }

    setFootProfile((prev) => ({
      ...prev,
      footLengthCm: measured.footLengthCm || prev.footLengthCm,
      footWidthCm: measured.footWidthCm || prev.footWidthCm,
      recommendedSize: measured.recommendedSize || prev.recommendedSize,
    }));

    setLoadedFromMeasurements(true);
    setMessage("Foot measurements loaded. Click Save Foot Profile to store them.");
  };

  const handleSaveFootProfile = async () => {
    setSaving(true);
    setMessage("");

    try {
      const computedSize = getRecommendedSizeByLength(footProfile.footLengthCm);

      const response = await axios.put(
        `${API_BASE_URL}/profile/foot-size`,
        {
          footLengthCm: parseMeasurementValue(footProfile.footLengthCm),
          footWidthCm: parseMeasurementValue(footProfile.footWidthCm),
          recommendedSize: footProfile.recommendedSize || computedSize,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const updatedProfile = response?.data?.user?.footProfile;
      if (updatedProfile) {
        setFootProfile({
          footLengthCm: updatedProfile.footLengthCm || "",
          footWidthCm: updatedProfile.footWidthCm || "",
          recommendedSize: updatedProfile.recommendedSize || computedSize,
        });
      }

      setMessage(response.data.message || "Foot profile updated");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save foot profile");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-neutral-950 text-white pt-24 px-6">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 px-6 pb-12">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        <Card className="bg-neutral-900 border border-white/10 p-6 lg:col-span-1">
          <h1 className="text-3xl font-bold mb-3">Profile</h1>
          <p className="text-gray-400">User details and saved measurements</p>

          <div className="mt-6 space-y-2 text-sm">
            <p><span className="text-gray-400">Name:</span> {user?.name}</p>
            <p><span className="text-gray-400">Email:</span> {user?.email}</p>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <Label>Foot Length (cm)</Label>
              <Input
                value={footProfile.footLengthCm}
                onChange={(e) =>
                  setFootProfile((prev) => ({ ...prev, footLengthCm: e.target.value }))
                }
                className="bg-neutral-800 border-white/10 mt-2"
              />
            </div>
            <div>
              <Label>Foot Width (cm)</Label>
              <Input
                value={footProfile.footWidthCm}
                onChange={(e) =>
                  setFootProfile((prev) => ({ ...prev, footWidthCm: e.target.value }))
                }
                className="bg-neutral-800 border-white/10 mt-2"
              />
            </div>
            <div>
              <Label>Recommended Size</Label>
              <Input
                value={footProfile.recommendedSize}
                onChange={(e) =>
                  setFootProfile((prev) => ({ ...prev, recommendedSize: e.target.value }))
                }
                className="bg-neutral-800 border-white/10 mt-2"
              />
            </div>

            <Button
              type="button"
              onClick={handleUseMeasuredDimensions}
              variant="outline"
              className="w-full border-white/20 hover:bg-white/5"
            >
              Use Saved Foot Measurements
            </Button>

            <Button
              onClick={handleSaveFootProfile}
              disabled={saving}
              className="w-full bg-yellow-500 text-black hover:bg-yellow-400"
            >
              {saving ? "Saving..." : "Save Foot Profile"}
            </Button>
            {message && (
              <p className={`text-sm ${loadedFromMeasurements ? "text-yellow-300" : "text-gray-300"}`}>
                {message}
              </p>
            )}
          </div>
        </Card>

        <Card className="bg-neutral-900 border border-white/10 p-6 lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Order History</h2>
          {orders.length === 0 ? (
            <p className="text-gray-400">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-white/10 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-sm text-gray-400">Status: {order.status}</p>
                    <p className="text-sm text-gray-400">Size: {order.shoeSize || "-"}</p>
                    <p className="text-sm text-gray-400">Color: {order.shoeColor || "-"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-500 font-bold">${Number(order.amount || 0).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
