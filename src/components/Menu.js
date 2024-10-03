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
                className="flex items-center text-white bg-gray-800 p-2 rounded-md hover:bg-gray-700 focus:outline-none"
            >
                <FaBars className="h-5 w-5" /> {/* Menu icon */}
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <ul className="flex flex-col">
                        <li>
                            <Link href={`/profile?username=${username}`} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link href={`/fees?username=${username}`} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                Fees
                            </Link>
                        </li>
                        <li>
                            <Link href={`/subjects?username=${username}`} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                Subjects
                            </Link>
                        </li>
                        <li>
                            <Link href={`/feedback?username=${username}`} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
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
