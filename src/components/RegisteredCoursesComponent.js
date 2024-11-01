// RegisteredCoursesComponent.js

"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { database, ref, get } from '@/firebase/config';
import Lottie from "lottie-react";
import animationData from "../public/Sub.json";

const RegisteredCoursesComponent = () => {
    const searchParams = useSearchParams();
    const username = atob(searchParams.get('username'));

    const [registeredCourses, setRegisteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRegisteredCourses() {
            try {
                const coursesRef = ref(database, `registered-courses/${username}`);
                const snapshot = await get(coursesRef);
                if (snapshot.exists()) {
                    const courses = snapshot.val();
                    const coursesWithType = [];

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
        return <p className="text-center text-[#6a5b4b] font-serif">Loading...</p>;
    }

    return (
        <div className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-center bg-[#fdf7e3] rounded-lg shadow-lg border border-[#c7b197]">
            {/* Left Side - Registered Courses Table */}
            <div className="flex-1 w-full md:mr-6">
                <h1 className="text-4xl font-serif mb-8 text-[#5b4636]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Registered Courses for {username}
                </h1>

                {registeredCourses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto bg-[#faf3e0] border border-[#c7b197] shadow-md rounded-md">
                            <thead className="bg-[#e5d4b0] border-b border-[#c9b79c]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-2xl font-serif font-bold text-[#5b4636]">Course Name</th>
                                    <th className="px-4 py-3 text-left text-2xl font-serif font-bold text-[#5b4636]">Course Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registeredCourses.map((course, index) => (
                                    <tr key={index} className="border-b border-[#c9b79c] hover:bg-[#f0e4c3] transition-all">
                                        <td className="px-4 py-3 text-lg font-serif text-[#1a73e8]">{course.name}</td>
                                        <td className="px-4 py-3 text-lg font-serif text-[#5b4636]">{course.type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-left text-lg font-serif text-[#5b4636]">No courses registered this semester.</p>
                )}
            </div>

            {/* Right Side - Lottie Animation */}
            <div className="flex-1 flex justify-center mt-8 md:mt-0">
                <Lottie
                    animationData={animationData}
                    loop={true}
                    className="w-3/4 md:w-1/2 h-auto object-cover"
                />
            </div>
        </div>
    );
};

export default RegisteredCoursesComponent;
