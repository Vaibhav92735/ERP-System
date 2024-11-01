"use client";

import { useState, useEffect } from 'react';
import { database, ref, onValue } from '@/firebase/config';

const AcademicTracking = () => {
    const [gradesData, setGradesData] = useState({});
    const [selectedSemester, setSelectedSemester] = useState('Semester 1');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [availableCourses, setAvailableCourses] = useState([]);
    const [gradeDistribution, setGradeDistribution] = useState({});
    const [studentGrades, setStudentGrades] = useState([]);
    const [averageGrade, setAverageGrade] = useState(0);

    useEffect(() => {
        fetchGradesData();
    }, []);

    useEffect(() => {
        // Update course list when semester changes
        if (gradesData && selectedSemester) {
            const courses = new Set();
            Object.values(gradesData).forEach(studentData => {
                if (studentData[selectedSemester]) {
                    Object.keys(studentData[selectedSemester]).forEach(course => courses.add(course));
                }
            });
            setAvailableCourses(Array.from(courses));
            setSelectedCourse(''); // Reset course when semester changes
        }
    }, [gradesData, selectedSemester]);

    useEffect(() => {
        // Recalculate grade distribution and student grades whenever the selected course or semester changes
        if (selectedCourse && selectedSemester) {
            calculateGradeDistribution();
            calculateStudentGrades();
        }
    }, [selectedCourse, selectedSemester, gradesData]);

    const fetchGradesData = () => {
        const gradesRef = ref(database, `grades`);
        onValue(gradesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setGradesData(data);
            }
        });
    };

    const calculateGradeDistribution = () => {
        const distribution = {};
        let totalGrades = 0;
        let gradeCount = 0;

        Object.keys(gradesData).forEach((studentRollNo) => {
            const semesters = gradesData[studentRollNo];
            if (semesters[selectedSemester] && semesters[selectedSemester][selectedCourse] !== undefined) {
                const grade = semesters[selectedSemester][selectedCourse];
                totalGrades += grade;
                gradeCount += 1;

                if (!distribution[grade]) {
                    distribution[grade] = 0;
                }
                distribution[grade] += 1;
            }
        });

        setGradeDistribution(distribution);
        setAverageGrade(gradeCount ? (totalGrades / gradeCount).toFixed(2) : 0);
    };

    const calculateStudentGrades = () => {
        const gradesList = [];
        Object.keys(gradesData).forEach((studentRollNo) => {
            const semesters = gradesData[studentRollNo];
            if (semesters[selectedSemester] && semesters[selectedSemester][selectedCourse] !== undefined) {
                gradesList.push({
                    rollNo: studentRollNo,
                    grade: semesters[selectedSemester][selectedCourse],
                });
            }
        });

        setStudentGrades(gradesList);
    };

    const handleCourseSelect = (e) => {
        setSelectedCourse(e.target.value);
    };

    return (
        <div className="p-8 bg-yellow-100 text-gray-800 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center">Academic Tracking</h2>

            <div className="flex gap-4 mb-8">
                <div className="flex flex-col w-1/2">
                    <label className="font-semibold mb-2">Select Semester</label>
                    <select
                        className="p-2 border rounded"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                    >
                        <option value="Semester 1">Semester 1</option>
                        <option value="Semester 2">Semester 2</option>
                        <option value="Semester 3">Semester 3</option>
                        <option value="Semester 4">Semester 4</option>
                        {/* Add more semesters as needed */}
                    </select>
                </div>

                <div className="flex flex-col w-1/2">
                    <label className="font-semibold mb-2">Select Course</label>
                    <select
                        className="p-2 border rounded"
                        value={selectedCourse}
                        onChange={handleCourseSelect}
                        disabled={!availableCourses.length}
                    >
                        <option value="">Select a course</option>
                        {availableCourses.map((course, index) => (
                            <option key={index} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Grade Distribution for {selectedCourse} - {selectedSemester}</h3>
                <div className="p-4 bg-white border rounded shadow">
                    {Object.keys(gradeDistribution).length === 0 ? (
                        <p>No data available for the selected course and semester.</p>
                    ) : (
                        <div>
                            {Object.entries(gradeDistribution).map(([grade, count]) => (
                                <p key={grade}>
                                    Grade {grade}: {count} student(s)
                                </p>
                            ))}
                            <p className="font-semibold mt-4">Average Grade: {averageGrade}</p>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Student Grades in {selectedCourse} - {selectedSemester}</h3>
                {studentGrades.length === 0 ? (
                    <p>No student grades found for the selected course.</p>
                ) : (
                    <table className="w-full text-left border-collapse bg-white shadow rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-4 border">Roll No</th>
                                <th className="p-4 border">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentGrades.map((student) => (
                                <tr key={student.rollNo} className="hover:bg-gray-100">
                                    <td className="p-4 border">{student.rollNo}</td>
                                    <td className="p-4 border">{student.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AcademicTracking;
