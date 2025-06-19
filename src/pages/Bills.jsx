import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";

const db = getFirestore(app);
const auth = getAuth(app);

function Bills() {
  const [bills, setBills] = useState([{ name: "", amount: "" }]);

  const handleChange = (index, field, value) => {
    const updated = [...bills];
    updated[index][field] = value;
    setBills(updated);
  };

  const addBillField = () => {
    setBills([...bills, { name: "", amount: "" }]);
  };

  const removeBillField = (index) => {
    const updated = [...bills];
    updated.splice(index, 1);
    setBills(updated);
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Login required");

    try {
      await addDoc(collection(db, "bills"), {
        user: user.uid,
        bills: bills.filter((b) => b.name && b.amount),
        date: new Date().toISOString(),
      });
      alert("✅ Bills submitted!");
      setBills([{ name: "", amount: "" }]);
    } catch (err) {
      console.error(err);
      alert("❌ Error saving bills.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📋 Add Custom Bills</h2>
      {bills.map((bill, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <input
            placeholder="Bill Name (e.g. Water)"
            value={bill.name}
            onChange={(e) => handleChange(i, "name", e.target.value)}
            style={{ marginRight: "5px" }}
          />
          <input
            placeholder="Amount"
            value={bill.amount}
            onChange={(e) => handleChange(i, "amount", e.target.value)}
            style={{ marginRight: "5px" }}
          />
          {bills.length > 1 && (
            <button onClick={() => removeBillField(i)}>❌</button>
          )}
        </div>
      ))}

      <button onClick={addBillField}>➕ Add Another Bill</button>
      <br /><br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Bills;