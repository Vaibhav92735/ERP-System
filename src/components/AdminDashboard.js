"use client";

import { useState } from "react";
import StudentPage from "./StudentPage";
import TeachersPage from "./TeachersPage";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("students");

  return (
    <div className="bg-[#f4e7d1] p-8 font-serif text-gray-800">
      {/* Outer container with decorative border and shadow for vintage look */}
      <div className="mx-auto border border-[#d1b18b] shadow-lg rounded-md bg-[#fdf5e6] p-6">
        {/* Header */}
        <h1 className="text-center text-2xl font-bold text-[#6b4226] mb-6">Admin Dashboard</h1>

        {/* Tab navigation styled as antique buttons */}
        <nav className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setActiveTab("students")}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === "students"
                ? "bg-[#d1b18b] text-white"
                : "bg-[#f4e7d1] hover:bg-[#e2c2a2]"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab("teachers")}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === "teachers"
                ? "bg-[#d1b18b] text-white"
                : "bg-[#f4e7d1] hover:bg-[#e2c2a2]"
            }`}
          >
            Teachers
          </button>
        </nav>

        {/* Content area */}
        <div className="bg-[#faf3e2] rounded-lg shadow-inner border border-[#d1b18b]">
          {activeTab === "students" && <StudentPage />}
          {activeTab === "teachers" && <TeachersPage />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
