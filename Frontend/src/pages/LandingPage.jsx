import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { useContext } from "react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* NAVBAR */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[93%] md:w-[94%] max-w-7xl z-30">
        <div className="opening-show backdrop-blur-md bg-white/70 dark:bg-black/50 border border-gray-300/50 dark:border-gray-700 rounded-2xl shadow-lg px-4 md:px-6 py-3 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-5">
              <path fill-rule="evenodd" d="M5 4a.75.75 0 0 1 .738.616l.252 1.388A1.25 1.25 0 0 0 6.996 7.01l1.388.252a.75.75 0 0 1 0 1.476l-1.388.252A1.25 1.25 0 0 0 5.99 9.996l-.252 1.388a.75.75 0 0 1-1.476 0L4.01 9.996A1.25 1.25 0 0 0 3.004 8.99l-1.388-.252a.75.75 0 0 1 0-1.476l1.388-.252A1.25 1.25 0 0 0 4.01 6.004l.252-1.388A.75.75 0 0 1 5 4ZM12 1a.75.75 0 0 1 .721.544l.195.682c.118.415.443.74.858.858l.682.195a.75.75 0 0 1 0 1.442l-.682.195a1.25 1.25 0 0 0-.858.858l-.195.682a.75.75 0 0 1-1.442 0l-.195-.682a1.25 1.25 0 0 0-.858-.858l-.682-.195a.75.75 0 0 1 0-1.442l.682-.195a1.25 1.25 0 0 0 .858-.858l.195-.682A.75.75 0 0 1 12 1ZM10 11a.75.75 0 0 1 .728.568.968.968 0 0 0 .704.704.75.75 0 0 1 0 1.456.968.968 0 0 0-.704.704.75.75 0 0 1-1.456 0 .968.968 0 0 0-.704-.704.75.75 0 0 1 0-1.456.968.968 0 0 0 .704-.704A.75.75 0 0 1 10 11Z" clip-rule="evenodd" />
            </svg>

            <h1 className="text-xl mr-1 md:text-3xl font-bold tracking-tight">SmartSpend</h1>
            <span className="hidden md:inline text-sm text-gray-500 dark:text-gray-300">Smarter spending with AI</span>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {theme === "dark" ? (
            // Moon icon
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          ) : (
            // Sun icon
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m8-10h2M2 12h2m14.1-7.1l1.4 1.4M4.5 19.5l1.4-1.4m12 0l1.4 1.4M4.5 4.5l1.4 1.4"/>
            </svg>
              )}
            </button>

            <Link to="/login" className="px-3 py-2 rounded-lg font-medium text-lg hover:bg-gray-200 dark:hover:bg-gray-700">
              Login
            </Link>

            <Link to="/signup" className="px-3 py-2 bg-blue-600 font-medium hover:bg-blue-700 text-white rounded-lg shadow">
              Sign Up
            </Link>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              {theme === "dark" ? (
            // Moon icon
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          ) : (
            // Sun icon
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m8-10h2M2 12h2m14.1-7.1l1.4 1.4M4.5 19.5l1.4-1.4m12 0l1.4 1.4M4.5 4.5l1.4 1.4"/>
            </svg>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen((s) => !s)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${mobileMenuOpen ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 w-[50%] absolute right-1 px-4">
            <div className="backdrop-blur-md bg-white/80 dark:bg-black/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-lg">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">Login</Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-center">Sign Up</Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <main className="pt-36 pb-12 px-6 md:px-10 max-w-7xl mx-auto">
        <section className="opening-show flex flex-col items-center text-center">
          <h2 className=" text-4xl md:text-5xl font-extrabold leading-tight max-w-4xl mb-3">
            Smarter Spending With{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              AI-Powered Insights
            </span>
          </h2>

          <p className="mt-5 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
            Track daily expenses, visualize patterns, get on-demand AI suggestions, and manage your money effortlessly.
          </p>

          <div className="mt-8 flex gap-4">
            <Link to="/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-medium shadow-lg">
              Get Started
            </Link>
            <a href="#features" className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
              Learn More
            </a>
          </div>
        </section>
      </main>

      {/* FEATURES */}
      <section id="features" className="fade-up px-6 md:px-10 pb-24 max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md hover:shadow-lg transition">
          <div className="mb-3 w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-400 text-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
              <path fill-rule="evenodd" d="M9.808 4.057a.75.75 0 0 1 .92-.527l3.116.849a.75.75 0 0 1 .528.915l-.823 3.121a.75.75 0 0 1-1.45-.382l.337-1.281a23.484 23.484 0 0 0-3.609 3.056.75.75 0 0 1-1.07.01L6 8.06l-3.72 3.72a.75.75 0 1 1-1.06-1.061l4.25-4.25a.75.75 0 0 1 1.06 0l1.756 1.755a25.015 25.015 0 0 1 3.508-2.85l-1.46-.398a.75.75 0 0 1-.526-.92Z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
          <p className="text-gray-600 dark:text-gray-300">Visualize monthly and category-wise expenses.</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md hover:shadow-lg transition">
          <div className="mb-3 w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-teal-400 text-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
              <path d="M10.618 10.26c-.361.223-.618.598-.618 1.022 0 .226-.142.43-.36.49A6.006 6.006 0 0 1 8 12c-.569 0-1.12-.08-1.64-.227a.504.504 0 0 1-.36-.491c0-.424-.257-.799-.618-1.021a5 5 0 1 1 5.235 0ZM6.867 13.415a.75.75 0 1 0-.225 1.483 9.065 9.065 0 0 0 2.716 0 .75.75 0 1 0-.225-1.483 7.563 7.563 0 0 1-2.266 0Z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
          <p className="text-gray-600 dark:text-gray-300">Personalized suggestions to reduce spending.</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md hover:shadow-lg transition">
          <div className="mb-3 w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
              <path fill-rule="evenodd" d="M9.58 1.077a.75.75 0 0 1 .405.82L9.165 6h4.085a.75.75 0 0 1 .567 1.241l-6.5 7.5a.75.75 0 0 1-1.302-.638L6.835 10H2.75a.75.75 0 0 1-.567-1.241l6.5-7.5a.75.75 0 0 1 .897-.182Z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Simple & Fast</h3>
          <p className="text-gray-600 dark:text-gray-300">Modern UI built for speed and clarity.</p>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-700/60 bg-white dark:bg-black/40 shadow-inner py-12 mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-300 px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
            <div>
              <p className="text-lg font-semibold">AI Expense Tracker</p>
              <p className="mt-2 text-sm">Made with ❤️ to help you spend smarter.</p>
              <p className="text-sm mt-1 text-blue-600 dark:text-blue-400 font-medium">Made by Deepak ❤️</p>
            </div>

            <div className="flex gap-4 items-center">
              <a href="#" className="text-sm hover:underline">Privacy</a>
              <a href="#" className="text-sm hover:underline">Terms</a>
              <a href="#" className="text-sm hover:underline">Contact</a>
            </div>
          </div>

          <p className="mt-6 text-xs text-gray-500">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
