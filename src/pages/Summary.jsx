import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function Summary() {
  const [meals, setMeals] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const mealSnapshot = await getDocs(collection(db, "meals"));
      const grocerySnapshot = await getDocs(collection(db, "groceries"));
      const billSnapshot = await getDocs(collection(db, "bills"));

      setMeals(mealSnapshot.docs.map(doc => doc.data()));
      setGroceries(grocerySnapshot.docs.map(doc => doc.data()));
      setBills(billSnapshot.docs.map(doc => doc.data()));
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📅 Monthly Summary</h2>

      <h3>🍽️ Meals</h3>
      {meals.map((m, i) => (
        <div key={i}>{m.date?.split("T")[0]} - {m.count} meals</div>
      ))}

      <h3>🛒 Groceries</h3>
      {groceries.map((g, i) => (
        <div key={i}>{g.date?.split("T")[0]} - {g.item} ({g.quantity})</div>
      ))}

      <h3>💡 Bills</h3>
      {bills.map((b, i) => (
        <div key={i} style={{ marginBottom: "1rem" }}>
          {b.bills?.map((entry, j) => (
            <div key={j}>
              {entry.name}: {entry.amount}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Summary;