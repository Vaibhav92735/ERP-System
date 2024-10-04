"use client"; // Ensure client-side rendering

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ref, get, update, push } from "firebase/database";
import TeachersMenu from "@/components/TeachersMenu";
import Header from "@/components/Header";
import { database } from "../../firebase/config"; // Importing Firebase config

const CoursesPage = () => {
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
    <div className="min-h-screen bg-gray-50 p-6">
        <Header />
        <TeachersMenu />
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Courses</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Add New Course</h2>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            placeholder="Enter course name"
            className="p-2 border rounded-md w-full"
          />
          <button
            onClick={addCourse}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Add Course
          </button>
        </div>
      </div>

      {Object.keys(courses).map((course) => {
        const { parameterAverages, overallAvgRating } = calculateAverageRating(courses[course]);
        return (
          <div key={course} className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">{course}</h2>
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Parameter
                  </th>
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Average Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(parameterAverages).map(([parameter, avgRating], idx) => (
                  <tr key={idx} className="bg-white hover:bg-gray-50">
                    <td className="border px-4 py-2 text-sm text-gray-700">{parameter}</td>
                    <td className="border px-4 py-2 text-sm text-gray-700">{avgRating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-gray-800 font-semibold mt-4">Overall Average Rating: {overallAvgRating}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CoursesPage;
