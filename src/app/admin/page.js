"use client";

import { useState } from "react";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import AdminDashboard from "@/components/AdminDashboard";
import Header from "@/components/Header";

const AdminPage = () => {
  const [user, setUser] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const adminEmails = ["b22cs058@iitj.ac.in", "vaibhavgupta92735@gmail.com"];

  const handleSuccess = (user) => {
    if (adminEmails.includes(user.email)) {
      setUser(user);
      setError("");
    } else {
      setError("You are not authorized to access the admin page.");
    }
    setLoading(false);
  };

  const handleSignIn = () => {
    setLoading(true);
    setError("");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="w-full max-w-md p-8 rounded-md shadow-lg bg-parchment bg-slate-300">
          <h2 className="text-3xl font-bold text-center bg-slate-400 text-gray-800 mb-6 rounded-md shadow-md">
            Admin Login
          </h2>
          <p className="text-center text-gray-600 mb-4">
            Please sign in with your authorized account
          </p>
          <GoogleSignInButton onSuccess={handleSuccess} onClick={handleSignIn} />
          {loading && (
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">Signing you in...</p>
            </div>
          )}
          {error && (
            <div className="mt-4 text-center text-red-600 font-medium">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6 bg-gray-100">
        <AdminDashboard />
      </main>
    </div>
  );
};

export default AdminPage;
