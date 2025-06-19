import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function MealTracker() {
  const [user, setUser] = useState(null);
  const [count, setCount] = useState("");
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) {
        fetchMeals(u.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMeals = async (uid) => {
    const q = query(collection(db, "meals"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const todayMeals = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.date === today) {
        todayMeals.push({ id: doc.id, ...data });
      }
    });
    setMeals(todayMeals);
  };

  const handleSave = async () => {
    setError("");
    if (!user) {
      setError("User not authenticated.");
      return;
    }
    if (count === "" || count < 0 || isNaN(count)) {
      setError("Please enter a valid non-negative meal count.");
      return;
    }
    try {
      await addDoc(collection(db, "meals"), {
        uid: user.uid,
        count: Number(count),
        date: today,
        recordMonth: today.slice(0, 7),
      });
      setSuccessMsg("Meal saved successfully!");
      setCount("");
      fetchMeals(user.uid);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      setError("Failed to save meal. Try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meal entry?")) return;
    try {
      await deleteDoc(doc(db, "meals", id));
      fetchMeals(user.uid);
    } catch {
      alert("Failed to delete meal.");
    }
  };

  // Total meals count today
  const totalMeals = meals.reduce((sum, meal) => sum + Number(meal.count), 0);

  return (
    <div className="min-h-screen bg-blue-50 p-6 text-blue-900 font-rubik">
      <h2 className="text-3xl font-bold mb-6 text-center">🍽️ Meal Tracker</h2>

      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg space-y-5">
        {/* Input and Save */}
        <div className="flex items-center gap-4">
          <label htmlFor="mealCount" className="font-medium whitespace-nowrap">
            Today's Meals:
          </label>
          <input
            id="mealCount"
            type="number"
            min="0"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="border rounded p-2 w-24"
          />
          <button
            onClick={handleSave}
            disabled={count === "" || count < 0}
            className={`px-4 py-2 rounded text-white ${
              count === "" || count < 0
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            💾 Save
          </button>
        </div>

        {/* Messages */}
        {error && <p className="text-red-600 font-medium">{error}</p>}
        {successMsg && <p className="text-green-600 font-medium">{successMsg}</p>}

        {/* Meals list */}
        <div>
          <h3 className="font-semibold mb-3 flex justify-between items-center">
            📆 Meals Logged for Today
            <span className="text-sm text-gray-500">Total: {totalMeals}</span>
          </h3>
          {meals.length === 0 ? (
            <p className="text-gray-500">No meals recorded for today yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200 max-h-80 overflow-auto">
              {meals.map((meal) => (
                <li
                  key={meal.id}
                  className="flex justify-between items-center py-2 text-blue-800 hover:bg-blue-100 rounded transition"
                >
                  <span>
                    {meal.date} — {meal.count} meal{meal.count !== 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={() => handleDelete(meal.id)}
                    className="text-red-600 hover:text-red-800 font-bold px-2"
                    aria-label="Delete meal entry"
                    title="Delete"
                  >
                    ✖
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          ⚠️ This data will reset monthly but stay visible in summary for 10 days after month end.
        </p>
      </div>
    </div>
  );
}
