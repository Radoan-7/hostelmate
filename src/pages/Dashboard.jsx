import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🏠 Welcome to HostelMate</h2>
      <p>This is your dashboard. We'll add meals, rent, and groceries soon.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}