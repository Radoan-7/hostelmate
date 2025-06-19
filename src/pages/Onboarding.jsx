import { useEffect } from "react";

export default function Onboarding({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Wait 3 seconds before navigating
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-blue-950 text-white flex flex-col justify-center items-center font-[Rubik] p-6">
      <h1 className="text-4xl font-bold mb-4">👋 Welcome to HostelMate!</h1>
      <p className="text-center max-w-md text-lg">
        The ultimate hostel life manager for tracking meals, expenses, and bills.
      </p>
      <p className="text-sm mt-6 text-gray-300">Loading dashboard...</p>
    </div>
  );
}