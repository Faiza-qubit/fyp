// src/pages/StockAnalysis.jsx
import { useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { SHOES } from "@/lib/mockData";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function StockAnalysis() {
  const [, setLocation] = useLocation();

  const analysis = useMemo(() => {
    const categoryStock = {};
    const brandStock = {};
    const lowStockItems = [];

    SHOES.forEach((s) => {
      categoryStock[s.category] = (categoryStock[s.category] || 0) + (s.stock || 50);
      brandStock[s.brand] = (brandStock[s.brand] || 0) + (s.stock || 50);
      if ((s.stock || 50) < 10) lowStockItems.push(s);
    });

    const totalValue = SHOES.reduce((acc, s) => acc + s.price * (s.stock || 50), 0);

    return { categoryStock, brandStock, lowStockItems, totalValue };
  }, []);

  // Chart Data
  const barData = {
    labels: Object.keys(analysis.categoryStock),
    datasets: [
      {
        label: "Stock per Category",
        data: Object.values(analysis.categoryStock),
        backgroundColor: "rgba(253, 224, 71, 0.7)", // golden yellow
        borderColor: "rgba(253, 224, 71, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: Object.keys(analysis.brandStock),
    datasets: [
      {
        label: "Stock by Brand",
        data: Object.values(analysis.brandStock),
        backgroundColor: [
          "#FFD700",
          "#FFA500",
          "#FF4500",
          "#00BFFF",
          "#32CD32",
          "#8A2BE2",
          "#FF69B4",
        ],
      },
    ],
  };

  // Line chart for inventory value trends (mock example)
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Inventory Value ($)",
        data: [12000, 15000, 14000, 17000, 18000, analysis.totalValue],
        borderColor: "#FFD700",
        backgroundColor: "rgba(253, 224, 71, 0.3)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-neutral-900 text-white p-8">
      <Button variant="outline" className="mb-6" onClick={() => setLocation("/admin")}>
        Back to Admin
      </Button>

      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
        Inventory Stock Analysis
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-neutral-900/50 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Stock by Category</h2>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div className="bg-neutral-900/50 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Stock by Brand</h2>
          <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
        </div>

        <div className="bg-neutral-900/50 p-6 rounded-2xl shadow-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Inventory Value Trends</h2>
          <Line data={lineData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>
      </div>

      {/* Low Stock Items Table */}
      <div className="bg-neutral-900/50 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Low Stock Items (less than 10)</h2>
        {analysis.lowStockItems.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-white/10 p-2">Name</th>
                <th className="border-b border-white/10 p-2">Brand</th>
                <th className="border-b border-white/10 p-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {analysis.lowStockItems.map((s) => (
                <tr key={s.id} className="hover:bg-white/5">
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.brand}</td>
                  <td className="p-2 text-red-400">{s.stock || 50}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No low stock items!</p>
        )}
      </div>
    </div>
  );
}
