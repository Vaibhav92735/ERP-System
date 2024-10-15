"use client";

import { useState } from "react";
import Header from "../components/Header";
import LoginPage from "./login/page";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei"; // For Three.js
import Lottie from "lottie-react"; // Correct import for Lottie
import animationData from "../public/Lottie.json"; // Check if the path is correct
import "../app/globals.css";

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen transition duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-sepia text-black'}`}>
      <Header darkMode={darkMode} />

      {/* Dark Mode Toggle Button */}
      <div className="absolute top-4 right-4">
        <button
          className="p-2 rounded-full transition duration-300 bg-brown-200 hover:bg-brown-300 dark:bg-gray-700"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-500" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-800" />
          )}
        </button>
      </div>

      {/* Main Content in Two Columns */}
      <div className="flex flex-row items-center justify-center h-screen">
        
        {/* Left Column - Lottie Animation */}
        <div className="w-1/2 flex justify-center">
          <Lottie
            animationData={animationData}
            loop={true}
            className="w-3/4 h-3/4 object-cover"
          />
        </div>

        {/* Right Column - Login Form */}
        <div className="w-1/2">
          <div className="max-w-lg mx-auto border border-gray-300 shadow-md rounded-md p-6 bg-paper-texture">
            <h1 className="text-2xl font-serif mb-4">Welcome to the ERP Portal</h1>
            <LoginPage darkMode={darkMode} />
          </div>

          {/* Three.js 3D Object */}
          {/* <div className="mt-8 h-64">
            <Canvas>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Box args={[2, 2, 2]} position={[0, 0, 0]}>
                <meshStandardMaterial color={darkMode ? "yellow" : "blue"} />
              </Box>
              <OrbitControls enableZoom={false} />
            </Canvas>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
