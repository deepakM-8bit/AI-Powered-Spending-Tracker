import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (error) {
      console.error("Error fetching expenses:", error.response?.data || error.message);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  fetchExpenses();
}, [navigate]);


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Expenses</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-md">
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center">No expenses found.</p>
        ) : (
          <ul>
            {expenses.map((exp) => (
              <li key={exp.id} className="flex justify-between p-2 border-b">
                <span>{exp.title}</span>
                <span>₹{exp.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
