import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MealTracker from "./pages/MealTracker"; // 🔥 NEW
import GroceryTracker from "./pages/GroceryTracker";
import Bills from "./pages/Bills";
import Summary from './pages/Summary';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meals" element={<MealTracker />} /> {/* NEW */}
        <Route path="/grocery" element={<GroceryTracker />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;