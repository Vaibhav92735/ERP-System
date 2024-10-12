"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { database, ref, get, update, remove, set } from '@/firebase/config'; // Import Firebase functions
import Header from '@/components/Header';
import TeachersMenu from '@/components/TeachersMenu';

const GradingPage = () => {
    const searchParams = useSearchParams();
    const teacherID = searchParams.get('username'); // Get teacher ID from URL params

    const [semesters, setSemesters] = useState([]); // To store semesters
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [courses, setCourses] = useState([]); // To store courses for the selected semester
    const [studentsToGrade, setStudentsToGrade] = useState([]); // Students allowed for grading
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [grade, setGrade] = useState(''); // Grade input

    // Fetch available semesters for the teacher
    useEffect(() => {
        async function fetchSemesters() {
            try {
                const semesterRef = ref(database, `semester-courses/${teacherID}`);
                const snapshot = await get(semesterRef);
                if (snapshot.exists()) {
                    setSemesters(Object.keys(snapshot.val())); // Set semester numbers
                }
            } catch (error) {
                console.error("Error fetching semesters:", error);
            }
        }
        fetchSemesters();
    }, [teacherID]);

    // Fetch courses for the selected semester
    const fetchCourses = async (semesterNo) => {
        setSelectedSemester(semesterNo);
        try {
            const courseRef = ref(database, `semester-courses/${teacherID}/${semesterNo}`);
            const snapshot = await get(courseRef);
            if (snapshot.exists()) {
                setCourses(Object.keys(snapshot.val())); // Set courses for the semester
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    // Fetch students who are allowed for grading for the selected course
    const fetchStudentsToGrade = async (courseName) => {
        setSelectedCourse(courseName);
        try {
            const studentsRef = ref(database, `semester-courses/${teacherID}/${selectedSemester}/${courseName}`);
            const snapshot = await get(studentsRef);
            if (snapshot.exists()) {
                const students = snapshot.val();
                // Filter students who can be graded (where value is 0)
                const studentsToGrade = Object.keys(students).filter(rollNo => students[rollNo] === 0);
                setStudentsToGrade(studentsToGrade); // Set students allowed for grading
            }
        } catch (error) {
            console.error("Error fetching students to grade:", error);
        }
    };

    // Handle grading a student
    const handleGradeStudent = async (rollNo) => {
        try {
            // Update semester-courses to set graded (value 1)
            const gradeRef = ref(database, `semester-courses/${teacherID}/${selectedSemester}/${selectedCourse}/${rollNo}`);
            await set(gradeRef, 1);

            // Remove student from registered-courses
            const registeredRef = ref(database, `registered-courses/${rollNo}/${selectedCourse}`);
            await remove(registeredRef);

            // Set the grade in grades/{Roll_No}/{semester_no}/{course_name}
            const studentGradeRef = ref(database, `grades/${rollNo}/${selectedSemester}/${selectedCourse}`);
            await set(studentGradeRef, grade);

            alert(`Graded student ${rollNo} successfully!`);
        } catch (error) {
            console.error("Error grading student:", error);
        }
    };

    return (
        <div className="grading-page p-6 bg-gray-50 border border-gray-300 rounded-lg shadow-lg" style={{ fontFamily: 'Georgia, serif', lineHeight: '1.6' }}>
            <Header />
            <TeachersMenu />
            <h1 className="text-2xl font-bold mb-4 text-center" style={{ textDecoration: 'underline' }}>
                Grading Page for Teacher: {teacherID}
            </h1>

            {/* Select Semester */}
            <div className="mb-6">
                <label className="block font-medium text-gray-700">Select Semester:</label>
                <select
                    value={selectedSemester || ""}
                    onChange={(e) => fetchCourses(e.target.value)}
                    className="mt-2 p-2 border border-gray-400 rounded shadow-sm"
                >
                    <option value="" disabled>Select Semester</option>
                    {semesters.map((semester) => (
                        <option key={semester} value={semester}>{semester}</option>
                    ))}
                </select>
            </div>

            {/* Select Course */}
            {selectedSemester && courses.length > 0 && (
                <div className="mb-6">
                    <label className="block font-medium text-gray-700">Select Course:</label>
                    <select
                        value={selectedCourse || ""}
                        onChange={(e) => fetchStudentsToGrade(e.target.value)}
                        className="mt-2 p-2 border border-gray-400 rounded shadow-sm"
                    >
                        <option value="" disabled>Select Course</option>
                        {courses.map((course) => (
                            <option key={course} value={course}>{course}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* List Students to Grade */}
            {selectedCourse && studentsToGrade.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Students to Grade:</h2>
                    {studentsToGrade.map((rollNo) => (
                        <div key={rollNo} className="mb-4 p-3 border border-gray-300 rounded bg-white shadow-sm">
                            <label className="block text-gray-700">Student Roll No: {rollNo}</label>
                            <input
                                type="text"
                                placeholder="Enter Grade"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                className="p-2 border border-gray-400 rounded mt-2 w-full"
                            />
                            <button
                                onClick={() => handleGradeStudent(rollNo)}
                                className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            >
                                Submit Grade
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* No students to grade */}
            {selectedCourse && studentsToGrade.length === 0 && (
                <p className="text-gray-600">No students to grade for this course.</p>
            )}
        </div>
    );
};

export default GradingPage;
