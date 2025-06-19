import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  Timestamp,
  deleteField,
} from "firebase/firestore";

export default function BillPage() {
  const [user, setUser] = useState(null);
  const [billTypes, setBillTypes] = useState({});
  const [newBillName, setNewBillName] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      const month = new Date().toISOString().slice(0, 7); // YYYY-MM
      setCurrentMonth(month);
      if (u) {
        fetchData(u.uid, month);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async (uid, month) => {
    try {
      const docRef = doc(db, "bills", uid + "_" + month);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBillTypes(docSnap.data().billTypes || {});
      } else {
        setBillTypes({});
      }
    } catch (err) {
      setError("Failed to load bills.");
    }
  };

  const handleBillChange = (name, value) => {
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setBillTypes((prev) => ({
        ...prev,
        [name]: value,
      }));
      setError("");
    } else {
      setError("Please enter a valid positive number.");
    }
  };

  const handleAddBill = () => {
    setError("");
    if (Object.keys(billTypes).length >= 20) {
      setError("⚠️ Limit reached: You can add up to 20 bills.");
      return;
    }
    if (newBillName.trim() === "") {
      setError("Please enter a valid bill name.");
      return;
    }
    if (billTypes.hasOwnProperty(newBillName.trim())) {
      setError("Bill name already exists.");
      return;
    }
    setBillTypes((prev) => ({
      ...prev,
      [newBillName.trim()]: "",
    }));
    setNewBillName("");
  };

  const handleDeleteBill = (name) => {
    if (!window.confirm(`Delete bill "${name}"?`)) return;
    const newBills = { ...billTypes };
    delete newBills[name];
    setBillTypes(newBills);
  };

  const handleSave = async () => {
    setError("");
    if (!user) {
      setError("User not authenticated.");
      return;
    }
    // Validate all values before saving
    for (const val of Object.values(billTypes)) {
      if (val === "" || isNaN(parseFloat(val)) || parseFloat(val) < 0) {
        setError("Please enter valid positive amounts for all bills.");
        return;
      }
    }
    try {
      await setDoc(doc(db, "bills", user.uid + "_" + currentMonth), {
        uid: user.uid,
        billTypes,
        recordMonth: currentMonth,
        updatedAt: Timestamp.now(),
      });
      setSuccessMsg("✅ Bills saved successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError("❌ Failed to save bills.");
    }
  };

  // Calculate total bills amount
  const totalAmount = Object.values(billTypes).reduce((sum, val) => {
    const n = parseFloat(val);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  return (
    <div className="min-h-screen bg-blue-50 p-6 text-blue-900 font-rubik">
      <h2 className="text-3xl font-bold mb-6 text-center">🧾 Bill Tracker</h2>

      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg space-y-5">
        {/* Bill entries */}
        {Object.entries(billTypes).map(([name, value]) => (
          <div
            key={name}
            className="flex items-center gap-3 mb-3 bg-blue-50 p-3 rounded-xl shadow-inner hover:shadow-lg transition-shadow"
          >
            <span className="w-32 font-semibold truncate">{name}</span>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              className="border rounded p-2 flex-grow"
              value={value}
              onChange={(e) => handleBillChange(name, e.target.value)}
              placeholder="💵 Amount"
            />
            <button
              onClick={() => handleDeleteBill(name)}
              className="text-red-600 hover:text-red-800 font-bold px-2"
              title={`Delete ${name}`}
              aria-label={`Delete ${name}`}
            >
              ✖
            </button>
          </div>
        ))}

        {Object.keys(billTypes).length >= 20 && (
          <div className="text-red-600 text-sm mb-3">
            ⚠️ Max item limit (20) reached.
          </div>
        )}

        {/* Add new bill */}
        <div className="flex items-center gap-3 mt-2">
          <input
            type="text"
            placeholder="New bill name"
            className="border rounded p-2 flex-grow"
            value={newBillName}
            onChange={(e) => setNewBillName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddBill()}
          />
          <button
            className={`px-4 py-2 rounded text-white ${
              Object.keys(billTypes).length >= 20 || !newBillName.trim()
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition`}
            onClick={handleAddBill}
            disabled={Object.keys(billTypes).length >= 20 || !newBillName.trim()}
          >
            ➕ Add
          </button>
        </div>

        {/* Error & Success Messages */}
        {error && <p className="text-red-600 font-medium">{error}</p>}
        {successMsg && <p className="text-green-600 font-medium">{successMsg}</p>}

        {/* Total bills */}
        <div className="pt-4 border-t border-blue-200 text-right text-xl font-extrabold text-blue-800 drop-shadow-sm">
          Total Bills: 💵 {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 mt-6 rounded hover:bg-blue-700 transition"
        >
          💾 Save Bills
        </button>

        <p className="mt-6 text-center text-sm text-yellow-600">
          ⚠️ This data will reset monthly but stay visible in summary for 10 days after month end.
        </p>
      </div>
    </div>
  );
}
