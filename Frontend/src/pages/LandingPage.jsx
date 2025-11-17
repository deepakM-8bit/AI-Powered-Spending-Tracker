import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  // THEME HANDLER
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Inject theme to HTML
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Play opening animation
  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* FLOATING KEYFRAMES */}
      <style>{`
        @keyframes floatSine {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          50% { transform: translateY(-18px) translateX(-6px) rotate(6deg); }
          100% { transform: translateY(0) translateX(0) rotate(0deg); }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[92%] md:w-[94%] max-w-7xl z-30">
        <div className="backdrop-blur-md bg-white/60 dark:bg-black/40 border dark:border-gray-700 border-gray-200 rounded-2xl shadow-lg px-4 md:px-6 py-3 flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-4">
            <h1 className="text-lg md:text-2xl font-bold tracking-tight pr-2">
              AI Expense Tracker
            </h1>
            <span className="hidden md:inline-block text-sm text-gray-500 dark:text-gray-300">
              Smarter spending with AI
            </span>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>

            <Link
              to="/login"
              className="px-3 py-2 text-sm md:text-base font-medium text-blue-600 dark:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm md:text-base shadow"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen((s) => !s)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg"
                className={`w-6 h-6 transform transition-transform ${mobileMenuOpen ? "rotate-90" : "rotate-0"}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden mt-2 w-full px-4 transition-all origin-top ease-out duration-300 ${
            mobileMenuOpen
              ? "opacity-100 translate-y-0 scale-y-100"
              : "opacity-0 -translate-y-2 scale-y-95 pointer-events-none"
          }`}
        >
          <div className="backdrop-blur-md bg-white/70 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-lg">
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block mt-2 px-3 py-2 bg-blue-600 text-white rounded-md text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* FLOATING BLOBS */}
      <div aria-hidden className="pointer-events-none blob-container">
        <div style={{ zIndex: 0 }} className="absolute inset-0 -top-6 flex justify-center">
          <div className="relative w-full max-w-7xl mx-auto">
            {/* left blob */}
            <div
              className="absolute -left-40 -top-28 w-72 h-72 rounded-full blur-3xl opacity-70 transform-gpu"
              style={{
                background:
                  "linear-gradient(135deg, rgba(79,70,229,0.18), rgba(99,102,241,0.08))",
                animation: "floatSine 6s ease-in-out infinite",
              }}
            />
            {/* right blob */}
            <div
              className="absolute -right-28 -top-10 w-56 h-56 rounded-full blur-2xl opacity-70 transform-gpu"
              style={{
                background:
                  "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(34,211,238,0.06))",
                animation: "floatSine 7s ease-in-out infinite",
              }}
            />

            {/* center soft gradient */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -top-8 w-[60%] h-48 rounded-3xl blur-2xl opacity-30"
              style={{
                background:
                  "linear-gradient(90deg, rgba(59,130,246,0.08), rgba(99,102,241,0.06))",
                animation: "floatSine 9s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <main className="pt-36 pb-12 px-6 md:px-10 max-w-7xl mx-auto relative z-10">
        <section
          className={`flex flex-col items-center text-center opening-init ${
            animate ? "opening-show" : ""
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-4xl mb-3">
            Smarter Spending With{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              AI-Powered Insights
            </span>
          </h2>

          <p className="animate-slideDown mt-5 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
            Track daily expenses, visualize patterns, get on-demand AI
            suggestions, and manage your money effortlessly — all in a single
            beautiful dashboard.
          </p>

          <div className="animate-slideDown mt-8 flex gap-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-medium shadow-lg transform transition hover:-translate-y-0.5"
            >
              Get Started
            </Link>

            <a
              href="#features"
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl text-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Learn More
            </a>
          </div>
        </section>
      </main>

      {/* FEATURES */}
      <section
        id="features"
        className="px-6 md:px-10 pb-24 max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div className="animate-slideDown relative bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
          <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-400 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Visualize monthly, weekly, and category-wise expenses with clear
            charts.
          </p>
        </div>

        <div className="animate-slideDown relative bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
          <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-teal-400 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Personalized suggestions to reduce unnecessary spending and optimize
            your budget.
          </p>
        </div>

        <div className="relative bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
          <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Simple & Fast</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Add, edit, and track expenses in seconds with a modern UI built for
            speed.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-black/40 shadow-inner py-12 mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-300 px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
            <div>
              <p className="text-lg font-semibold">AI Expense Tracker</p>
              <p className="mt-2 text-sm">Made with ❤️ to help you spend smarter.</p>
            </div>

            <div className="flex gap-4 items-center">
              <a href="#" className="text-sm hover:underline">Privacy</a>
              <a href="#" className="text-sm hover:underline">Terms</a>
              <a href="#" className="text-sm hover:underline">Contact</a>
            </div>
          </div>

          <p className="mt-6 text-xs text-gray-500">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
