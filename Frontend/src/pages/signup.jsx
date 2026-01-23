import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import api from "../service/api.js";

export default function Signup() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await api.post("/api/auth/signup", form);

      setSuccessMsg("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setErrorMsg("Email already exists or invalid details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar showUserActions={false} />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 pt-24 transition duration-300">
        <div
          className="
          w-full max-w-md p-8 rounded-3xl
          bg-white/40 dark:bg-gray-800/40
          backdrop-blur-xl shadow-2xl border border-white/20 dark:border-gray-700/30
        "
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-16 mx-auto mb-3 text-gray-800 dark:text-gray-200"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            Create Your Account
          </h2>

          {errorMsg && (
            <p className="text-red-500 text-center mb-4">{errorMsg}</p>
          )}

          {successMsg && (
            <p className="text-green-600 text-center mb-4">{successMsg}</p>
          )}

          <form
            className="opening-show flex flex-col gap-5"
            onSubmit={handleSubmit}
          >
            {/* Full Name */}
            <div>
              <label className="text-gray-700 dark:text-gray-300 font-medium">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="
                  w-full mt-1 p-3 rounded-xl
                  bg-white/60 dark:bg-gray-700/50
                  border border-gray-300 dark:border-gray-600
                  focus:outline-none focus:ring-2
                  focus:ring-blue-500 dark:focus:ring-blue-400
                  backdrop-blur-sm placeholder-gray-400 dark:placeholder-gray-500
                  transition dark:text-gray-100
                "
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-700 dark:text-gray-300 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="
                  w-full mt-1 p-3 rounded-xl
                  bg-white/60 dark:bg-gray-700/50
                  border border-gray-300 dark:border-gray-600
                  focus:outline-none focus:ring-2
                  focus:ring-blue-500 dark:focus:ring-blue-400
                  backdrop-blur-sm placeholder-gray-400 dark:placeholder-gray-500
                  transition dark:text-gray-100
                "
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-700 dark:text-gray-300 font-medium">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="
                  w-full mt-1 p-3 rounded-xl
                  bg-white/60 dark:bg-gray-700/50
                  border border-gray-300 dark:border-gray-600
                  focus:outline-none focus:ring-2
                  focus:ring-blue-500 dark:focus:ring-blue-400
                  backdrop-blur-sm placeholder-gray-400 dark:placeholder-gray-500
                  transition dark:text-gray-100
                "
              />
            </div>
            {/* Show Password Checkbox */}
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="w-4 h-4"
              />
              Show Password
            </label>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full mt-3 py-3 rounded-xl text-lg font-semibold
                bg-blue-600 dark:bg-blue-500 text-white
                shadow-md hover:shadow-lg
                hover:bg-blue-700 dark:hover:bg-blue-600
                transition disabled:opacity-50
              "
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-700 dark:text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
