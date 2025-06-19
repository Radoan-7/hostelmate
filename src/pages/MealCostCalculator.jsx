import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function MealCostCalculator() {
  const [user, setUser] = useState(null);
  const [mealCount, setMealCount] = useState(0);
  const [totalBursary, setTotalBursary] = useState(0);
  const [mealCost, setMealCost] = useState(0);
  const [totalMealCost, setTotalMealCost] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        calculateCost(u.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const calculateCost = async (uid) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    let totalMeals = 0;
    let totalBursaryAmount = 0;

    const mealsSnap = await getDocs(collection(db, "meals"));
    mealsSnap.forEach((doc) => {
      const data = doc.data();
      if (data.uid === uid && data.recordMonth === currentMonth) {
        totalMeals += parseInt(data.count || 0);
      }
    });

    const bursarySnap = await getDocs(collection(db, "bursary"));
    bursarySnap.forEach((doc) => {
      const data = doc.data();
      if (data.uid === uid && data.recordMonth === currentMonth) {
        totalBursaryAmount += parseFloat(data.amount || 0);
      }
    });

    const perMeal = totalMeals ? (totalBursaryAmount / totalMeals).toFixed(2) : 0;
    const totalCost = (perMeal * totalMeals).toFixed(2);

    setMealCount(totalMeals);
    setTotalBursary(totalBursaryAmount.toFixed(2));
    setMealCost(perMeal);
    setTotalMealCost(totalCost);
  };

  return (
    <div className="min-h-screen bg-sky-50 p-6 text-gray-800 font-rubik">
      <h2 className="text-3xl font-bold text-center mb-6">🍱 Meal Cost Calculator</h2>

      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg space-y-4">
        <p><strong>Total Meals:</strong> {mealCount}</p>
        <p><strong>Total Bursary:</strong> 💵 ${totalBursary}</p>
        <p><strong>Cost Per Meal:</strong> 💰 ${mealCost}</p>
        <p className="text-lg font-semibold border-t pt-4">
          📦 <strong>Total Meal Cost:</strong> ${totalMealCost}
        </p>

        <p className="mt-6 text-center text-sm text-gray-600">
          ⚠️ This data will reset monthly and won't be available after this month ends.
        </p>
      </div>
    </div>
  );
}