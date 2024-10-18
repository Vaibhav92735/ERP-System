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

export default function NavbarComp() {
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
          <Link color="primary" href={`/profile?username=${username}`} className="hover:underline">
            Profile
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="primary" href={`/fees?username=${username}`} className="hover:underline">
            Fees
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="primary" href={`/registeredCourses?username=${username}`} className="hover:underline">
            Registered Courses
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="primary" href={`/subjects?username=${username}`} className="hover:underline">
            Subjects
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="primary" href={`/feedback?username=${username}`} className="hover:underline">
            Feedback
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
        <NavbarItem className="hidden lg:flex">
          <Link color="primary" href="#" className="text-lg hover:underline">
            Login
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="secondary" href="#" variant="ghost" size="lg">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
