import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";

const db = getFirestore(app);
const auth = getAuth(app);

function Bills() {
  const [rent, setRent] = useState("");
  const [electricity, setElectricity] = useState("");
  const [internet, setInternet] = useState("");

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");

    try {
      await addDoc(collection(db, "bills"), {
        rent,
        electricity,
        internet,
        user: user.uid,
        date: new Date().toISOString(),
      });
      alert("✅ Bill added!");
      setRent("");
      setElectricity("");
      setInternet("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save bills.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🏠 Bills & Utilities</h2>
      <input
        placeholder="Rent"
        value={rent}
        onChange={(e) => setRent(e.target.value)}
      />
      <br />
      <input
        placeholder="Electricity Bill"
        value={electricity}
        onChange={(e) => setElectricity(e.target.value)}
      />
      <br />
      <input
        placeholder="Internet Bill"
        value={internet}
        onChange={(e) => setInternet(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit} style={{ marginTop: "1rem" }}>
        Submit
      </button>
    </div>
  );
}

export default Bills;