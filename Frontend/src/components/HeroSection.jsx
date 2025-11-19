import { useAuth } from "../context/useAuth.jsx";
import { useState, useEffect } from "react";
import axios from "axios";

export default function HeroSection() {
  const { user, token } = useAuth();
  const [summary, setSummary] = useState({
    weekTotal: 0,
    monthTotal: 0
  });

  // helper: convert a Date object (or date-string) to YYYY-MM-DD in local timezone
  const toLocalDateStr = (d) => {
    const dt = new Date(d);
    const year = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (!token) return;

    const fetchSummary = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/analytics", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data || {};
        const dailyTrend = data.dailyTrend || [];
        const monthlyTotals = data.monthlyTotals || [];

        // compute date strings (local) for comparison to avoid timezone issues
        const today = new Date();
        const todayStr = toLocalDateStr(today);

        const last7Date = new Date(today);
        last7Date.setDate(today.getDate() - 7);
        const last7Str = toLocalDateStr(last7Date);

        // Map dailyTrend rows to local date strings (they may be UTC timestamps)
        const daily = dailyTrend.map((d) => {
          return {
            dateStr: toLocalDateStr(d.date),
            total: Number(d.total || 0)
          };
        });

        // Sum totals where dateStr is between last7Str and todayStr (inclusive)
        const weekTotal = daily
          .filter((row) => row.dateStr >= last7Str && row.dateStr <= todayStr)
          .reduce((sum, r) => sum + r.total, 0);

        // Month: monthlyTotals returns YYYY-MM format (we used TO_CHAR('YYYY-MM') on backend)
        const isoMonth = today.toISOString().slice(0, 7); // 'YYYY-MM'
        const altMonth = isoMonth.split("-").reverse().join("-"); // fallback if backend used DD-MM format

        const monthRow =
          monthlyTotals.find((m) => m.month === isoMonth) ||
          monthlyTotals.find((m) => m.month === altMonth);

        const monthTotal = monthRow ? Number(monthRow.total || 0) : 0;

        setSummary({ weekTotal, monthTotal });
      } catch (err) {
        console.error("HeroSection analytics error:", err);
      }
    };

    // initial fetch
    fetchSummary();

    // re-fetch when any expense is added (your ExpenseForm dispatches this event)
    const onUpdate = () => fetchSummary();
    window.addEventListener("expenseUpdated", onUpdate);

    return () => {
      window.removeEventListener("expenseUpdated", onUpdate);
    };
  }, [token]);

  return (
    <section className="opening-show text-center mt-4">
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">
        Good to see you, {user?.name || "User"} 😊
      </h2>

      <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors">
        Here's your expense overview.
      </p>

      <div className="mt-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border border-gray-200 dark:border-gray-700/30 
      rounded-2xl shadow backdrop-blur-xl p-6 flex flex-col md:flex-row justify-between text-center gap-6 transition-colors">
        
        <div className="flex-1">
          <p className="text-gray-700 dark:text-gray-100">Spent in Last 7 Days</p>
          <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
            ₹{summary.weekTotal.toFixed(2)}
          </h3>
        </div>

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
