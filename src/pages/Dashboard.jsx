import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const getInitials = (email) => {
    if (!email) return "";
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-white text-blue-900 p-6 font-[Rubik]">
      <div className="max-w-2xl mx-auto p-6">

        {/* Logo, Title and Profile */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏠</span>
            <h1 className="text-4xl font-bold">HostelMate</h1>
          </div>

          {user && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                {getInitials(user.email)}
              </div>
              <span className="text-sm">{user.email}</span>
            </div>
          )}
        </div>

        {/* Subtitle */}
        <p className="text-center text-gray-600 mb-8">
          Manage your hostel life with ease — meals, bills, bursary & more.
        </p>

        {/* Feature Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button onClick={() => navigate("/meal-tracker")} className="bg-blue-500 hover:bg-blue-600 hover:scale-105 hover:shadow-lg transform transition-all duration-300 ease-in-out text-white py-3 rounded-lg text-lg">
            🍽️ Meal Tracker
          </button>
          <button onClick={() => navigate("/bursary-tracker")} className="bg-blue-500 hover:bg-blue-600 hover:scale-105 hover:shadow-lg transform transition-all duration-300 ease-in-out text-white py-3 rounded-lg text-lg">
            💸 Bursary Tracker
          </button>
          <button onClick={() => navigate("/bill-tracker")} className="bg-blue-500 hover:bg-blue-600 hover:scale-105 hover:shadow-lg transform transition-all duration-300 ease-in-out text-white py-3 rounded-lg text-lg">
            🧾 Bill Tracker
          </button>
          <button onClick={() => navigate("/summary")} className="bg-blue-500 hover:bg-blue-600 hover:scale-105 hover:shadow-lg transform transition-all duration-300 ease-in-out text-white py-3 rounded-lg text-lg">
            📊 Summary
          </button>
          <button onClick={() => navigate("/meal-cost")} className="bg-blue-500 hover:bg-blue-600 hover:scale-105 hover:shadow-lg transform transition-all duration-300 ease-in-out text-white py-3 rounded-lg text-lg">
            🧮 Meal Cost
          </button>
        </div>

        {/* New Features Message */}
        <div className="text-center mb-4 text-sm text-yellow-600 font-medium">
          🚧 New features coming soon!
        </div>

        {/* Logout Button */}
        <div className="text-center mb-4">
          <button onClick={handleLogout} className="bg-blue-500 hover:bg-blue-600 hover:scale-105 hover:shadow-lg transform transition-all duration-300 ease-in-out text-white py-3 rounded-lg text-lg">
            🚪 Logout
          </button>
        </div>

        {/* About Me Button */}
        <div className="text-center mb-6">
          <button onClick={() => navigate("/about")} className="bg-blue-500 hover:bg-blue-600 hover:scale-105 hover:shadow-lg transform transition-all duration-300 ease-in-out text-white py-3 rounded-lg text-lg">
            ℹ️ About Me
          </button>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 border-t pt-4">
          👤 Created by Radoan • Bangladesh • 2025
        </footer>
      </div>
    </div>
  );
}     