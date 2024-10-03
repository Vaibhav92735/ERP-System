"use client"

import { useState } from "react";
import LoginForm from "../../components/LoginForm";

const LoginPage = ({darkMode}) => {
  const [selectedUserType, setSelectedUserType] = useState(null);

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-lg p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} transition duration-300`}>
        <h2 className="text-2xl font-bold text-center mb-6">Welcome to the College ERP System</h2>
        <h3 className="text-lg text-center mb-4">Please select your role to continue</h3>
        {!selectedUserType ? (
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between">
              <button
                className="flex-1 mx-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={() => setSelectedUserType("student")}
              >
                Students Corner
              </button>
              <button
                className="flex-1 mx-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
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

export default LoginPage;
