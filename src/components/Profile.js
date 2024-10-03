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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Profile" : "Profile"}</h2>
      <form>
        {Object.entries(profileData).map(([key, value]) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {key.replace(/([A-Z])/g, " $1").toUpperCase()}
            </label>
            <input
              type="text"
              name={key}
              value={value}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 block w-full p-2 border rounded-md ${isEditing ? "border-gray-300" : "bg-gray-100 cursor-not-allowed"}`}
            />
          </div>
        ))}
        {isEditing ? (
          <div className="flex justify-between">
            <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Save
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-300 rounded-md">
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setIsEditing(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
            Edit Profile
          </button>
        )}
      </form>
    </div>
  );
};

export default Profile;
