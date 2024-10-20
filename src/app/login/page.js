"use client";

import { useState, Suspense } from "react";
import LoginForm from "../../components/LoginForm";

const LoginPageComponent = ({ darkMode }) => {
  const [selectedUserType, setSelectedUserType] = useState(null);

  return (
    <div className={` flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-sepia-lighter'}`}>
      <div className={`w-full max-w-lg p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-sepia-darker text-brown-900'} transition duration-300`}>
        <h2 className="text-2xl font-serif font-bold text-center mb-4">Welcome to the College ERP System</h2>

        {!selectedUserType ? (
          <div className="flex flex-col space-y-4">
            <p className="text-center mb-4 font-serif">Select your Role:</p>
            <div className="flex justify-between">
              <button
                className="flex-1 mx-2 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-serif focus:outline-none"
                onClick={() => setSelectedUserType("student")}
              >
                Students Corner
              </button>
              <button
                className="flex-1 mx-2 py-2 bg-green-900 text-white rounded-lg hover:bg-green-700 transition duration-300 font-serif focus:outline-none"
                onClick={() => setSelectedUserType("teacher")}
              >
                Teachers Corner
              </button>
            </div>
          </div>
        ) : (
          <LoginForm userType={selectedUserType} darkMode={darkMode} />
        )}
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
      <div className="bg-[#f9f6e8] w-full bg-parchment bg-no-repeat bg-cover">
          <Suspense fallback={<div>Loading page...</div>}>
              <LoginPageComponent />
          </Suspense>
      </div>
  );
};

export default LoginPage;
