"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { database, ref, get, set } from '@/firebase/config';
import Lottie from 'lottie-react';
import animationData from "../public/Feedback.json"

const FeedbackPageContent = () => {
    const searchParams = useSearchParams();
    const username = atob(searchParams.get('username')); // Get student username from URL params

    const [courses, setCourses] = useState([]); // List of courses
    const [selectedCourse, setSelectedCourse] = useState(null); // Selected course and teacher
    const [feedbackCategories, setFeedbackCategories] = useState([]);
    const [feedback, setFeedback] = useState({}); // To store feedback ratings per category

    // Fetch the courses the student is enrolled in
    useEffect(() => {
        async function fetchCourses() {
            try {
                const courseRef = ref(database, `registered-courses/${username}`);
                const snapshot = await get(courseRef);
                if (snapshot.exists()) {
                    const coursesData = snapshot.val();
                    const formattedCourses = Object.keys(coursesData).map(courseName => ({
                        courseName,
                        teacherID: coursesData[courseName]
                    }));
                    setCourses(formattedCourses);

                    // Set the first course as the selected course by default
                    if (formattedCourses.length > 0) {
                        setSelectedCourse(formattedCourses[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        }
        fetchCourses();
    }, [username]);

    // Fetch feedback categories once a course is selected
    useEffect(() => {
        if (selectedCourse) {
            async function fetchCategories() {
                try {
                    const { courseName, teacherID } = selectedCourse;
                    const feedbackRef = ref(database, `takes/${teacherID}/${courseName}`);
                    const feedbackSnapshot = await get(feedbackRef);

                    if (feedbackSnapshot.exists()) {
                        setFeedbackCategories(Object.keys(feedbackSnapshot.val()));
                    } else {
                        setFeedbackCategories([]);
                    }
                } catch (error) {
                    console.error("Error fetching feedback categories:", error);
                }
            }
            fetchCategories();
        }
    }, [selectedCourse]);

    // Handle rating selection
    const handleRatingChange = (category, rating) => {
        setFeedback((prevFeedback) => ({
            ...prevFeedback,
            [category]: rating,
        }));
    };

    // Submit feedback to the database
    const handleSubmit = async () => {
        if (selectedCourse && Object.keys(feedback).length > 0) {
            try {
                const { courseName, teacherID } = selectedCourse;
                for (const [category, rating] of Object.entries(feedback)) {
                    const ratingRef = ref(database, `takes/${teacherID}/${courseName}/${category}/${rating}`);
                    const currentSnapshot = await get(ratingRef);
                    const currentCount = currentSnapshot.exists() ? currentSnapshot.val() : 0;

                    // Update the count for the selected rating
                    await set(ratingRef, currentCount + 1);
                }
                alert('Feedback submitted successfully!');
            } catch (error) {
                console.error("Error submitting feedback:", error);
            }
        }
    };

    return (
            <div className="min-h-screen bg-[#f9f6e8] p-8 flex flex-col items-center">
                <div className="w-1/2 flex justify-center">
                    <Lottie
                        animationData={animationData}
                        loop={true}
                        className="w-1/2 h-3/4 object-cover"
                    />
                </div>
                <div className="max-w-5xl w-full bg-[#faf4d3] border border-[#d9c6a3] rounded-xl p-6 shadow-lg">
                    <h1 className="text-3xl font-bold font-serif text-brown-800 text-center mb-8">Provide Feedback</h1>

                    {courses.length === 0 ? (
                        <p className="text-center text-gray-500 font-serif">Loading courses...</p>
                    ) : (
                        <div className="mb-6">
                            <label className="block font-semibold font-serif text-brown-800 mb-2">Select Course:</label>
                            <select
                                className="w-full p-3 border border-[#d9c6a3] rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-brown-300"
                                onChange={(e) => setSelectedCourse(courses[e.target.value])}
                            >
                                {courses.map((course, index) => (
                                    <option key={index} value={index}>
                                        {course.courseName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {feedbackCategories.length === 0 ? (
                        <p className="text-center text-gray-500 font-serif">Loading feedback categories...</p>
                    ) : (
                        <form className="mt-4">
                            {feedbackCategories.map((category) => (
                                <div key={category} className="mb-6">
                                    <label className="block font-semibold font-serif text-brown-800 mb-2">{category}</label>
                                    <div className="flex justify-between">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <label key={rating} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={category}
                                                    value={rating}
                                                    onChange={() => handleRatingChange(category, rating)}
                                                    className="mr-2 accent-brown-600"
                                                />
                                                {rating} Star
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="mt-6 bg-brown-600 text-white p-3 w-full rounded-lg shadow hover:bg-brown-700"
                            >
                                Submit Feedback
                            </button>
                        </form>
                    )}
                </div>
            </div>
    );
};

export default FeedbackPageContent;
