import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Summary() {
  const [user, setUser] = useState(null);
  const [mealTotal, setMealTotal] = useState(0);
  const [bursaryTotal, setBursaryTotal] = useState(0);
  const [billTotal, setBillTotal] = useState(0);

  // For animated counts
  const [animatedMeal, setAnimatedMeal] = useState(0);
  const [animatedBursary, setAnimatedBursary] = useState(0);
  const [animatedBill, setAnimatedBill] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        fetchSummaryData(u);
      }
    });
    return () => unsubscribe();
  }, []);

  const getValidMonths = () => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const date = now.getDate();
    const validMonths = [currentMonth];

    if (date <= 10) {
      const [year, month] = currentMonth.split("-").map(Number);
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      validMonths.push(`${prevYear}-${String(prevMonth).padStart(2, "0")}`);
    }

    return validMonths;
  };

  const fetchSummaryData = async (user) => {
    const validMonths = getValidMonths();
    let meals = 0,
      bursary = 0,
      bills = 0;

    const mealSnap = await getDocs(collection(db, "meals"));
    mealSnap.forEach((doc) => {
      const d = doc.data();
      if (d.uid === user.uid && validMonths.includes(d.recordMonth)) {
        meals += parseInt(d.count || 0);
      }
    });

    const bursarySnap = await getDocs(collection(db, "bursary"));
    bursarySnap.forEach((doc) => {
      const d = doc.data();
      if (d.uid === user.uid && validMonths.includes(d.recordMonth)) {
        bursary += parseFloat(d.amount || 0);
      }
    });

    const billsSnap = await getDocs(collection(db, "bills"));
    billsSnap.forEach((doc) => {
      const d = doc.data();
      if (d.uid === user.uid && validMonths.includes(d.recordMonth)) {
        Object.values(d.billTypes || {}).forEach((v) => {
          bills += parseFloat(v || 0);
        });
      }
    });

    setMealTotal(meals);
    setBursaryTotal(bursary);
    setBillTotal(bills);

    animateCount(meals, bursary, bills);
  };

  // Animate count up function
  const animateCount = (meals, bursary, bills) => {
    const duration = 1000; // 1 second
    const frameRate = 60;
    const totalFrames = Math.round((duration / 1000) * frameRate);

    let frame = 0;
    const mealIncrement = meals / totalFrames;
    const bursaryIncrement = bursary / totalFrames;
    const billIncrement = bills / totalFrames;

    const counter = setInterval(() => {
      frame++;
      setAnimatedMeal((prev) =>
        prev + mealIncrement > meals ? meals : prev + mealIncrement
      );
      setAnimatedBursary((prev) =>
        prev + bursaryIncrement > bursary ? bursary : prev + bursaryIncrement
      );
      setAnimatedBill((prev) =>
        prev + billIncrement > bills ? bills : prev + billIncrement
      );

      if (frame === totalFrames) clearInterval(counter);
    }, duration / totalFrames);
  };

  // Export summary data to CSV
  const exportToCSV = () => {
    const header = ["Category", "Amount"];
    const rows = [
      ["Total Meals", mealTotal],
      ["Total Bursary (BDT)", bursaryTotal.toFixed(2)],
      ["Total Bills (BDT)", billTotal.toFixed(2)],
      ["Total Spent (BDT)", (bursaryTotal + billTotal).toFixed(2)],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `HostelMate_Summary_${new Date().toISOString().slice(0, 7)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-blue-100 p-6 sm:p-8 text-blue-900 font-rubik">
      <h2 className="text-4xl font-extrabold mb-12 text-center tracking-wide drop-shadow-md">
        📊 Monthly Summary
      </h2>

      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-8 sm:p-10">
        {/* Meals */}
        <div
          className="flex items-center justify-between bg-blue-50 rounded-xl p-6 shadow-inner hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          title="Total meals taken"
        >
          <div className="flex items-center space-x-5">
            <span className="text-4xl select-none">🍽️</span>
            <div>
              <p className="text-lg font-semibold">Total Meals</p>
              <p className="text-sm text-gray-600">Count of meals taken</p>
            </div>
          </div>
          <p className="text-3xl font-bold tabular-nums">
            {Math.floor(animatedMeal)}
          </p>
        </div>

        {/* Bursary */}
        <div
          className="flex items-center justify-between bg-blue-50 rounded-xl p-6 shadow-inner hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          title="Total bursary amount"
        >
          <div className="flex items-center space-x-5">
            <span className="text-4xl select-none">💸</span>
            <div>
              <p className="text-lg font-semibold">Total Bursary</p>
              <p className="text-sm text-gray-600">Amount received</p>
            </div>
          </div>
          <p className="text-3xl font-bold tabular-nums">
            💵 {animatedBursary.toFixed(2)}
          </p>
        </div>

        {/* Bills */}
        <div
          className="flex items-center justify-between bg-blue-50 rounded-xl p-6 shadow-inner hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          title="Total bills expense"
        >
          <div className="flex items-center space-x-5">
            <span className="text-4xl select-none">🏠</span>
            <div>
              <p className="text-lg font-semibold">Total Bills</p>
              <p className="text-sm text-gray-600">Expenses on bills</p>
            </div>
          </div>
          <p className="text-3xl font-bold tabular-nums">
            💵 {animatedBill.toFixed(2)}
          </p>
        </div>

        {/* Total Spent */}
        <div className="pt-6 border-t border-blue-200 text-right text-2xl font-extrabold text-blue-800 drop-shadow-sm">
          Total Spent: 💵 {(animatedBursary + animatedBill).toFixed(2)}
        </div>

        {/* Export CSV Button */}
        <button
          onClick={exportToCSV}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          📥 Export Summary CSV
        </button>
      </div>
    </div>
  );
}
