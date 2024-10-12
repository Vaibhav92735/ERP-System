"use client"; // Ensure it's a client component

import { useState } from "react";
import { useRouter } from 'next/navigation'; // For Next.js 13+ routing
import { ref, get, database } from "../firebase/config";
import ProfilePage from "@/app/teacher_profile/page";

const LoginForm = ({ userType, darkMode }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize the router

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const folder = userType === "student" ? "students" : "teachers";
    const userRef = ref(database, `users/${folder}`);

    try {
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const isValidUser = users[username] && users[username] === password;

        if (isValidUser) {
          console.log("Logged in successfully");
          if (userType === "student") {
            router.push(`/profile?username=${username}`); // Pass username here
          } else {
            router.push(`/teacher_profile?username=${username}`);
          }
        } else {
          setError("Invalid username or password.");
        }
      } else {
        setError("No users found in the database.");
      }
    } catch (err) {
      setError("Error retrieving user data.");
    }
  };

  return (
    <form className="flex flex-col space-y-4">
      <h2 className="text-lg font-serif font-semibold text-center">{`Login Form`}</h2>
      <div>
        <label className="block mb-1 font-serif">Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-sepia-light border-brown-300 text-brown-900'}`}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-serif">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-sepia-light border-brown-300 text-brown-900'}`}
          required
        />
      </div>
      {error && <p className="text-red-500 text-center font-serif">{error}</p>}
      <button
        onClick={handleLogin}
        type="submit"
        className={`py-2 rounded ${darkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-900 hover:bg-blue-800'} text-white font-serif`}
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
