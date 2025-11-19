import Navbar from "../components/Navbar.jsx";
import HeroSection from "../components/HeroSection.jsx";
import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import AnalyticsSection from "../components/AnalyticsSection.jsx";
import AIBotSection from "../components/AIBotSection.jsx";
import { FooterSection } from "../components/Footer.jsx";
import { useAuth } from "../context/useAuth.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const showAnalytics = location.pathname === "/dashboard/analytics";

  // Close drawer on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && showAnalytics) navigate("/dashboard");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showAnalytics, navigate]);

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="pt-28 max-w-7xl mx-auto px-4 pb-2 space-y-14">
        <HeroSection />
        <ExpenseForm />
        <ExpenseList />
      </div>

      <FooterSection />

      {/* ----------------------------------------------------------
          PREMIUM SMOOTH SLIDE-OVER PANEL (ALWAYS MOUNTED)
      ---------------------------------------------------------- */}
      <>
        {/* PREMIUM FADE-IN BACKDROP */}
        <div
          onClick={() => navigate("/dashboard")}
          className={`
            fixed inset-0 bg-black/40 backdrop-blur-sm z-40
            transition-opacity duration-500 ease-out
            ${showAnalytics ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
        />

        {/* PREMIUM SLIDE-IN DRAWER PANEL */}
        <aside
          className={`
            fixed top-0 right-0 h-full z-50
            w-full sm:w-[80%] md:w-3/4 lg:w-4/5 xl:w-5/7
            bg-white/45 dark:bg-gray-900/40
            backdrop-blur-2xl border-l border-white/20 dark:border-gray-700/30
            shadow-2xl 
            p-6 overflow-auto

            transform transition-all duration-700 
            ease-[cubic-bezier(0.22,0.61,0.36,1)]

            ${showAnalytics ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
          `}
          role="dialog"
          aria-modal="true"
        >

          {/* TOP BAR */}
          <div 
            className={`
              flex items-center justify-between mb-5
              transition-all duration-700 delay-150
              ${showAnalytics ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
            `}
          >
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Analytics & AI Insights
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Deep interactive charts and personalized suggestions
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="
                px-3 py-2 flex items-center gap-2 rounded-lg
                bg-gray-200 hover:bg-gray-300
                dark:bg-gray-700 dark:hover:bg-gray-600
                text-gray-900 dark:text-gray-100
                transition
              "
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 16 16" 
                fill="currentColor" 
                className="size-5"
              >
                <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"/>
              </svg>
              Close
            </button>
          </div>

          {/* PANEL CONTENT (FADE + SLIDE UP) */}
          <div
            className={`
              grid grid-cols-1 gap-6 
              transition-all duration-700 delay-200
              ${showAnalytics ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
          >
            <AnalyticsSection />
            <AIBotSection />
          </div>

        </aside>
      </>
    </div>
  );
}
