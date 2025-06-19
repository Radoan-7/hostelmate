import React, { useState } from "react";

const defaultSchedule = {
  Monday: "Not Assigned",
  Tuesday: "Not Assigned",
  Wednesday: "Not Assigned",
  Thursday: "Not Assigned",
  Friday: "Not Assigned",
  Saturday: "Not Assigned",
  Sunday: "Not Assigned",
};

export default function DutyScheduler() {
  const [schedule, setSchedule] = useState(defaultSchedule);

  const handleChange = (day, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-sky-50 p-6 text-gray-800 font-rubik">
      <h2 className="text-3xl font-bold text-center mb-6">🗓️ Duty Scheduler</h2>

      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg space-y-4">
        {Object.entries(schedule).map(([day, name]) => (
          <div key={day} className="flex items-center justify-between">
            <span className="font-semibold w-24">{day}:</span>
            <input
              type="text"
              className="border rounded p-2 w-64"
              value={name}
              onChange={(e) => handleChange(day, e.target.value)}
              placeholder="Enter name"
            />
          </div>
        ))}
        <p className="text-sm text-center text-gray-500 pt-4">
          ✏️ This is a static schedule for now. Updates aren't saved permanently.
        </p>
      </div>
    </div>
  );
}