"use client";

import { useEffect, useState } from 'react';
import { database, ref, get, set, onValue } from '@/firebase/config';
import { useSearchParams } from 'next/navigation';

const TeacherAttendance = () => {
    const searchParams = useSearchParams();
    const teacherUsername = searchParams.get('username'); // Get teacher username from URL params

    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
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
                            allCourses.push({ courseName, semester });
                        });
                    });
                    setCourses(allCourses);
                }
            });
        };
        fetchCourses();
    }, [teacherUsername]);

    // Fetch students registered in the selected course
    const fetchStudents = (courseName) => {
        const registeredStudentsRef = ref(database, `registered-courses`);
        onValue(registeredStudentsRef, (snapshot) => {
            if (snapshot.exists()) {
                const studentsData = snapshot.val();
                const courseStudents = [];
                Object.keys(studentsData).forEach(studentUsername => {
                    if (studentsData[studentUsername][courseName]) {
                        courseStudents.push(studentUsername);
                    }
                });
                setStudents(courseStudents);
            }
        });
    };

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        setAttendance({});
        fetchStudents(course.courseName);
    };

    const markAttendance = async () => {
        const date = new Date().toISOString().split('T')[0];
        const attendanceRef = ref(database, `course-attendance/${selectedCourse.courseName}/${date}`);
        
        students.forEach(async (student) => {
            const studentAttendanceRef = ref(attendanceRef, student);
            await set(studentAttendanceRef, {
                isPresent: attendance[student] || false,
                markedBy: teacherUsername,
                timestamp: Date.now(),
            });
        });
        
        alert("Attendance marked successfully!");
    };

    return (
        <div className="p-6 bg-parchment">
            <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>

            <div className="mb-6">
                <label className="block font-medium">Select Course</label>
                <select
                    className="w-full p-2 border rounded"
                    onChange={(e) => handleCourseSelect(courses[e.target.value])}
                >
                    <option value="">Select a course</option>
                    {courses.map((course, index) => (
                        <option key={index} value={index}>
                            {course.courseName} (Semester {course.semester})
                        </option>
                    ))}
                </select>
            </div>

            {students.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-xl font-semibold">Mark Attendance for {selectedCourse.courseName}</h3>
                    <ul>
                        {students.map((student) => (
                            <li key={student} className="flex items-center mb-4">
                                <label className="mr-2">{student}</label>
                                <input
                                    type="checkbox"
                                    checked={attendance[student] || false}
                                    onChange={(e) =>
                                        setAttendance({ ...attendance, [student]: e.target.checked })
                                    }
                                />
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={markAttendance}
                        className="bg-blue-500 text-white p-2 rounded mt-4"
                    >
                        Submit Attendance
                    </button>
                </div>
            )}
        </div>
    );
};

export default TeacherAttendance;
