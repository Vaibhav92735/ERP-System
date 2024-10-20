"use client"; // Ensure client-side rendering

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ref, get, database } from "../../firebase/config";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NavbarComp from "@/components/Navbar";

const SubjectsPageContent = () => {
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
    return <p className="text-center text-gray-500 font-serif">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 font-serif">{error}</p>;
  }

  return (
    <div className="relative h-screen bg-[#f9f6e8] w-full bg-parchment bg-no-repeat bg-cover">
      
      <Header />
      <NavbarComp />
    <div className="min-h-screen bg-[#f9f6e8] p-8 flex flex-col items-center">
      <div className="max-w-5xl w-full bg-[#faf4d3] border border-[#d9c6a3] rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold font-serif text-brown-800 text-center mb-8">Subjects and Grades</h1>
        
        {Object.entries(subjectsData).map(([semester, { subjects, sgpa }]) => (
          <div key={semester} className="mb-8 p-6 bg-[#f5f1d1] border border-[#d9c6a3] rounded-lg shadow-md">
            <h2 className="text-xl font-semibold font-serif text-brown-800 mb-4">{semester}</h2>
            <table className="min-w-full table-fixed text-sm">
              <thead className="border-b border-[#d9c6a3]">
                <tr>
                  <th className="text-left py-2 px-4 font-semibold font-serif">Subject</th>
                  <th className="text-left py-2 px-4 font-semibold font-serif">Grade</th>
                  <th className="text-left py-2 px-4 font-semibold font-serif">Credits</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subjectDetail, idx) => (
                  <tr key={idx} className="border-b border-[#d9c6a3]">
                    <td className="py-2 px-4 font-serif">{subjectDetail.subject}</td>
                    <td className="py-2 px-4 font-serif">{subjectDetail.grade}</td>
                    <td className="py-2 px-4 font-serif">{subjectDetail.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-right font-serif mt-4">SGPA: <span className="font-semibold">{sgpa}</span></p>
          </div>
        ))}

        <div className="mt-6 p-6 bg-[#e8e0c1] border border-[#d9c6a3] rounded-lg shadow-md">
          <h2 className="text-xl font-semibold font-serif text-brown-800">Overall CGPA</h2>
          <p className="text-3xl font-bold text-brown-800 text-right">{cgpa}</p>
        </div>
      </div>
    </div>
        <Footer />
    </div>
  );
};

const SubjectsPage = () => {
  return (
      <div className="relative h-screen bg-[#f9f6e8] w-full bg-parchment bg-no-repeat bg-cover">
          <Suspense fallback={<div>Loading page...</div>}>
              <SubjectsPageContent />
          </Suspense>
      </div>
  );
};

export default SubjectsPage;
