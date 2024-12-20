"use client"; // Ensure it's a client component

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import Profile from "@/components/TeacherProfile";
import { ref, get, database } from '../../firebase/config';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeacherNav from "@/components/TeacherNav";

const ProfilePageContent = () => {
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
    <div>

      <Header />
      <TeacherNav />
      <div className="bg-[#F7F1E3] min-h-screen p-8 font-serif">
        <div className="bg-[#F1E0C5] max-w-4xl mx-auto p-8 mt-10 shadow-lg rounded-lg border border-gray-400">
          <h1 className="text-3xl font-bold text-center mb-6 text-[#5A4A3B]">Student Profile</h1>
          {profileData ? (
            <Profile profile={profileData} />
          ) : (
            <p className="text-center text-[#5A4A3B]">Please log in to view your profile.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

// export default ProfilePage;

const ProfilePage = () => {
  return (
      <div className="relative h-screen bg-[#f9f6e8] w-full bg-parchment bg-no-repeat bg-cover">
          <Suspense fallback={<div>Loading page...</div>}>
              <ProfilePageContent />
          </Suspense>
      </div>
  );
};

export default ProfilePage;
