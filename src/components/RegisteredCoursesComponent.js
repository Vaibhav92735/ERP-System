// RegisteredCoursesComponent.js

"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { database, ref, get } from '@/firebase/config'; // Import Firebase functions
import Lottie from "lottie-react";
import animationData from "../public/Sub.json";

const RegisteredCoursesComponent = () => {
    const searchParams = useSearchParams();
    const username = searchParams.get('username'); // Get username from URL params

    const [registeredCourses, setRegisteredCourses] = useState([]); // To store registered courses
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch registered courses and their types
    useEffect(() => {
        async function fetchRegisteredCourses() {
            try {
                // Fetch the registered courses for the student
                const coursesRef = ref(database, `registered-courses/${username}`);
                const snapshot = await get(coursesRef);
                if (snapshot.exists()) {
                    const courses = snapshot.val();
                    const coursesWithType = [];

                    // Fetch course type for each registered course
                    for (const courseName of Object.keys(courses)) {
                        const courseTypeRef = ref(database, `courses/${courseName}/Course_Type`);
                        const courseTypeSnapshot = await get(courseTypeRef);

                        if (courseTypeSnapshot.exists()) {
                            coursesWithType.push({
                                name: courseName,
                                type: courseTypeSnapshot.val(),
                            });
                        }
                    }

                    // Set the registered courses with their types
                    setRegisteredCourses(coursesWithType);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching registered courses:", error);
                setLoading(false);
            }
        }

        fetchRegisteredCourses();
    }, [username]);

    if (loading) {
        return <p className="text-center text-gray-600">Loading...</p>;
    }

    return (
        <div className="p-8 flex flex-row items-center justify-center ">
            {/* Left Side - Registered Courses Table */}
            <div className="flex-1">
                <h1 className="text-4xl font-serif text-left mb-10 text-[#5b4636]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Registered Courses for {username}
                </h1>

                {registeredCourses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto bg-[#faf3e0] border border-[#c9b79c] shadow-lg rounded-lg">
                            <thead className="bg-[#e5d4b0]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-2xl font-serif font-semibold text-[#5b4636]">Course Name</th>
                                    <th className="px-6 py-3 text-left text-2xl font-serif font-semibold text-[#5b4636]">Course Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registeredCourses.map((course, index) => (
                                    <tr key={index} className="border-b border-[#c9b79c] hover:bg-[#f0e4c3] transition-all">
                                        <td className="px-6 py-4 text-lg font-serif text-[#1a73e8]">{course.name}</td>
                                        <td className="px-6 py-4 text-lg font-serif text-[#5b4636]">{course.type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-left text-lg text-[#5b4636]">No courses registered this semester.</p>
                )}
            </div>

            {/* Right Side - Lottie Animation */}
            <div className="flex-1 flex justify-center">
                <Lottie
                    animationData={animationData}
                    loop={true}
                    className="w-1/2 h-3/4 object-cover"
                />
            </div>
        </div>
    );
};

export default RegisteredCoursesComponent;
