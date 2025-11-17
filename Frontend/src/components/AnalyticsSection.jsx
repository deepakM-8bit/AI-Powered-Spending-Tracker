import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth.jsx";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "#4f46e5", "#06b6d4", "#06a34a", "#f97316",
  "#ef4444", "#8b5cf6", "#f59e0b", "#10b981",
  "#ef6ab4", "#6366f1", "#14b8a6", "#fb7185"
];

function toNumber(x) {
  if (x === null || x === undefined) return 0;
  const n = Number(x);
  return Number.isFinite(n) ? n : parseFloat(String(x).replace(/,/g, "")) || 0;
}

function normalizeMonth(v) {
  if (!v) return "";
  if (/^\d{4}-\d{2}$/.test(v)) return v;
  if (/^\d{2}-\d{4}$/.test(v)) {
    const [mm, yy] = v.split("-");
    return `${yy}-${mm}`;
  }
  const d = new Date(v);
  if (!isNaN(d)) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }
  return v;
}

export default function AnalyticsSection() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [data, setData] = useState({
    categoryTotals: [],
    monthlyTotals: [],
    dailyTrend: [],

    monthlyCategoryTotals: [],
    yearlyTotals: [],
    yearlyCategoryTotals: [],

    total: 0,
  });

  const [filterType, setFilterType] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Fetch Analytics
  const fetchAnalytics = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Not authenticated");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.get("http://localhost:3000/api/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const payload = res.data || {};

      const categoryTotals = payload.categoryTotals || [];
      const monthlyTotals = payload.monthlyTotals || [];
      const dailyTrend = payload.dailyTrend || [];

      const monthlyCategoryTotals = payload.monthlyCategoryTotals || [];
      const yearlyTotals = payload.yearlyTotals || [];
      const yearlyCategoryTotals = payload.yearlyCategoryTotals || [];

      const cat = categoryTotals.map((c) => ({
        category: c.category,
        total: toNumber(c.total),
      }));

      const month = monthlyTotals
        .map((m) => ({
          month: normalizeMonth(m.month),
          total: toNumber(m.total),
        }))
        .sort((a, b) => (a.month > b.month ? 1 : -1));

      const trend = dailyTrend.map((d) => ({
        date: d.date, // YYYY-MM-DD
        total: toNumber(d.total),
      }));

      const monthCat = monthlyCategoryTotals.map((m) => ({
        month: normalizeMonth(m.month),
        category: m.category,
        total: toNumber(m.total),
      }));

      const yearTotals = yearlyTotals.map((y) => ({
        year: y.year,
        total: toNumber(y.total),
      }));

      const yearCatTotals = yearlyCategoryTotals.map((y) => ({
        year: y.year,
        category: y.category,
        total: toNumber(y.total),
      }));

      const allTimeTotal =
        month.reduce((s, x) => s + x.total, 0) ||
        cat.reduce((s, x) => s + x.total, 0);

      setData({
        categoryTotals: cat,
        monthlyTotals: month,
        dailyTrend: trend,

        monthlyCategoryTotals: monthCat,
        yearlyTotals: yearTotals,
        yearlyCategoryTotals: yearCatTotals,

        total: allTimeTotal,
      });

      // auto select defaults
      if (!selectedMonth && month.length) {
        setSelectedMonth(month[month.length - 1].month);
      }
      if (!selectedYear && yearTotals.length) {
        setSelectedYear(yearTotals[yearTotals.length - 1].year);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  }, [token, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    window.addEventListener("expenseUpdated", fetchAnalytics);
    return () => window.removeEventListener("expenseUpdated", fetchAnalytics);
  }, [fetchAnalytics]);

  const {
    categoryTotals,
    monthlyTotals,
    dailyTrend,

    monthlyCategoryTotals,
    yearlyTotals,
    yearlyCategoryTotals,

    total,
  } = data;

  const availableMonths = monthlyTotals.map((m) => m.month);
  const availableYears = yearlyTotals.map((y) => y.year);

  // Apply filter to all charts
  const filtered = useMemo(() => {
    if (filterType === "all") {
      return {
        pie: categoryTotals,
        bar: monthlyTotals,
        line: dailyTrend,
        total,
      };
    }

    if (filterType === "month") {
      if (!selectedMonth)
        return { pie: [], bar: [], line: [], total: 0 };

      const bar = monthlyTotals.filter((m) => m.month === selectedMonth);
      const line = dailyTrend.filter((d) => d.date.startsWith(selectedMonth));
      const pie = monthlyCategoryTotals
        .filter((m) => m.month === selectedMonth)
        .map((x) => ({ category: x.category, total: x.total }));
      const mTotal = bar.length ? bar[0].total : 0;

      return { pie, bar, line, total: mTotal };
    }

    if (filterType === "year") {
      if (!selectedYear)
        return { pie: [], bar: [], line: [], total: 0 };

      const bar = monthlyTotals.filter((m) => m.month.startsWith(selectedYear));
      const line = dailyTrend.filter((d) => d.date.startsWith(selectedYear));
      const pie = yearlyCategoryTotals
        .filter((y) => y.year === selectedYear)
        .map((x) => ({ category: x.category, total: x.total }));
      const yRow = yearlyTotals.find((y) => y.year === selectedYear);
      const yTotal = yRow ? yRow.total : 0;

      return { pie, bar, line, total: yTotal };
    }

    return { pie: categoryTotals, bar: monthlyTotals, line: dailyTrend, total };
  }, [
    filterType,
    selectedMonth,
    selectedYear,
    categoryTotals,
    monthlyTotals,
    dailyTrend,
    monthlyCategoryTotals,
    yearlyTotals,
    yearlyCategoryTotals,
    total,
  ]);

  const { pie, bar, line } = filtered;

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-semibold">Analytics</h3>
          <p className="text-sm text-gray-500">Filtered financial insights</p>
        </div>

        <div className="flex gap-3 items-center">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option value="all">All Time</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>

          {filterType === "month" && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border p-2 rounded-lg"
            />
          )}

          {filterType === "year" && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="">Select year</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Total */}
      <div className="mb-6">
        <p className="text-gray-500 text-sm">Total Spent</p>
        <p className="text-2xl font-bold text-blue-600">
          ₹{filtered.total.toFixed(2)}
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PIE */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium mb-2 text-sm">Spending by Category</p>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pie.length ? pie : [{ category: "No Data", total: 1 }]}
                  dataKey="total"
                  nameKey="category"
                  outerRadius={80}
                  innerRadius={35}
                >
                  {pie.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BAR */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium mb-2 text-sm">Monthly Spend</p>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={bar}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ReTooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
                <Bar dataKey="total">
                  {bar.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LINE */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium mb-2 text-sm">Daily Trend</p>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={line}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ReTooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
                <Line type="monotone" dataKey="total" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* small list / legend for categories */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {pie.length ? (
          pie.slice(0, 12).map((c, i) => (
            <div key={c.category + i} className="flex items-center gap-3">
              <span
                style={{ background: COLORS[i % COLORS.length] }}
                className="w-3 h-3 rounded-full inline-block"
              />
              <div>
                <div className="text-sm font-medium">{c.category || "Others"}</div>
                <div className="text-xs text-gray-500">
                  ₹{toNumber(c.total).toFixed(2)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No category data</p>
        )}
      </div>
    </div>
  );
}
