"use client"; // Ensure client-side rendering

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.jsx";
import { FaSignOutAlt } from 'react-icons/fa'; // Logout icon

export default function TeacherNav() {
  const [isOpen, setIsOpen] = useState(false); // State to manage menu visibility
  const searchParams = useSearchParams();
  const username = searchParams.get('username'); // Get username from the URL

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <Navbar
      position="sticky"
      isBordered
      className="shadow-lg bg-opacity-50 bg-transparent text-white py-4"
      style={{ backdropFilter: "blur(10px)", padding: "20px 50px" }} // Increase padding and apply transparency
    >
      {/* Branding Section */}
      <NavbarBrand className="flex items-center gap-2 cursor-pointer text-2xl">
        <AcmeLogo />
        <p className="font-bold text-3xl text-[#5A4A3B]">ERP - Portal</p>
      </NavbarBrand>

      {/* Desktop Menu */}
      <NavbarContent className="hidden sm:flex gap-10 text-xl text-[#5A4A3B]" justify="center">
        <NavbarItem>
          <Link
            color="primary"
            href={`/teacher_profile?username=${username}`}
            className="hover:text-[#8B5A2B] hover:scale-150 transition duration-300 ease-in-out"
          >
            Profile
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="primary"
            href={`/courses?username=${username}`}
            className="hover:text-[#8B5A2B] hover:scale-110 transition duration-300 ease-in-out"
          >
            Courses
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="primary"
            href={`/grading?username=${username}`}
            className="hover:text-[#8B5A2B] hover:scale-110 transition duration-300 ease-in-out"
          >
            Grading
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu - Dropdown */}
      <NavbarContent className="sm:hidden">
        <Dropdown>
          <DropdownTrigger>
            <Button auto flat color="primary" onClick={handleToggle}>
              Menu
            </Button>
          </DropdownTrigger>
          <DropdownMenu isOpen={isOpen}>
            <DropdownItem>
              <Link href={`/profile?username=${username}`}>Profile</Link>
            </DropdownItem>
            <DropdownItem>
              <Link href={`/fees?username=${username}`}>Fees</Link>
            </DropdownItem>
            <DropdownItem>
              <Link href={`/registeredCourses?username=${username}`}>Registered Courses</Link>
            </DropdownItem>
            <DropdownItem>
              <Link href={`/subjects?username=${username}`}>Subjects</Link>
            </DropdownItem>
            <DropdownItem>
              <Link href={`/feedback?username=${username}`}>Feedback</Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {/* Right Aligned Buttons */}
      <NavbarContent justify="end" className="flex gap-6 text-[#5A4A3B]">
        <NavbarItem>
          <Button
            as={Link}
            color="error"
            href="/"
            variant="ghost"
            size="lg"
            className="hover:scale-110 transition duration-300 ease-in-out flex items-center gap-2"
          >
            <FaSignOutAlt />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
