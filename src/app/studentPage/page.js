// studentPage/page.js

"use client";
import { useState } from "react";
import { useSearchParams } from 'next/navigation';
import Profile from '../../components/Student-Profile';
import Fees from '../../components/Fees';
import RegisteredCoursesComponent from '../../components/RegisteredCoursesComponent';
import Subjects from '../../components/Subjects';
import FeedbackPageContent from '../../components/Feedback';
import NavbarComp from "@/components/Navbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Suspense } from "react";

const StudentPageComponet = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const [activeTab, setActiveTab] = useState("Profile");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Profile":
        return <Profile username={username} />;
      case "Fees":
        return <Fees username={username} />;
      case "Registered Courses":
        return <RegisteredCoursesComponent username={username} />;
      case "Subjects":
        return <Subjects username={username} />;
      case "Feedback":
        return <FeedbackPageContent username={username} />;
      default:
        return <Profile username={username} />;
    }
  };

  return (
    <div className="relative h-screen bg-[#f9f6e8] w-full bg-parchment bg-no-repeat bg-cover">
      <Header />
      <NavbarComp setActiveTab={setActiveTab} />
      <div className="min-h-screen p-8 font-serif">
        <div className="tab-content">
          {renderActiveTab()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const StudentPage = () => {
    return (
        <div className="relative h-screen bg-[#f9f6e8] w-full bg-parchment bg-no-repeat bg-cover">
            <Suspense fallback={<div>Loading page...</div>}>
                <StudentPageComponet />
            </Suspense>
        </div>
    );
};

export default StudentPage;
