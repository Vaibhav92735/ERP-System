"use client";

import { useState } from "react";
import StudentPage from "./StudentPage";
import TeachersPage from "./TeachersPage";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("students");

  return (
    <div style={{ backgroundColor: "#f4e7d1", padding: "20px", fontFamily: "serif" }}>
      <nav>
        <button onClick={() => setActiveTab("students")}>Students</button>
        <button onClick={() => setActiveTab("teachers")}>Teachers</button>
      </nav>

      <div style={{ marginTop: "20px" }}>
        {activeTab === "students" && <StudentPage />}
        {activeTab === "teachers" && <TeachersPage />}
      </div>
    </div>
  );
};

export default AdminDashboard;
