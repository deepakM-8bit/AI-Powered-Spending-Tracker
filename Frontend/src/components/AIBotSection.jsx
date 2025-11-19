import { useAuth } from "../context/useAuth.jsx";
import { useState, useRef } from "react";
import axios from "axios";

export default function AiInsights() {
  const { token } = useAuth();

  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);

  // Rotating loading messages
  const loadingTexts = [
    "Analyzing...",
    "Getting your analytics...",
    "Reviewing your spendings...",
    "Preparing the insights..."
  ];

  const [loadingIndex, setLoadingIndex] = useState(0);
  const intervalRef = useRef(null);

  const generateInsights = async () => {
    setLoading(true);
    setLoadingIndex(0);

    // Start rotating text
    intervalRef.current = setInterval(() => {
      setLoadingIndex((prev) => {
        if (prev < loadingTexts.length - 1){
          return prev + 1;
        } else {
          clearInterval(intervalRef.current);
          return prev;
        }
      });
    }, 4000);

    try {
      const res = await axios.get("http://localhost:3000/api/ai/insights", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setInsights(res.data.insights);
    } catch (err) {
      console.error(err);
      setInsights("AI is currently busy. Try again in a moment ❤️");
    }

    // Stop text rotation
    clearInterval(intervalRef.current);
    setLoading(false);
  };

  return (
    <div
      className="
        mt-10 p-6 rounded-2xl shadow-xl
        bg-white/30 dark:bg-gray-800/30
        backdrop-blur-xl border border-white/40 dark:border-gray-700/40
        transition-all duration-300
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          AI Insights 🤖
        </h3>

        {/* Animated Gradient Button */}
        <button
          onClick={generateInsights}
          disabled={loading}
          className="
            relative inline-flex items-center justify-center px-1.5 py-1.5 rounded-xl
            text-white font-medium overflow-hidden transition-all duration-300
          "
        >
          {/* Moving Gradient Border */}
          <span
            className="
              absolute inset-0 rounded-xl p-[2px]
              bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
              animate-gradientMove
            "
          ></span>

          {/* Inner Background */}
          <span
            className="
              relative px-3 py-1 z-10 block rounded-lg
              bg-sky-400/20 dark:bg-blue-900/30
              backdrop-blur-md
              hover:bg-blue-700/30 dark:hover:bg-blue-300/20
              transition
            "
          >
            {loading ? loadingTexts[loadingIndex] : "Generate Insights"}
          </span>
        </button>
      </div>

      {/* Insights Text */}
      <div
        className="
          mt-4 whitespace-pre-wrap 
          text-gray-800 dark:text-gray-200 leading-relaxed
          bg-white/20 dark:bg-gray-800/20
          rounded-xl p-4 border border-white/20 dark:border-gray-700/30
          backdrop-blur-lg transition-all
        "
      >
        {insights || "Click generate to get AI-based spending analysis."}
      </div>

      {/* Gradient animation keyframes */}
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 50% 0%; }
          }
          .animate-gradientMove {
            background-size: 180% 180%;
            animation: gradientMove 3s ease infinite;
          }
        `}
      </style>
    </div>
  );
}
