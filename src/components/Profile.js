"use client";

import { useState } from "react";
import { getDatabase, ref, update } from "firebase/database";

const Profile = ({ profile }) => {
  const [profileData, setProfileData] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const db = getDatabase();
    const profileRef = ref(db, `student-profile/${profileData.roll_no}`);
    update(profileRef, profileData)
      .then(() => {
        console.log("Profile updated successfully");
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div className="container mx-auto max-w-3xl p-6 bg-[#F5ECD4] shadow-md border border-[#C0A383] rounded-md font-serif">
      <h2 className="text-2xl font-bold mb-4 text-[#5A4A3B] text-center">
        {isEditing ? "Edit Profile" : "Profile Details"}
      </h2>
      <form className="space-y-4">
        {Object.entries(profileData).map(([key, value]) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-[#5A4A3B] capitalize">
              {key.replace(/([A-Z])/g, " $1").toUpperCase()}
            </label>
            <input
              type="text"
              name={key}
              value={value}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7C6A] ${
                isEditing ? "bg-[#FFF8E7] border-[#C0A383]" : "bg-[#EFEFE8] border-[#D1C7BA] cursor-not-allowed"
              }`}
            />
          </div>
        ))}
        {isEditing ? (
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-[#8A7C6A] text-white rounded-md shadow-md hover:bg-[#7A6E5D] focus:ring-2 focus:ring-[#5A4A3B]"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md shadow-md hover:bg-gray-400 focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="mt-4 px-6 py-2 bg-[#8A7C6A] text-white rounded-md shadow-md hover:bg-[#7A6E5D] focus:ring-2 focus:ring-[#5A4A3B]"
            >
              Edit Profile
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
