"use client"; // Ensure client-side rendering

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FaBars } from 'react-icons/fa'; // Importing a hamburger icon from react-icons

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false); // State to manage menu visibility
    const searchParams = useSearchParams();
    const username = searchParams.get('username'); // Get username from the URL

    const toggleMenu = () => {
        setIsOpen((prev) => !prev); // Toggle the menu open/close state
    };

    return (
        <div className="relative">
            <button
                onClick={toggleMenu}
                className="flex items-center text-[#FFF8E7] bg-[#5A4A3B] p-2 rounded-md hover:bg-[#7A6E5D] focus:outline-none transition-all duration-300"
            >
                <FaBars className="h-6 w-6" /> {/* Menu icon */}
                {/* <span className="ml-2 text-lg font-serif">Menu</span> */}
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-[#F1E0C5] border border-[#C0A383] rounded-md shadow-lg z-10 transition-opacity duration-500 ease-in-out">
                    <ul className="flex flex-col font-serif text-[#5A4A3B]">
                        <li>
                            <Link href={`/profile?username=${username}`} className="block px-4 py-3 hover:bg-[#EFEFE8] hover:text-[#000] transition-all duration-300">
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link href={`/fees?username=${username}`} className="block px-4 py-3 hover:bg-[#EFEFE8] hover:text-[#000] transition-all duration-300">
                                Fees
                            </Link>
                        </li>
                        <li>
                            <Link href={`/registeredCourses?username=${username}`} className="block px-4 py-3 hover:bg-[#EFEFE8] hover:text-[#000] transition-all duration-300">
                                Registered Courses
                            </Link>
                        </li>
                        <li>
                            <Link href={`/subjects?username=${username}`} className="block px-4 py-3 hover:bg-[#EFEFE8] hover:text-[#000] transition-all duration-300">
                                Subjects
                            </Link>
                        </li>
                        <li>
                            <Link href={`/feedback?username=${username}`} className="block px-4 py-3 hover:bg-[#EFEFE8] hover:text-[#000] transition-all duration-300">
                                Feedback
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Menu;
