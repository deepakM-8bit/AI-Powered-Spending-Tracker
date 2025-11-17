import { useAuth } from "../context/useAuth.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ showUserActions = true }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md py-4 px-20 flex justify-between items-center z-50">
      {/* App Title */}
      <h1 className="text-xl md:text-3xl font-bold">AI Expense Tracker</h1>

      {/* Desktop Actions */}
      {showUserActions && (
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="font-medium flex text-lg hover:text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
              <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
                </svg>
            {user?.name || "Profile"}
          </button>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}

      {/* Mobile Menu Button */}
      {showUserActions && (
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="
              M4 6h16M4 12h16M4 18h16
            " />
          </svg>
        </button>
      )}

      {/* Desktop Profile Dropdown */}
      {openProfile && (
        <div className="hidden md:block absolute top-16 right-6 bg-white shadow-lg p-6 rounded-xl w-60">
          <p className="font-semibold text-lg">{user?.name}</p>
          <p className="text-gray-900">{user?.email}</p>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 right-4 bg-white shadow-lg p-4 rounded-xl w-48 space-y-3">
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="w-full text-left font-medium text-lg hover:text-blue-600"
          >
            {user?.name || "Profile"}
          </button>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
