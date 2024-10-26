// "use client";
// import { useState } from "react";
// import { useSearchParams } from 'next/navigation';
// import Profile from '../../components/TeachersProfile';
// import Courses from '../../components/Courses';
// import Grading from '../../components/Grading';
// import NavbarComp from "@/components/TeacherNav";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { Suspense } from "react";

// const TeachersPageComponent = () => {
//   const searchParams = useSearchParams();
//   const username = searchParams.get('username');
//   const [activeTab, setActiveTab] = useState("Profile");

//   const renderActiveTab = () => {
//     switch (activeTab) {
//       case "Profile":
//         return <Profile username={username} />;
//       case "Courses":
//         return <Courses username={username} />;
//       case "Grading":
//         return <Grading username={username} />;
//       default:
//         return <Profile username={username} />;
//     }
//   };

//   return (
//     <div className="relative h-screen bg-[#f9f6e8] w-full bg-parchment bg-no-repeat bg-cover">
//       <Header />
//       <NavbarComp setActiveTab={setActiveTab} />
//       <div className="min-h-screen p-8 font-serif">
//         <div className="tab-content">
//           {renderActiveTab()}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// const TeachersPage = () => {
//     return (
//         <div className="relative h-screen bg-[#f9f6e8] w-full bg-parchment bg-no-repeat bg-cover">
//             <Suspense fallback={<div>Loading page...</div>}>
//                 <TeachersPageComponent />
//             </Suspense>
//         </div>
//     );
// };

// export default TeachersPage;

// studentPage/page.js

"use client";
import { useState } from "react";
import { useSearchParams } from 'next/navigation';
import Profile from '../../components/TeachersProfile';
import Courses from '../../components/Courses';
import Grading from '../../components/Grading';
import NavbarComp from "@/components/TeacherNav";
import TeacherAttendance from "@/components/TeacherAttendance";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Suspense } from "react";

const TeachersPageComponent = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const [activeTab, setActiveTab] = useState("Profile");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Profile":
        return <Profile username={username} />;
      case "Courses":
        return <Courses username={username} />;
      case "Grading":
        return <Grading username={username} />;
      case "Attendance":
        return <TeacherAttendance username={username} />
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

const TeachersPage = () => {
    return (
        <div className="relative h-screen w-full bg-[#f9f6e8]">
            <Suspense fallback={<div>Loading page...</div>}>
                <TeachersPageComponent />
            </Suspense>
        </div>
    );
};

export default TeachersPage;

