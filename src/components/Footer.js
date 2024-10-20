"use client";

import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'; // Social media icons
import { Link } from "@nextui-org/react";

export default function Footer() {
  // Sample team data
  const teamMembers = [
    { name: "Vaibhav Gupta", role: "Frontend Developer", image: "https://vaibhav92735.github.io/Movie_Recommendation_App/Vaibhav.jpg" },
    { name: "Rahul Reddy", role: "Backend Developer", image: "https://vaibhav92735.github.io/Movie_Recommendation_App/ARR.jpg" },
    { name: "Mayank Bansal", role: "UI/UX Designer", image: "https://vaibhav92735.github.io/Movie_Recommendation_App/Abhinay.JPG" },
  ];

  return (
    <footer className="bg-[#5A4A3B] text-white py-12">
      <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-10">
        
        {/* About Section */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h2 className="text-3xl font-bold mb-4">ERP Portal - IIT Jodhpur</h2>
          <p className="text-sm lg:text-base max-w-md">
            This ERP system streamlines various processes, helping students and faculty to manage their academic and administrative tasks efficiently.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link color="secondary" href="https://www.iitj.ac.in/" className="hover:underline">IIT Jodhpur</Link>
            </li>
            <li>
              <Link color="secondary" href="http://iitj.ac.in/footer/index.php?id=contact" className="hover:underline">Contact Us</Link>
            </li>
            <li>
              <Link color="secondary" href="http://iitj.ac.in/repository/index.php?id=nirf" className="hover:underline">NIRF</Link>
            </li>
            <li>
              <Link color="secondary" href="http://iitj.ac.in/tel1/index.php?id=phone_book" className="hover:underline">Phone Book</Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/IITJOfficial/" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-gray-400">
              <FaFacebook />
            </a>
            <a href="https://twitter.com/iitjodhpur" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-gray-400">
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com/insta_iitj2019" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-gray-400">
              <FaInstagram />
            </a>
            <a href="https://www.youtube.com/channel/UCFfCylvEDIB1IH4GaRVRyLA" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-gray-400">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Team Section */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h3 className="text-lg font-semibold mb-4">Meet the Team</h3>
          <div className="flex space-x-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-16 h-16 rounded-full shadow-md mb-2"
                />
                <p className="text-sm font-semibold">{member.name}</p>
                <p className="text-xs text-gray-300">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-500 mt-8"></div>

      <div className="text-center text-sm text-gray-300 mt-4">
        &copy; {new Date().getFullYear()} All Rights Reserved, IIT Jodhpur 
      </div>
    </footer>
  );
}
