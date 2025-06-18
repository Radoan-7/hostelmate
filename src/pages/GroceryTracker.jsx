import { useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../firebase";

const auth = getAuth(app);
const db = getFirestore(app);

function GroceryTracker() {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    try {
      await addDoc(collection(db, "groceries"), {
        item,
        quantity,
        boughtBy: user.uid,
        date: new Date().toISOString(),
      });
      alert("✅ Grocery item added!");
      setItem("");
      setQuantity("");
    } catch (error) {
      console.error("Error adding grocery:", error);
      alert("❌ Failed to add grocery item.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛒 Grocery Tracker</h2>
      <input
        type="text"
        placeholder="Item name"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit} style={{ marginTop: "1rem" }}>
        Submit
      </button>
    </div>
  );
}

export default GroceryTracker;