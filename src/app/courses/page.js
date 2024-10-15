"use client"; // Ensure client-side rendering

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ref, get, update } from "firebase/database";
import TeachersMenu from "@/components/TeachersMenu";
import Header from "@/components/Header";
import { database } from "../../firebase/config"; // Importing Firebase config

const CoursesPageContent = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get("username"); // Get username from URL

  const [courses, setCourses] = useState({});
  const [newCourse, setNewCourse] = useState(""); // State to manage new course input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesRef = ref(database, `takes/${username}`);
        const snapshot = await get(coursesRef);

        if (snapshot.exists()) {
          setCourses(snapshot.val());
        } else {
          setError("No courses found.");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Error fetching courses data.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchCourses();
    } else {
      setError("No username provided.");
      setLoading(false);
    }
  }, [username]);

  // Function to calculate average rating for each course
  const calculateAverageRating = (courseData) => {
    let overallTotal = 0;
    let overallCount = 0;

    const parameterAverages = Object.keys(courseData).reduce((acc, parameter) => {
      const ratings = Object.values(courseData[parameter]);
      const totalRatings = ratings.reduce((sum, count, index) => sum + count * (index + 1), 0);
      const numOfStudents = ratings.reduce((sum, count) => sum + count, 0);

      const avgRating = numOfStudents ? (totalRatings / numOfStudents).toFixed(2) : 0;

      overallTotal += totalRatings;
      overallCount += numOfStudents;

      acc[parameter] = avgRating;
      return acc;
    }, {});

    const overallAvgRating = overallCount ? (overallTotal / overallCount).toFixed(2) : 0;

    return { parameterAverages, overallAvgRating };
  };

  // Function to add a new course
  const addCourse = async () => {
    if (!newCourse) return;

    const newCourseRef = ref(database, `takes/${username}/${newCourse}`);
    await update(newCourseRef, {
      "Teaching Quality": { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }, // Default parameters with ratings initialized
      "Course Content": { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    });

    setCourses((prevCourses) => ({
      ...prevCourses,
      [newCourse]: {
        "Teaching Quality": { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        "Course Content": { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    }));
    setNewCourse(""); // Reset the input field
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div>

        <Header />
      <div className="min-h-screen bg-[#f5f0e1] p-8 font-serif text-[#4b3e3e]">
        <TeachersMenu />
        <h1 className="text-5xl font-bold text-center mb-6">Courses</h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Add New Course</h2>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              placeholder="Enter course name"
              className="p-2 border border-[#bfb8a5] bg-[#f5f0e1] rounded-md w-full shadow-inner"
            />
            <button
              onClick={addCourse}
              className="bg-[#7b7061] text-white p-2 rounded-md hover:bg-[#6b5d48] transition duration-200"
            >
              Add Course
            </button>
          </div>
        </div>

        {Object.keys(courses).map((course) => {
          const { parameterAverages, overallAvgRating } = calculateAverageRating(courses[course]);
          return (
            <div key={course} className="bg-[#faf6f1] rounded-lg border border-[#bfb8a5] shadow-lg p-6 mb-8">
              <h2 className="text-3xl font-semibold mb-4 underline">{course}</h2>
              <table className="min-w-full table-auto border-collapse text-left">
                <thead>
                  <tr className="bg-[#eae0d5] text-lg">
                    <th className="border border-[#bfb8a5] px-4 py-2">Parameter</th>
                    <th className="border border-[#bfb8a5] px-4 py-2">Average Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(parameterAverages).map(([parameter, avgRating], idx) => (
                    <tr key={idx} className="bg-[#faf6f1] hover:bg-[#eae0d5] transition duration-150">
                      <td className="border border-[#bfb8a5] px-4 py-2">{parameter}</td>
                      <td className="border border-[#bfb8a5] px-4 py-2">{avgRating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-lg font-semibold mt-4">Overall Average Rating: {overallAvgRating}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CoursesPage = () => {
  return (
      <div className="relative h-screen bg-[#f9f6e8] w-full bg-parchment bg-no-repeat bg-cover">
          {/* <Header />
          <Menu /> */}
          <Suspense fallback={<div>Loading page...</div>}>
              <CoursesPageContent />
          </Suspense>
      </div>
  );
};

export default CoursesPage;