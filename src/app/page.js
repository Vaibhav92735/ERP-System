"use client"

import { useState } from "react";
import Header from '../components/Header';
import LoginPage from "./login/page";
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-100'} min-h-screen transition duration-300`}>
      <Header darkMode={darkMode} />
      <div className="absolute top-4 right-4">
        <button
          className="p-2 rounded-full transition duration-300 bg-gray-200 dark:bg-gray-700"
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
      <LoginPage darkMode={darkMode} />
    </div>
  );
};

export default HomePage;