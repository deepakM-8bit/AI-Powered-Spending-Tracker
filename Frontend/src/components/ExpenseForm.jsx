import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth.jsx";

export default function ExpenseForm() {
  const { token } = useAuth();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    note: "",
    recurring: "none",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:3000/api/expenses",
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setForm({
      title: "",
      amount: "",
      category: "",
      date: "",
      note: "",
      recurring: "none",
    });

    window.dispatchEvent(new Event("expenseUpdated"));
  };

  return (
    <form className="bg-white p-6 rounded-2xl shadow" onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold mb-4">Add New Expense</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="p-3 border rounded-xl"
        />

        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
          className="p-3 border rounded-xl"
        />

<select
  name="category"
  value={form.category}
  onChange={handleChange}
  required
  className="p-3 border rounded-xl"
>
  <option value="" disabled>Select Category</option>
  <option value="Food & Drinks">Food & Drinks</option>
  <option value="Transportation">Transportation</option>
  <option value="Shopping">Shopping</option>
  <option value="Entertainment">Entertainment</option>
  <option value="Bills & Utilities">Bills & Utilities</option>
  <option value="Travel">Travel</option>
  <option value="Health">Health</option>
  <option value="Groceries">Groceries</option>
  <option value="Education">Education</option>
  <option value="Investments">Investments</option>
  <option value="Rent">Rent</option>
  <option value="EMIs">EMIs</option>
  <option value="Subscriptions">Subscriptions</option>
  <option value="Personal Care">Personal Care</option>
  <option value="Others">Others</option>
</select>


        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          className="p-3 border rounded-xl"
        />

        <textarea
          name="note"
          placeholder="Add a note (optional)"
          value={form.note}
          onChange={handleChange}
          className="p-3 border rounded-xl md:col-span-2"
        ></textarea>

        <select
          name="recurring"
          value={form.recurring}
          onChange={handleChange}
          className="p-3 border rounded-xl"
        >
          <option value="none">Not Recurring</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

      </div>

      <button className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">
        Add Expense
      </button>
    </form>
  );
}
