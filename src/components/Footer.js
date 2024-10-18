"use client";

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Social media icons
import { Link } from "@nextui-org/react";

export default function Footer() {
  return (
    <footer className="bg-[#5A4A3B] text-white py-12">
      <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-10">
        
        {/* Branding and Short Description */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h2 className="text-3xl font-bold mb-4">ERP Portal - IIT Jodhpur</h2>
          <p className="text-sm lg:text-base max-w-md">
            
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link color="secondary" href="/about" className="hover:underline">About Us</Link>
            </li>
            <li>
              <Link color="secondary" href="/contact" className="hover:underline">Contact Us</Link>
            </li>
            <li>
              <Link color="secondary" href="/privacy" className="hover:underline">Privacy Policy</Link>
            </li>
            <li>
              <Link color="secondary" href="/terms" className="hover:underline">Terms of Service</Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-gray-400">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-gray-400">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-gray-400">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-gray-400">
              <FaLinkedin />
            </a>
          </div>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-gray-500 mt-8"></div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-300 mt-4">
        &copy; {new Date().getFullYear()} ACME Corp. All rights reserved.
      </div>
    </footer>
  );
}
