import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-200 text-gray-800">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center gap-4">
          
          <p className="text-sm">
            &copy; {currentYear} Shoevo. All Rights Reserved.
          </p>

          {/* Social Media Icons */}
          <div className="flex items-center gap-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:scale-110 duration-200">
              <FaFacebookF size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:scale-110 duration-200">
              <FaTwitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:scale-110 duration-200">
              <FaInstagram size={20} />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;