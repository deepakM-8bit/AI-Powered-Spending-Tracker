import { useAuth } from "../context/useAuth.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({showUserActions = true}) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md py-4 px-10 flex justify-between items-center z-20">
      <h1 className="text-2xl font-bold">AI Expense Tracker</h1>

      {showUserActions &&( 
      <div className="flex items-center gap-6">
        <button
          onClick={() => setOpenProfile(!openProfile)}
          className="flex font-medium text-lg hover:text-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 my-auto mr-1">
             <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
          {user?.name || "Profile"}
        </button>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="flex px-2 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 my-auto mr-1">
             <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
              </svg>
          Logout

        </button>
      </div>
      )}

      {openProfile && (
        <div className="absolute top-16 right-10 bg-white shadow-lg p-6 rounded-xl w-60">
          <p className="font-semibold text-lg">{user?.name}</p>
          <p className="text-gray-900">{user?.email}</p>
        </div>
      )}
    </nav>
  );
}
