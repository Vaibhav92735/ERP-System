"use client"; // Ensure it's a client component

import { useState } from "react";
import { useRouter } from 'next/navigation'; // For Next.js 13+ routing
import { ref, get, database } from "../firebase/config";

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
            router.push(`/studentPage?username=${username}`); // Pass username here
          } else {
            router.push(`/teachersPage?username=${username}`);
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
    <div>
      <h3 className="text-center text-xl font-serif mb-4">
        {userType === "student" ? "Student Login" : "Teacher Login"}
      </h3>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className={`block text-sm font-serif mb-1 ${darkMode ? 'text-gray-200' : 'text-brown-900'}`}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-yellow-400' : 'focus:ring-blue-500'} transition duration-300`}
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-serif mb-1 ${darkMode ? 'text-gray-200' : 'text-brown-900'}`}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-yellow-400' : 'focus:ring-blue-500'} transition duration-300`}
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded-lg font-serif transition duration-300 ${darkMode ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' : 'bg-blue-900 text-white hover:bg-blue-800'} focus:outline-none`}
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
