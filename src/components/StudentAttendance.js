"use client";

import { useEffect, useState } from 'react';
import { database, ref, onValue } from '@/firebase/config';
import { useSearchParams } from 'next/navigation';

const StudentAttendance = () => {
    const searchParams = useSearchParams();
    const studentUsername = searchParams.get('username'); // Get student username from URL params

    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [attendancePercentages, setAttendancePercentages] = useState({});

    useEffect(() => {
        const fetchAttendance = () => {
            const attendanceRef = ref(database, `course-attendance`);
            
            onValue(attendanceRef, (snapshot) => {
                if (snapshot.exists()) {
                    const attendanceData = snapshot.val();
                    const records = [];
                    const percentages = {};

                    // Process attendance data by course
                    Object.keys(attendanceData).forEach((courseName) => {
                        const courseDates = attendanceData[courseName];
                        let attended = 0;
                        let totalClasses = 0;

                        Object.keys(courseDates).forEach((date) => {
                            const students = courseDates[date];
                            if (students[studentUsername]) {
                                totalClasses++;
                                if (students[studentUsername].isPresent) {
                                    attended++;
                                }
                                records.push({
                                    courseName,
                                    date,
                                    isPresent: students[studentUsername].isPresent,
                                });
                            }
                        });

                        // Calculate percentage
                        percentages[courseName] = totalClasses ? (attended / totalClasses) * 100 : 0;
                    });

                    setAttendanceRecords(records);
                    setAttendancePercentages(percentages);
                }
            });
        };

        fetchAttendance();
    }, [studentUsername]);

    return (
        <div className="p-6 bg-parchment">
            <h2 className="text-2xl font-bold mb-4">Attendance History</h2>

            {Object.keys(attendancePercentages).map((courseName) => (
                <div key={courseName} className="mb-6">
                    <h3 className="text-xl font-semibold">{courseName}</h3>
                    <p>Attendance Percentage: {attendancePercentages[courseName].toFixed(2)}%</p>
                </div>
            ))}

            <h3 className="text-xl font-bold mb-4">Detailed Attendance Records</h3>
            {attendanceRecords.length === 0 ? (
                <p>No attendance records found.</p>
            ) : (
                <ul>
                    {attendanceRecords.map((record, index) => (
                        <li key={index} className="mb-4 p-4 border rounded">
                            <p><strong>Course:</strong> {record.courseName}</p>
                            <p><strong>Date:</strong> {record.date}</p>
                            <p><strong>Status:</strong> {record.isPresent ? 'Present' : 'Absent'}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StudentAttendance;
