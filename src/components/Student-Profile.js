"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import Profile from './Profile';
import { ref, get, database } from '../firebase/config';
import Lottie from "lottie-react";
import animationData from "../public/Profile.json";

const ProfilePageContent = () => {
  const searchParams = useSearchParams();
  const username = atob(searchParams.get('username'));

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (username) {
      const userRef = ref(database, `student-profile/${username}`);

      const fetchProfileData = async () => {
        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setProfileData(snapshot.val());
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
      <div className="bg-[#F7F1E3] min-h-screen p-32 font-serif">
        <div className="flex flex-row items-center justify-center h-screen">

        <div className="w-1/2 flex justify-center">
          <Lottie
            animationData={animationData}
            loop={true}
            className="w-1/2 h-3/4 object-cover"
            />
        </div>

        <div className="w-1/2">
        <div className="bg-[#F1E0C5] max-w-4xl mx-auto p-8 mt-10 shadow-lg rounded-lg border border-gray-400">
          <h1 className="text-3xl font-bold text-center mb-6 text-[#5A4A3B]">Student Profile</h1>
          {profileData ? (
            <Profile profile={profileData} />
          ) : (
            <p className="text-center text-[#5A4A3B]">Please log in to view your profile.</p>
          )}
        </div>
        </div>
        </div>
      </div>
  );
};

export default ProfilePageContent;
