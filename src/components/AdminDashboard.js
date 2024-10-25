"use client";

import { useState } from "react";
import StudentPage from "./StudentPage";

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
        {activeTab === "teachers" && <TeacherPage />}
      </div>
    </div>
  );
};

const TeacherPage = () => {
  return <h2>Manage Teachers</h2>;  // Add your teacher management features here
};

export default AdminDashboard;
