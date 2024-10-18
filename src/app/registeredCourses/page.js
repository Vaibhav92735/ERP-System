"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { database, ref, get } from '@/firebase/config'; // Import Firebase functions
import Header from '@/components/Header';
import Menu from '@/components/Menu';
import NavbarComp from '@/components/Navbar';

const RegisteredCoursesPageContent = () => {
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
        <div className="relative h-screen w-full bg-parchment bg-no-repeat bg-cover">
            <Header />
            <NavbarComp />
            <div className="p-8 h-full flex flex-col items-center justify-center">
                <h1 className="text-5xl font-serif text-center mb-10 text-brown-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Registered Courses for {username}
                </h1>

                {registeredCourses.length > 0 ? (
                    <ul className="list-none w-3/4 max-w-3xl">
                        {registeredCourses.map((course) => (
                            <li key={course.name} className="mb-6 p-6 bg-[#faf3e0] border border-[#c9b79c] rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-2xl">
                                <p className="text-2xl font-serif font-semibold mb-2 text-[#5b4636]">Course Name: <span className="text-[#1a73e8]">{course.name}</span></p>
                                <p className="text-lg text-[#5b4636]">Course Type: {course.type}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-lg text-[#5b4636]">No courses registered this semester.</p>
                )}
            </div>
        </div>
    );
};

const RegisteredCoursesPage = () => {
    return (
        <div className="relative h-screen bg-[#f9f6e8] w-full bg-parchment bg-no-repeat bg-cover">
            {/* <Header />
            <Menu /> */}
            <Suspense fallback={<div>Loading page...</div>}>
                <RegisteredCoursesPageContent />
            </Suspense>
        </div>
    );
};

export default RegisteredCoursesPage;