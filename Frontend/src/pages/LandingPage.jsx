import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 bg-white shadow-sm fixed top-0 left-0 w-full z-10">
        <h1 className="text-2xl font-bold tracking-tight">AI Expense Tracker</h1>

        <div className="flex gap-6 text-lg">
          <Link to="/login" className="px-4 py-2 text-xl font-semibold text-blue-600 rounded-xl hover:text-sky-900 transition">Login</Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-10 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl font-bold max-w-3xl leading-tight">
          Smarter Spending With <span className="text-blue-600">AI-Powered</span> Insights
        </h2>

        <p className="mt-5 text-lg text-gray-600 max-w-2xl">
          Track your daily expenses, visualize spending patterns, get weekly AI suggestions,
          and manage your money effortlessly — all in one clean and powerful dashboard.
        </p>

        <Link
          to="/login"
          className="mt-8 px-8 py-4 bg-blue-600 text-white text-xl font-medium rounded-2xl shadow-lg hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Features */}
      <section className="px-10 pb-24 grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition text-center">
          <h3 className="text-2xl font-semibold mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mx-auto mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                </svg>
                    Smart Analytics</h3>
          <p className="text-gray-600">
            Visualize monthly, weekly, and category-wise expenses with clean charts.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition text-center">
          <h3 className="text-2xl font-semibold mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 mx-auto mb-3">
               <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                     AI Insights</h3>
          <p className="text-gray-600">
            Personalized suggestions to reduce unnecessary spending and optimize your budget.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition text-center">
          <h3 className="text-2xl font-semibold mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 mx-auto mb-3">
              <path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
                  Simple & Fast</h3>
          <p className="text-gray-600">
            Add, edit, and track expenses in seconds with a clean UI designed for speed.
          </p>
        </div>
      </section>
    </div>
  );
}
