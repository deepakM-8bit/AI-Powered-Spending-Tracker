import { useAuth } from "../context/useAuth.jsx";
import { useState, useEffect } from "react";
import axios from "axios";

export default function HeroSection() {
  const { user, token } = useAuth();
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

        const today = new Date();
        const last7 = new Date();
        last7.setDate(today.getDate() - 7);

        const weekTotal = dailyTrend
          .filter((d) => {
            const dt = new Date(d.date);
            return dt >= last7 && dt <= today;
          })
          .reduce((sum, d) => sum + Number(d.total || 0), 0);

        const isoMonth = today.toISOString().slice(0, 7);
        const altMonth = isoMonth.split("-").reverse().join("-");

        const monthRow =
          monthlyTotals.find((m) => m.month === isoMonth) ||
          monthlyTotals.find((m) => m.month === altMonth);

        const monthTotal = monthRow ? Number(monthRow.total || 0) : 0;

        setSummary({ weekTotal, monthTotal });
      })
      .catch((err) => {
        console.error("HeroSection analytics error:", err);
      });
  }, [token]);

  return (
    <section className="text-center mt-4">
      
      {/* Greeting Heading */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
        Good to see you, {user?.name || "User"} 😊
      </h2>

      <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors">
        Here's your expense overview.
      </p>

      {/* Summary Card */}
      <div className="mt-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border border-gray-200 dark:border-gray-700/30 rounded-2xl shadow backdrop-blur-xl p-6 flex flex-col md:flex-row justify-between text-center gap-6 transition-colors">
        
        {/* Weekly */}
        <div className="flex-1">
          <p className="text-gray-700 dark:text-gray-100">Spent in Last 7 Days</p>
          <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
            ₹{summary.weekTotal.toFixed(2)}
          </h3>
        </div>

        {/* Monthly */}
        <div className="flex-1">
          <p className="text-gray-700 dark:text-gray-100">Total This Month</p>
          <h3 className="text-2xl font-semibold text-green-600 dark:text-green-400">
            ₹{summary.monthTotal.toFixed(2)}
          </h3>
        </div>

      </div>
    </section>
  );
}
