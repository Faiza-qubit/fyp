import axios from "axios";
import Sale from "../models/Sale.js";
import Shoe from "../models/Shoe.js";

export const stockPrediction = async (req, res) => {
  try {
    const shoes = await Shoe.find();

    let result = [];

    for (let shoe of shoes) {

      // ⭐ get all sales of this shoe
      const sales = await Sale.find({ shoeId: shoe._id });

      // ⭐ filter last 30 days sales
      const last30DaysSales = sales.filter(
        (s) =>
          Date.now() - new Date(s.date) <
          30 * 24 * 60 * 60 * 1000
      );

      // ⭐ total monthly sales
      const totalMonthlySales = last30DaysSales.reduce(
        (sum, s) => sum + s.quantity,
        0
      );

      // ⭐ AI input array
      let monthlySales = [totalMonthlySales || 0];

      // ⭐ average daily sales
      let avgDailySales = totalMonthlySales / 30 || 0;

      // ⭐ days until stockout
      let daysUntilStockout =
        avgDailySales > 0
          ? Math.floor(shoe.stock / avgDailySales)
          : "No sales data";

      // ⭐ smart restock suggestion (15 days buffer)
      let suggestedRestock = Math.ceil(avgDailySales * 15);

      // ⭐ low stock alert
      let lowStockAlert = shoe.stock <= 5;

      // ⭐ call FastAPI AI model
      let predictedDemand = 0;
      let aiRestockFlag = false;

      try {
        const response = await axios.post(
          "http://localhost:8000/predict",
          {
            monthly_sales: monthlySales,
            current_stock: shoe.stock,
          }
        );

        predictedDemand = response.data.predicted_demand;
        aiRestockFlag = response.data.restock_needed;

      } catch (aiError) {
        console.log("AI server error:", aiError.message);
      }

      result.push({
        shoeId: shoe._id,
        name: shoe.name,
        brand: shoe.brand,
        currentStock: shoe.stock,
        avgDailySales,
        daysUntilStockout,
        suggestedRestock,
        predictedDemand,
        aiRestockFlag,
        lowStockAlert,
      });
    }

    res.json(result);

  } catch (err) {
    console.log("Prediction Error:", err);
    res.status(500).json({ message: "Prediction Error" });
  }
};