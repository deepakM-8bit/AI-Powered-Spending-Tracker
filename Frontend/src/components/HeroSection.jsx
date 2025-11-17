import { useAuth } from "../context/useAuth.jsx";
import { useState, useEffect } from "react";
import axios from "axios";

export default function HeroSection() {
  const { user, token } = useAuth();
  console.log("AUTH CONTEXT =>", user, token);

  const [summary, setSummary] = useState({
    weekTotal: 0,
    monthTotal: 0
  });

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:3000/api/analytics", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const data = res.data || {};

        const dailyTrend = data.dailyTrend || [];
        const monthlyTotals = data.monthlyTotals || [];

        // ----- Calculate Weekly Total (last 7 days) -----
        const today = new Date();
        const last7 = new Date();
        last7.setDate(today.getDate() - 7);

        const weekTotal = dailyTrend
          .filter((d) => {
            const dt = new Date(d.date);
            return dt >= last7 && dt <= today;
          })
          .reduce((sum, d) => sum + Number(d.total || 0), 0);

        // ----- Calculate Monthly Total -----
        const isoMonth = today.toISOString().slice(0, 7); // "2025-11"
        const altMonth = isoMonth.split("-").reverse().join("-"); // "11-2025"

        const monthRow =
           monthlyTotals.find(m => m.month === isoMonth) ||
           monthlyTotals.find(m => m.month === altMonth);


        const monthTotal = monthRow ? Number(monthRow.total || 0) : 0;

        setSummary({
          weekTotal,
          monthTotal
        });
      })
      .catch((err) => {
        console.error("HeroSection analytics error:", err);
      });
  }, [token]);

  return (
    <section className="text-center">
      <h2 className="text-3xl font-bold">
        Hey {user?.name || "User"} 👋
      </h2>
      <p className="text-gray-600 mt-2">
        Here's your expense overview.
      </p>

      <div className="mt-6 bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row justify-between text-center gap-6">

        <div className="flex-1">
          <p className="text-gray-500">Spent in Last 7 Days</p>
          <h3 className="text-2xl font-semibold text-blue-600">
            ₹{summary.weekTotal.toFixed(2)}
          </h3>
        </div>

        <div className="flex-1">
          <p className="text-gray-500">Total This Month</p>
          <h3 className="text-2xl font-semibold text-green-600">
            ₹{summary.monthTotal.toFixed(2)}
          </h3>
        </div>

      </div>
    </section>
    
  );
}
