import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function BursaryTracker() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [bursaryItems, setBursaryItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  ); // YYYY-MM-DD for date picker
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Format amount as currency (e.g. 1,234.56)
  const formatCurrency = (num) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) {
        fetchBursaries(u.uid, selectedDate);
      }
    });
    return () => unsubscribe();
  }, [selectedDate]);

  const fetchBursaries = async (uid, date) => {
    setLoading(true);
    const q = query(
      collection(db, "bursary"),
      where("uid", "==", uid),
      where("date", "==", date)
    );
    const snapshot = await getDocs(q);
    const items = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    setBursaryItems(items);
    setLoading(false);
    setPage(1); // Reset pagination on new date
  };

  const handleAdd = async () => {
    setError("");
    if (!name.trim()) {
      setError("Please enter a valid item name.");
      return;
    }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }
    if (bursaryItems.length >= 20) {
      setError("⚠️ Max item limit (20) reached for this day.");
      return;
    }
    if (!user) {
      setError("User not authenticated.");
      return;
    }
    try {
      await addDoc(collection(db, "bursary"), {
        uid: user.uid,
        name: name.trim(),
        amount: amt,
        date: selectedDate,
        recordMonth: selectedDate.slice(0, 7),
      });
      setName("");
      setAmount("");
      setSuccessMsg("Item added successfully!");
      fetchBursaries(user.uid, selectedDate);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      setError("Failed to add item. Try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDoc(doc(db, "bursary", id));
      fetchBursaries(user.uid, selectedDate);
    } catch (e) {
      alert("Failed to delete item.");
    }
  };

  // Pagination slice
  const paginatedItems = bursaryItems.slice(0, page * ITEMS_PER_PAGE);
  const canLoadMore = bursaryItems.length > paginatedItems.length;

  // Calculate total for selectedDate
  const totalAmount = bursaryItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-blue-50 p-6 text-blue-900 font-rubik">
      <h2 className="text-3xl font-bold mb-6 text-center">💰 Bursary Tracker</h2>

      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg space-y-5">
        {/* Date Picker */}
        <label className="block mb-1 font-semibold" htmlFor="date">
          Select Date:
        </label>
        <input
          id="date"
          type="date"
          className="border rounded p-2 w-full"
          value={selectedDate}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {/* Input and Add */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded p-2 flex-grow"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded p-2 w-32"
          />
          <button
            onClick={handleAdd}
            disabled={!name.trim() || !amount.trim()}
            className={`px-4 py-2 rounded text-white ${
              !name.trim() || !amount.trim()
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            ➕ Add
          </button>
        </div>

        {/* Error & Success Messages */}
        {error && <p className="text-red-600 font-medium">{error}</p>}
        {successMsg && <p className="text-green-600 font-medium">{successMsg}</p>}

        {/* Items List */}
        <div>
          <h3 className="font-semibold mb-3 flex justify-between items-center">
            📅 Entries for {selectedDate}{" "}
            <span className="text-sm text-gray-500">
              (Total: 💵 {formatCurrency(totalAmount)})
            </span>
          </h3>

          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : paginatedItems.length === 0 ? (
            <p className="text-gray-500">No bursary items for this date.</p>
          ) : (
            <ul className="divide-y divide-gray-200 max-h-96 overflow-auto">
              {paginatedItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center py-2 text-blue-800"
                >
                  <span>{item.name}</span>
                  <div className="flex items-center space-x-4">
                    <span>💵 {formatCurrency(item.amount)}</span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                      aria-label={`Delete ${item.name}`}
                      title="Delete"
                    >
                      ✖
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Load More */}
          {canLoadMore && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Load More
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-yellow-600">
          ⚠️ Max 20 items per day. Data resets monthly but stays visible in
          summary for 10 days after month end.
        </p>
      </div>
    </div>
  );
}
