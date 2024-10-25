"use client"; // Ensure it's a client component

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import Profile from "./TeacherProfile";
import { ref, get, database } from '../firebase/config';
import { Player } from '@lottiefiles/react-lottie-player'; // Import Lottie player
import lottieAnimation from "../public/TeachProf.json"; // Import Lottie animation

const ProfilePage = () => {
    const searchParams = useSearchParams();
    const username = searchParams.get('username'); // Extract the username from the URL

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (username) {
            const userRef = ref(database, `teacher-profile/${username}`);

            // Fetch profile data from the database
            const fetchProfileData = async () => {
                try {
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        setProfileData(snapshot.val()); // Setting the profile data
                    } else {
                        setError("Profile not found.");
                    }
                } catch (err) {
                    console.error("Error fetching profile:", err);
                    setError("Error fetching profile data.");
                } finally {
                    setLoading(false);
                }
            };

            fetchProfileData();
        } else {
            setError("No username provided.");
            setLoading(false);
        }
    }, [username]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="bg-[#F7F1E3] min-h-screen p-8 font-serif">
            <div className="bg-[#F1E0C5] max-w-4xl mx-auto p-8 mt-10 shadow-lg rounded-lg border border-gray-400 relative">
                {/* Lottie Animation */}
                <div className="absolute top-0 left-0 mt-[-80px] ml-[-60px] opacity-80">
                    <Player
                        autoplay
                        loop
                        src={lottieAnimation}
                        className="w-40 h-40"
                    />
                </div>

                <h1 className="text-3xl font-bold text-center mb-6 text-[#5A4A3B]">Profile</h1>
                {profileData ? (
                    <Profile profile={profileData} />
                ) : (
                    <p className="text-center text-[#5A4A3B]">Please log in to view your profile.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
