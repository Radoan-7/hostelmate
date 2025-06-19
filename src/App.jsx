import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
//import MealTracker from "./pages/MealTracker";
//import GroceryTracker from "./pages/GroceryTracker";
import Bills from "./pages/Bills";
//import Summary from './pages/Summary';
import BillTracker from "./pages/BillTracker";
import BursaryTracker from "./pages/BursaryTracker";
import MealTracker from "./pages/MealTracker";
import Summary from "./pages/Summary";
import AboutMe from "./pages/AboutMe";
import MealCostCalculator from "./pages/MealCostCalculator";
import DutyScheduler from "./pages/DutyScheduler";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        
        <Route path="/bills" element={<Bills />} />
        
        <Route path="/bill-tracker" element={<BillTracker />} />
        <Route path="/bursary-tracker" element={<BursaryTracker />} />
        <Route path="/meal-tracker" element={<MealTracker />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/about" element={<AboutMe />} />
        <Route path="/duty-scheduler" element={<DutyScheduler />} />
        
<Route path="/meal-cost" element={<MealCostCalculator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;