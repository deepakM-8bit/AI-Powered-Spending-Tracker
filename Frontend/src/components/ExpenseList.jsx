import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth.jsx";

export default function ExpenseList() {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // UI state
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Normalize
  const normalizeExpense = (x) => ({
    ...x,
    id: x.id ?? x.expense_id ?? x._id ?? null,
    title: x.title ?? "",
    amount: Number(x.amount) || 0,
    category: x.category || "Others",
    date: x.date || new Date().toISOString().slice(0, 10),
    note: x.note ?? "",
    recurring: x.recurring?.trim() || "none",
  });

  const fetchExpenses = useCallback(() => {
    axios
      .get("http://localhost:3000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const normalized = (res.data || []).map(normalizeExpense);
        setExpenses(normalized);
      })
      .catch(() => setExpenses([]));
  }, [token]);

  useEffect(() => {
    fetchExpenses();
    window.addEventListener("expenseUpdated", fetchExpenses);
    return () =>
      window.removeEventListener("expenseUpdated", fetchExpenses);
  }, [fetchExpenses]);

  const openEditModal = (exp) => {
    setSelectedExpense({ ...exp });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) =>
    setSelectedExpense({ ...selectedExpense, [e.target.name]: e.target.value });

  const saveEdit = async () => {
    await axios.put(
      `http://localhost:3000/api/expenses/${selectedExpense.id}`,
      selectedExpense,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditModalOpen(false);
    setSelectedExpense(null);
    fetchExpenses();
  };

  const deleteExpense = async () => {
    await axios.delete(
      `http://localhost:3000/api/expenses/${selectedExpense.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setDeleteConfirmOpen(false);
    setSelectedExpense(null);
    fetchExpenses();
  };

  const categories = useMemo(() => {
    const setCats = new Set(expenses.map((e) => e.category || "Others"));
    return Array.from(setCats).sort();
  }, [expenses]);

  const processed = useMemo(() => {
    let list = [...expenses];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.note || "").toLowerCase().includes(q)
      );
    }

    if (catFilter) list = list.filter((e) => e.category === catFilter);
    if (dateFrom) list = list.filter((e) => e.date >= dateFrom);
    if (dateTo) list = list.filter((e) => e.date <= dateTo);

    const dir = sortDir === "asc" ? 1 : -1;

    list.sort((a, b) => {
      if (sortBy === "amount") return (a.amount - b.amount) * dir;
      if (sortBy === "title") return a.title.localeCompare(b.title) * dir;
      if (sortBy === "category") return a.category.localeCompare(b.category) * dir;
      if (sortBy === "recurring") return a.recurring.localeCompare(b.recurring) * dir;
      return (a.date > b.date ? 1 : -1) * dir;
    });

    return list;
  }, [expenses, query, catFilter, dateFrom, dateTo, sortBy, sortDir]);

  const totalItems = processed.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return processed.slice(start, start + pageSize);
  }, [processed, page, pageSize]);

  const exportCSV = () => {
    if (!processed.length) return;

    const header = Object.keys(processed[0]);
    const csv = [
      header.join(","),
      ...processed.map((r) =>
        header.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  };

  const onHeaderClick = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  return (
    <div
      className="fade-up
        bg-white/30 dark:bg-gray-800/30
        backdrop-blur-xl border border-white/40 dark:border-gray-700/40
        p-6 rounded-2xl shadow-xl mt-10
        transition-all duration-300
      "
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Your Expenses
        </h3>

        <button
          onClick={exportCSV}
          className="
            px-4 py-2 rounded-lg text-white text-sm
            bg-green-600 hover:bg-green-700
            dark:bg-green-700 dark:hover:bg-green-800
            transition  "
        >
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search title or note..."
            className="
              w-full p-2 rounded-lg
              bg-white/50 dark:bg-gray-800/40
              border border-gray-300/50 dark:border-gray-700/50
              text-gray-900 dark:text-gray-100
              focus:ring focus:ring-blue-400 dark:focus:ring-blue-500
            "
          />

          <button
            onClick={() => {
              setQuery("");
              setCatFilter("");
              setDateFrom("");
              setDateTo("");
              setPage(1);
              setSortBy("date");
              setSortDir("desc");
            }}
            className="
              px-3 py-2 rounded-lg text-sm
              bg-gray-200 hover:bg-gray-300 
              dark:bg-gray-700 dark:hover:bg-gray-600 
              text-gray-800 dark:text-gray-200
              transition
            "
          >
            Reset
          </button>
        </div>

        <select
          value={catFilter}
          onChange={(e) => {
            setCatFilter(e.target.value);
            setPage(1);
          }}
          className="
            p-2 rounded-lg w-full
            bg-white/50 dark:bg-gray-800/40
            border border-gray-300/50 dark:border-gray-700/50
            text-gray-900 dark:text-gray-100
          "
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option value={c} key={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            className="
              p-2 rounded-lg
              bg-white/50 dark:bg-gray-800/40
              border border-gray-300/50 dark:border-gray-700/50
              text-gray-900 dark:text-gray-100
            "
          />

          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            className="
              p-2 rounded-lg
              bg-white/50 dark:bg-gray-800/40
              border border-gray-300/50 dark:border-gray-700/50
              text-gray-900 dark:text-gray-100
            "
          />
        </div>
      </div>

      {/* Table */}
      <div
        className="
          overflow-x-auto rounded-xl
          border border-gray-300/40 dark:border-gray-500/40
          bg-white/20 dark:bg-gray-900/20 backdrop-blur-md
        "
      >
        <table className="w-full text-left text-sm">
          <thead
            className="
              bg-gray-100/60 dark:bg-gray-800/60
              text-gray-700 dark:text-gray-300 text-xs uppercase
            "
          >
            <tr>
              {[
                ["title", "Title"],
                ["amount", "Amount"],
                ["date", "Date"],
                ["category", "Category"],
              ].map(([field, label]) => (
                <th
                  key={field}
                  className="p-3 cursor-pointer"
                  onClick={() => onHeaderClick(field)}
                >
                  {label}{" "}
                  {sortBy === field ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
              ))}
              <th className="p-3">Note</th>

              <th
                className="p-3 cursor-pointer"
                onClick={() => onHeaderClick("recurring")}
              >
                Recurring{" "}
                {sortBy === "recurring" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>

              <th className="p-3 text-center">Modify</th>
            </tr>
          </thead>

          <tbody>
            {paged.length ? (
              paged.map((e, i) => (
                <tr
                  key={e.id}
                  className={`border-t ${
                    i % 2 === 0
                      ? "bg-white/40 dark:bg-gray-900/40"
                      : "bg-gray-100/40 dark:bg-gray-800/40"
                  }`}
                >
                  <td className="p-3 font-semibold text-gray-900 dark:text-gray-100">
                    {e.title}
                  </td>

                  <td className="p-3 text-blue-600 dark:text-blue-300 font-bold">
                    ₹{Number(e.amount).toFixed(2)}
                  </td>

                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {formatDate(e.date)}
                  </td>

                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    {e.category}
                  </td>

                  <td className="p-3 text-gray-700 dark:text-gray-400 max-w-[200px] truncate">
                    {e.note || "—"}
                  </td>

                  <td className="p-3">
                    {e.recurring !== "none" ? (
                      <span
                        className="
                          px-2 py-1 text-xs rounded-full
                          bg-blue-200 text-blue-700
                          dark:bg-blue-700 dark:text-blue-200
                        "
                      >
                        {e.recurring.toUpperCase()}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">

                      {/* Edit Button */}
                      <button
                        onClick={() => openEditModal(e)}
                        className="
                          px-3 py-1 rounded-lg text-white text-sm
                          bg-yellow-500 hover:bg-yellow-600
                          dark:bg-yellow-600 dark:hover:bg-yellow-700
                        "
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 mx-auto"> <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 
                        2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" /> <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 
                        3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" /> 
                        </svg>
                        Edit
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          setSelectedExpense(e);
                          setDeleteConfirmOpen(true);
                        }}
                        className="
                          px-3 py-1 rounded-lg text-white text-sm
                          bg-red-500 hover:bg-red-600
                          dark:bg-red-600 dark:hover:bg-red-700
                        "
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 mx-auto"> <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 
                        1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662
                         52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75
                          0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" /> 
                          </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="p-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="
              px-3 py-1 rounded-lg border
              bg-gray-100 dark:bg-gray-800
              text-gray-800 dark:text-gray-200
              hover:bg-gray-200 dark:hover:bg-gray-700
              disabled:opacity-40
            "
          >
            Prev
          </button>

          <div className="text-sm text-gray-900 dark:text-gray-100">
            Page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="
              px-3 py-1 rounded-lg border
              bg-gray-100 dark:bg-gray-800
              text-gray-800 dark:text-gray-200
              hover:bg-gray-200 dark:hover:bg-gray-700
              disabled:opacity-40
            "
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <label className="text-gray-700 dark:text-gray-300">Rows</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="
              p-1 rounded-lg
              bg-white/50 dark:bg-gray-800/40
              border border-gray-300/50 dark:border-gray-700/50
              text-gray-900 dark:text-gray-100
            "
          >
            <option value={5}>5</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editModalOpen && selectedExpense && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
          <div
            className="
              bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-[95%] max-w-lg
            "
          >
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Edit Expense
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                name="title"
                value={selectedExpense.title || ""}
                onChange={handleEditChange}
                className="
                  p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 
                  border border-gray-300/50 dark:text-gray-100 dark:border-gray-700/40
                "
              />

              <input
                name="amount"
                type="number"
                value={selectedExpense.amount || ""}
                onChange={handleEditChange}
                className="
                  p-3 rounded-xl bg-white/60 dark:text-gray-100 dark:bg-gray-800/60 
                  border border-gray-300/50 dark:border-gray-700/40
                "
              />

              <select
                name="category"
                value={selectedExpense.category || "Others"}
                onChange={handleEditChange}
                className="
                  p-3 rounded-xl bg-white/60 dark:text-gray-100 dark:bg-gray-900/70 
                  border border-gray-300/50 dark:border-gray-700/40
                "
              >
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
                value={selectedExpense.date?.split("T")[0] || ""}
                onChange={handleEditChange}
                className="
                  p-3 rounded-xl bg-white/60 dark:text-gray-100 dark:bg-gray-800/60 
                  border border-gray-300/50 dark:border-gray-700/40
                "
              />

              <select
                name="recurring"
                value={selectedExpense.recurring || "none"}
                onChange={handleEditChange}
                className="
                  p-3 rounded-xl bg-white/60 dark:text-gray-100 dark:bg-gray-800/60 
                  border border-gray-300/50 dark:border-gray-700/40
                "
              >
                <option value="none">Not Recurring</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>

              <textarea
                name="note"
                value={selectedExpense.note || ""}
                onChange={handleEditChange}
                className="
                  p-3 rounded-xl bg-white/60 dark:text-gray-100 dark:bg-gray-800/60 
                  border border-gray-300/50 dark:border-gray-700/40 md:col-span-2
                "
                placeholder="Note"
              ></textarea>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="
                  px-4 py-2 rounded-xl 
                  bg-gray-300 hover:bg-gray-400 
                  dark:bg-gray-700 dark:hover:bg-gray-600
                  text-gray-800 dark:text-gray-100
                "
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedExpense(null);
                }}
              >
                Cancel
              </button>

              <button
                className="
                  px-4 py-2 rounded-xl text-white
                  bg-blue-600 hover:bg-blue-700 
                  dark:bg-blue-700 dark:hover:bg-blue-800
                "
                onClick={saveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirmOpen && selectedExpense && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
          <div
            className="
              bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl 
              w-[90%] max-w-md
            "
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Delete Expense?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete{" "}
              <b>{selectedExpense.title}</b>?
            </p>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="
                  px-4 py-2 rounded-xl
                  bg-gray-300 hover:bg-gray-400
                  dark:bg-gray-700 dark:hover:bg-gray-600
                  text-gray-900 dark:text-gray-100
                "
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setSelectedExpense(null);
                }}
              >
                Cancel
              </button>

              <button
                className="
                  px-4 py-2 rounded-xl text-white
                  bg-red-600 hover:bg-red-700
                  dark:bg-red-700 dark:hover:bg-red-800
                "
                onClick={deleteExpense}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
