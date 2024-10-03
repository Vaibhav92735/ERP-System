"use client"; // ensure it's a client component

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
          // Redirect to profile page with username as query
          router.push(`/profile?username=${username}`); // Pass username here
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
      <h2 className="text-lg font-semibold text-center">{`Login Form`}</h2>
      <div>
        <label className="block mb-1">Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
          required
        />
      </div>
      <div>
        <label className="block mb-1">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
          required
        />
      </div>
      {error && <p className={`text-red-500 text-center`}>{error}</p>}
      <button
        onClick={handleLogin}
        type="submit"
        className={`py-2 rounded ${darkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
