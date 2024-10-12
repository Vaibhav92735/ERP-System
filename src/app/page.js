"use client"

import { useState } from "react";
import Header from '../components/Header';
import LoginPage from "./login/page";
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import "../app/globals.css"

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

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-3xl mx-auto border border-gray-300 shadow-md rounded-md p-6 bg-paper-texture">
          <h1 className="text-2xl font-serif mb-4">Welcome to the ERP Portal</h1>
          <LoginPage darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;