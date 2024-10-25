"use client";

import { useState } from "react";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import AdminDashboard from "@/components/AdminDashboard";

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const adminEmails = ["b22cs058@iitj.ac.in", "vaibhavgupta92735@gmail.com"];

  const handleSuccess = (user) => {
    if (adminEmails.includes(user.email)) {
      setUser(user);
    } else {
      alert("You are not authorized to access the admin page.");
    }
  };

  if (!user) {
    return <GoogleSignInButton onSuccess={handleSuccess} />;
  }

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;
