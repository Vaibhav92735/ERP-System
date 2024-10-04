"use client"; // Ensure client-side rendering

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ref, get, database } from "../../firebase/config";
import Menu from "@/components/Menu";
import Header from "@/components/Header";

const SubjectsPage = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get("username"); // Get username from URL

  const [subjectsData, setSubjectsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cgpa, setCgpa] = useState(0);

  useEffect(() => {
    const fetchSemesterData = async () => {
      try {
        const semestersRef = ref(database, `grades/${username}`);
        const snapshot = await get(semestersRef);
        if (snapshot.exists()) {
          const semesters = snapshot.val();
          let cumulativePoints = 0;
          let cumulativeCredits = 0;
          let updatedSubjectsData = {};
          
          for (const semester in semesters) {
            const semesterSubjects = semesters[semester];
            let semesterPoints = 0;
            let semesterCredits = 0;
            let subjectDetails = [];

            for (const subject in semesterSubjects) {
              const grade = semesterSubjects[subject];
              const creditsSnapshot = await get(ref(database, `courses/${subject}/Credits`));
              const credits = creditsSnapshot.exists() ? creditsSnapshot.val() : 0;

              // Calculate grade points (assuming a 10-point scale)
              const gradePoints = calculateGradePoints(grade) * credits;
              semesterPoints += gradePoints;
              semesterCredits += credits;

              subjectDetails.push({
                subject,
                grade,
                credits,
              });
            }

            const sgpa = semesterCredits ? (semesterPoints / semesterCredits).toFixed(2) : 0;
            updatedSubjectsData[semester] = { subjects: subjectDetails, sgpa };

            // Update cumulative values for CGPA
            cumulativePoints += semesterPoints;
            cumulativeCredits += semesterCredits;
          }

          // Calculate CGPA
          const finalCgpa = cumulativeCredits ? (cumulativePoints / cumulativeCredits).toFixed(2) : 0;
          setSubjectsData(updatedSubjectsData);
          setCgpa(finalCgpa);
        } else {
          setError("No subjects found.");
        }
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError("Error fetching subjects data.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchSemesterData();
    } else {
      setError("No username provided.");
      setLoading(false);
    }
  }, [username]);

  const calculateGradePoints = (grade) => {
    // Assuming a typical grading system (modify as per your grading system)
    const gradeMap = {
      'A': 10,
      'A-': 9,
      'B': 8,
      'B-': 7,
      'C': 6,
      'C-': 5,
      'D': 4,
      'F': 0
    };
    return gradeMap[grade] || 0;
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
        <Header />
        <Menu />
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Subjects and Grades</h1>
      {Object.entries(subjectsData).map(([semester, { subjects, sgpa }]) => (
        <div key={semester} className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">{semester}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Subject</th>
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Grade</th>
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Credits</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subjectDetail, idx) => (
                  <tr key={idx} className="bg-white hover:bg-gray-50">
                    <td className="border px-4 py-2 text-sm text-gray-700">{subjectDetail.subject}</td>
                    <td className="border px-4 py-2 text-sm text-gray-700">{subjectDetail.grade}</td>
                    <td className="border px-4 py-2 text-sm text-gray-700">{subjectDetail.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-800 font-semibold mt-4">SGPA: {sgpa}</p>
        </div>
      ))}
      <div className="bg-green-100 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700">Overall CGPA</h2>
        <p className="text-gray-800 font-semibold text-2xl">{cgpa}</p>
      </div>
    </div>
  );
};

export default SubjectsPage;
