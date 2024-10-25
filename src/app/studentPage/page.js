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

const StudentPageComponent = () => {
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
    <div className="relative w-full bg-parchment bg-no-repeat bg-cover text-[#4a3b2d]">
      <Header />
      <NavbarComp setActiveTab={setActiveTab} />
      
      {/* Main Content with Padding */}
      <div className="h-full p-4 md:p-8 font-serif bg-white bg-opacity-90 border border-[#c2b280] shadow-lg rounded-lg">
        <div className="tab-content h-full overflow-y-auto">
          {renderActiveTab()}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const StudentPage = () => {
    return (
        <div className="relative h-screen w-full bg-[#f9f6e8]">
            <Suspense fallback={<div>Loading page...</div>}>
                <StudentPageComponent />
            </Suspense>
        </div>
    );
};

export default StudentPage;
