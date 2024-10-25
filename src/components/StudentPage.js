import { useState } from "react";
import StudentProfile from "./features/StudentProfile";
import AcademicTracking from "./features/AcademicTracking";
import AttendanceLeave from "./features/AttendanceLeave";
import DisciplinaryRecords from "./features/DisciplinaryRecords";
import FeeManagement from "./features/FeeManagement";
import Communication from "./features/Communication";
import PerformanceAnalytics from "./features/PerformanceAnalytics";
import FeedbackGrievances from "./features/FeedbackGrievances";

const StudentPage = () => {
  const [selectedFeature, setSelectedFeature] = useState("profile");

  const handleSelectFeature = (feature) => {
    setSelectedFeature(feature);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Student Management Dashboard</h1>

      <div className="flex space-x-4 mb-8">
        <button onClick={() => handleSelectFeature("profile")}>Profile</button>
        <button onClick={() => handleSelectFeature("academic")}>Academic Tracking</button>
        <button onClick={() => handleSelectFeature("attendance")}>Attendance & Leave</button>
        <button onClick={() => handleSelectFeature("disciplinary")}>Disciplinary Records</button>
        <button onClick={() => handleSelectFeature("fees")}>Fees</button>
        <button onClick={() => handleSelectFeature("communication")}>Communication</button>
        <button onClick={() => handleSelectFeature("performance")}>Performance Analytics</button>
        <button onClick={() => handleSelectFeature("feedback")}>Feedback & Grievances</button>
      </div>

      <div className="p-4 rounded-lg shadow-md bg-white">
        {selectedFeature === "profile" && <StudentProfile />}
        {selectedFeature === "academic" && <AcademicTracking />}
        {selectedFeature === "attendance" && <AttendanceLeave />}
        {selectedFeature === "disciplinary" && <DisciplinaryRecords />}
        {selectedFeature === "fees" && <FeeManagement />}
        {selectedFeature === "communication" && <Communication />}
        {selectedFeature === "performance" && <PerformanceAnalytics />}
        {selectedFeature === "feedback" && <FeedbackGrievances />}
      </div>
    </div>
  );
};

export default StudentPage;
