"use client";
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { FaSignOutAlt } from 'react-icons/fa';
import logo from "../public/logo.png";

export default function NavbarComp({ setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility for mobile
  const searchParams = useSearchParams();
  const username = searchParams.get('username'); // Get username from the URL

  // Define tab names to render in the navbar
  const tabs = ["Profile", "Fees", "Registered Courses", "Attendance", "Subjects", "Feedback", "Student Requests"];

  return (
    <Navbar
      position="sticky"
      isBordered
      className="shadow-lg bg-opacity-50 bg-transparent text-white py-4"
      style={{ backdropFilter: "blur(10px)", padding: "20px 50px" }}
    >
      {/* Branding Section */}
      <NavbarBrand className="flex items-center gap-2 cursor-pointer text-2xl">
        <Image src={logo} alt="ERP System Logo" width={36} height={36} />
        <p className="font-bold text-3xl text-[#5A4A3B]">ERP - Portal</p>
      </NavbarBrand>

      {/* Desktop Menu with Old Document Style */}
      <NavbarContent className="hidden sm:flex gap-10 text-xl text-[#5A4A3B]" justify="center">
        {tabs.map((tab) => (
          <NavbarItem key={tab}>
            <button
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 bg-[#f5e4c3] border border-[#b88a60] rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out text-brown-800 font-serif tracking-wide text-lg"
              style={{
                background: "linear-gradient(to right, #f8e8cb, #e9d8b4)",
                borderColor: "#b88a60",
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.15)",
                color: "#5A4A3B",
                fontFamily: "'EB Garamond', serif",
              }}
            >
              {tab}
            </button>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Mobile Menu - Dropdown with Old Document Style */}
      <NavbarContent className="sm:hidden">
        <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
          <DropdownTrigger>
            <Button
              auto
              flat
              color="primary"
              onClick={() => setIsOpen(!isOpen)}
              className="bg-[#f5e4c3] border border-[#b88a60] rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out text-brown-800 font-serif tracking-wide"
              style={{
                background: "linear-gradient(to right, #f8e8cb, #e9d8b4)",
                borderColor: "#b88a60",
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.15)",
                color: "#5A4A3B",
                fontFamily: "'EB Garamond', serif",
              }}
            >
              Menu
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            {tabs.map((tab) => (
              <DropdownItem key={tab}>
                <button
                  onClick={() => {
                    setActiveTab(tab);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 bg-[#f5e4c3] border border-[#b88a60] rounded-md shadow-md hover:bg-[#f0e2bf] transition duration-300 ease-in-out font-serif tracking-wide"
                  style={{
                    color: "#5A4A3B",
                    fontFamily: "'EB Garamond', serif",
                  }}
                >
                  {tab}
                </button>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {/* Right Aligned Logout Button with Old Document Style */}
      <NavbarContent justify="end" className="flex gap-6 text-[#5A4A3B]">
        <NavbarItem>
          <Button
            color="error"
            onClick={() => window.location.href = "/"}
            variant="ghost"
            size="lg"
            className="hover:scale-110 transition duration-300 ease-in-out flex items-center gap-2 px-4 py-2 bg-[#f5e4c3] border border-[#b88a60] rounded-lg shadow-md"
            style={{
              background: "linear-gradient(to right, #f8e8cb, #e9d8b4)",
              borderColor: "#b88a60",
              boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.15)",
              color: "#5A4A3B",
              fontFamily: "'EB Garamond', serif",
            }}
          >
            <FaSignOutAlt />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
