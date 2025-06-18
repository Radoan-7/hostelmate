import { useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../firebase"; // your firebase.js config

const auth = getAuth(app);
const db = getFirestore(app);

function MealTracker() {
  const [meals, setMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  const toggleMeal = (meal) => {
    setMeals((prev) => ({ ...prev, [meal]: !prev[meal] }));
  };

  const submitMeals = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const userId = user.uid;

    try {
      await setDoc(doc(db, "mealRecords", `${userId}_${today}`), {
        uid: userId,
        date: today,
        meals,
        timestamp: Date.now(),
      });

      alert("✅ Meals saved to Firestore!");
    } catch (error) {
      console.error("❌ Error saving meals:", error);
      alert("Failed to save meals.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🍽️ Track Today's Meals</h2>
      {["breakfast", "lunch", "dinner"].map((meal) => (
        <div key={meal}>
          <label>
            <input
              type="checkbox"
              checked={meals[meal]}
              onChange={() => toggleMeal(meal)}
            />
            {meal.charAt(0).toUpperCase() + meal.slice(1)}
          </label>
        </div>
      ))}
      <button onClick={submitMeals} style={{ marginTop: "1rem" }}>
        Submit
      </button>
    </div>
  );
}

export default MealTracker;