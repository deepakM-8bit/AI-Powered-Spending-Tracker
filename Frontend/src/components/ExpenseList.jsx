import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth.jsx";

/**
 * ExpenseList.jsx
 * - Table view with search, filters, sort, pagination, CSV export
 * - Keeps your existing API calls & modals (edit/delete) intact
 * - Responsive and uses Tailwind utility classes
 */

export default function ExpenseList() {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState([]);

  // Modal state (unchanged behavior)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // UI state
  const [query, setQuery] = useState(""); // search
  const [catFilter, setCatFilter] = useState(""); // category filter
  const [dateFrom, setDateFrom] = useState(""); // yyyy-mm-dd
  const [dateTo, setDateTo] = useState(""); // yyyy-mm-dd

  // sorting
  const [sortBy, setSortBy] = useState("date"); // field
  const [sortDir, setSortDir] = useState("desc"); // asc | desc

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // keep normalization exactly as before
  const normalizeExpense = (x) => ({
    ...x,
    id: x.id ?? x.expense_id ?? x._id ?? null,
    title: x.title ?? "",
    amount: Number(x.amount) || 0,
    category: x.category || "Others",
    date: x.date || new Date().toISOString().slice(0, 10),
    note: x.note ?? "",
    recurring:
      typeof x.recurring === "string" && x.recurring.trim()
        ? x.recurring
        : "none",
  });

  // fetch (same endpoint)
  const fetchExpenses = useCallback(() => {
    axios
      .get("http://localhost:3000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const normalized = (res.data || []).map(normalizeExpense);
        setExpenses(normalized);
      })
      .catch((err) => {
        console.error("fetchExpenses error:", err);
        setExpenses([]);
      });
  }, [token]);

  useEffect(() => {
    fetchExpenses();
    window.addEventListener("expenseUpdated", fetchExpenses);
    return () => window.removeEventListener("expenseUpdated", fetchExpenses);
  }, [fetchExpenses]);

  // Edit modal controls (unchanged behavior)
  const openEditModal = (exp) => {
    setSelectedExpense({ ...exp });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) =>
    setSelectedExpense({ ...selectedExpense, [e.target.name]: e.target.value });

  const saveEdit = async () => {
    if (!selectedExpense) return;

    await axios.put(
      `http://localhost:3000/api/expenses/${selectedExpense.id}`,
      selectedExpense,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setEditModalOpen(false);
    setSelectedExpense(null);
    fetchExpenses();
  };

  const deleteExpense = async () => {
    if (!selectedExpense || !selectedExpense.id) return;

    await axios.delete(
      `http://localhost:3000/api/expenses/${selectedExpense.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setDeleteConfirmOpen(false);
    setSelectedExpense(null);
    fetchExpenses();
  };

  // derived categories for filter dropdown
  const categories = useMemo(() => {
    const setCats = new Set(expenses.map((e) => e.category || "Others"));
    return Array.from(setCats).sort();
  }, [expenses]);

  // filter & search & sort pipeline (applies to UI only)
  const processed = useMemo(() => {
    let list = [...expenses];

    // search (title + note)
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (e) =>
          (e.title || "").toLowerCase().includes(q) ||
          (e.note || "").toLowerCase().includes(q)
      );
    }

    // category filter
    if (catFilter) {
      list = list.filter((e) => e.category === catFilter);
    }

    // date range filter (inclusive)
    if (dateFrom) {
      list = list.filter((e) => e.date >= dateFrom);
    }
    if (dateTo) {
      list = list.filter((e) => e.date <= dateTo);
    }

    // sort
    const dir = sortDir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      // handle different sort keys
      if (sortBy === "amount") {
        return (a.amount - b.amount) * dir;
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title) * dir;
      }
      if (sortBy === "category") {
        return a.category.localeCompare(b.category) * dir;
      }
      if (sortBy === "recurring") {
        return (a.recurring || "").localeCompare(b.recurring || "") * dir;
      }
      // default sort by date
      return (a.date > b.date ? 1 : a.date < b.date ? -1 : 0) * dir;
    });

    return list;
  }, [expenses, query, catFilter, dateFrom, dateTo, sortBy, sortDir]);

  // pagination slice
  const totalItems = processed.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  useEffect(() => {
    // keep page within bounds
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return processed.slice(start, start + pageSize);
  }, [processed, page, pageSize]);

  // CSV Export of the current processed array (visible data)
  const exportCSV = () => {
    const rows = processed.map((r) => ({
      Title: r.title,
      Amount: r.amount,
      Date: r.date,
      Category: r.category,
      Note: r.note,
      Recurring: r.recurring,
      ID: r.id,
    }));

    const header = Object.keys(rows[0] || {
      Title: "",
      Amount: "",
      Date: "",
      Category: "",
      Note: "",
      Recurring: "",
      ID: "",
    });

    const csv = [
      header.join(","),
      ...rows.map((row) =>
        header
          .map((h) => {
            const v = row[h] ?? "";
            // escape quotes & wrap fields that contain commas/newlines
            const out =
              typeof v === "string"
                ? `"${v.replace(/"/g, '""')}"`
                : `${v}`;
            return out;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // helper UI utilities
  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  };

  // header click to toggle sort
  const onHeaderClick = (field) => {
    if (sortBy === field) {
      setSortDir((s) => (s === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow mt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <h3 className="text-xl font-semibold">Your Expenses</h3>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
            title="Export visible rows to CSV"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 my-auto mr-1">
             <path fill-rule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6.905 9.97a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72V18a.75.75 0 0 0 1.5 0v-4.19l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clip-rule="evenodd" />
              <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
                </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search title or note..."
            className="w-full p-2 border rounded-lg"
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
            className="px-3 py-2 bg-gray-100 rounded-lg text-sm"
            title="Reset filters"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={catFilter}
            onChange={(e) => {
              setCatFilter(e.target.value);
              setPage(1);
            }}
            className="p-2 border rounded-lg w-full"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            className="p-2 border rounded-lg"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            className="p-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th
                className="p-3 cursor-pointer"
                onClick={() => onHeaderClick("title")}
              >
                Title {sortBy === "title" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => onHeaderClick("amount")}
              >
                Amount {sortBy === "amount" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => onHeaderClick("date")}
              >
                Date {sortBy === "date" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => onHeaderClick("category")}
              >
                Category {sortBy === "category" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-3">Note</th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => onHeaderClick("recurring")}
              >
                Recurring {sortBy === "recurring" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-3 text-center">Modify</th>
            </tr>
          </thead>

          <tbody>
            {paged.length ? (
              paged.map((e, i) => (
                <tr
                  key={e.id}
                  className={`border-t ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="p-3 font-semibold text-gray-800">{e.title}</td>

                  <td className="p-3 text-blue-600 font-bold">
                    ₹{Number(e.amount || 0).toFixed(2)}
                  </td>

                  <td className="p-3 text-gray-600">{formatDate(e.date)}</td>

                  <td className="p-3">{e.category}</td>

                  <td className="p-3 max-w-[200px] truncate">{e.note || "—"}</td>

                  <td className="p-3">
                    {e.recurring && e.recurring !== "none" ? (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                        {e.recurring.toUpperCase()}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm"
                        onClick={() => openEditModal(e)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 mx-auto">
                          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                </svg>
                      </button>

                      <button
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                        onClick={() => {
                          setSelectedExpense(e);
                          setDeleteConfirmOpen(true);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 mx-auto">
                          <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                            </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500 text-sm">
                  No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination controls */}
      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded-lg"
            disabled={page <= 1}
          >
            Prev
          </button>

          <div className="text-sm">
            Page <span className="font-medium">{page}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded-lg"
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <label>Rows</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="p-1 border rounded-lg"
          >
            <option value={5}>5</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* EDIT MODAL (unchanged contents except safety checks) */}
      {editModalOpen && selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-20">
          <div className="bg-white p-8 rounded-2xl w-[95%] max-w-lg shadow-lg animate-fadeIn">
            <h3 className="text-xl font-bold mb-6">Edit Expense</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                value={selectedExpense.title ?? ""}
                onChange={handleEditChange}
                className="p-3 border rounded-xl md:col-span-2"
                placeholder="Title"
              />

              <input
                name="amount"
                type="number"
                value={selectedExpense.amount ?? ""}
                onChange={handleEditChange}
                className="p-3 border rounded-xl"
                placeholder="Amount"
              />

              <select
                name="category"
                value={selectedExpense.category ?? "Others"}
                onChange={handleEditChange}
                className="p-3 border rounded-xl"
              >
                {/* keep same options as before */}
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
                // safety: ensure value is present & trimmed for T part
                value={
                  (selectedExpense.date && selectedExpense.date.split
                    ? selectedExpense.date.split("T")[0]
                    : selectedExpense.date) ?? ""
                }
                onChange={handleEditChange}
                className="p-3 border rounded-xl"
              />

              <select
                name="recurring"
                value={selectedExpense.recurring ?? "none"}
                onChange={handleEditChange}
                className="p-3 border rounded-xl"
              >
                <option value="none">Not Recurring</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>

              <textarea
                name="note"
                value={selectedExpense.note ?? ""}
                onChange={handleEditChange}
                className="p-3 border rounded-xl md:col-span-2"
                placeholder="Note"
              ></textarea>
            </div>

            <div className="flex justify-end mt-6 gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-xl"
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedExpense(null);
                }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-xl"
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-lg animate-fadeIn">
            <h3 className="text-xl font-semibold mb-4">Delete Expense?</h3>
            <p className="text-gray-600">
              Are you sure you want to delete <b>{selectedExpense.title}</b>?
            </p>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-xl"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setSelectedExpense(null);
                }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded-xl"
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
