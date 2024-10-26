"use client";

import { useEffect, useState } from 'react';
import { database, ref, get, set, onValue } from '../firebase/config';
import { useSearchParams } from 'next/navigation';

const TeacherAttendance = () => {
    const searchParams = useSearchParams();
    const teacherUsername = searchParams.get('username'); // Get teacher username from URL params

    const [courses, setCourses] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('Semester 3');
    const [selectedCourse, setSelectedCourse] = useState("");
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});

    useEffect(() => {
        // Fetch courses taught by the teacher
        const fetchCourses = async () => {
            const semesterCoursesRef = ref(database, `semester-courses/${teacherUsername}`);
            onValue(semesterCoursesRef, (snapshot) => {
                if (snapshot.exists()) {
                    const coursesData = snapshot.val();
                    const allCourses = [];
                    Object.keys(coursesData).forEach(semester => {
                        const semesterCourses = coursesData[semester];
                        Object.keys(semesterCourses).forEach(courseName => {
                            allCourses.push({ courseName });
                        });
                    });
                    setCourses(allCourses);
                }
            });
        };
        fetchCourses();
    }, [teacherUsername]);

    const fetching = async (courseName) => {
        console.log("Course Name in fetching: ", courseName)
        try {
            const studentsRef = ref(database, `semester-courses/${teacherUsername}/${selectedSemester}/${courseName}`);
            const snapshot = await get(studentsRef);
            if (snapshot.exists()) {
                const students = snapshot.val();
                const studentsAvailable = Object.keys(students).filter(rollNo => students[rollNo] === 0);
                setStudents(studentsAvailable); // Set students allowed for grading
            }
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const handleCourseSelect = (course) => {
        console.log(course.courseName);
        const crs = course.courseName;
        setSelectedCourse(crs);
        setAttendance({});
        fetching(crs);
    };

    const markAttendance = async () => {
        try {
            // Get today's date in 'YYYY-MM-DD' format
            const today = new Date();
            const selectedDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
            // Reference to the attendance path
            const attendanceRef = ref(database, `attendance/${selectedCourse}/${selectedDate}`);
    
            // Loop through each student and set attendance
            students.forEach(async (student) => {
                const studentAttendanceRef = ref(database, `attendance/${selectedCourse}/${selectedDate}/${student}`);
                await set(studentAttendanceRef, {
                    isPresent: attendance[student] || false,
                    markedBy: teacherUsername,
                });
            });
    
            alert("Attendance marked successfully!");
        } catch (error) {
            console.error("Error marking attendance:", error);
        }
    };

    return (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>

            <div className="mb-6">
                <label className="block font-medium text-gray-700">Select Course</label>
                <select
                    className="w-full p-2 border border-gray-300 rounded shadow-sm"
                    onChange={(e) => handleCourseSelect(courses[e.target.value])}
                >
                    <option value="">Select a course</option>
                    {courses.map((course, index) => (
                        <option key={index} value={index}>
                            {course.courseName}
                        </option>
                    ))}
                </select>
            </div>

            {students.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Mark Attendance for {selectedCourse}</h3>

                    <ul className="list-disc list-inside mb-4">
                        {students.map((student) => (
                            <li key={student} className="flex items-center mb-4">
                                <label className="mr-2 text-gray-800">{student}</label>
                                <input
                                    type="checkbox"
                                    checked={attendance[student] || false}
                                    onChange={(e) =>
                                        setAttendance({ ...attendance, [student]: e.target.checked })
                                    }
                                    className="form-checkbox h-4 w-4 text-blue-600"
                                />
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={markAttendance}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Submit Attendance
                    </button>
                </div>
            )}
        </div>
    );
};

export default TeacherAttendance;
