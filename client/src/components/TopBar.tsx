import React from "react";
import { Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react";

// Define the props interface (even though this component doesn't have props yet,
// it's good practice to define it for future use)
interface TopBarProps {
  // Add props here when needed
}

// Define the component with its props type
const TopBar: React.FC<TopBarProps> = () => {
  return (
    <div className="bg-slate-900 text-gray-300 text-xs">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between py-2">
        {/* Left side: contact info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Phone className="w-4 h-4" />
            <span>+40 123 456 789</span>
          </div>
          <div className="flex items-center space-x-1">
            <Phone className="w-4 h-4" />
            <span>+40 987 654 321</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1">
            <Mail className="w-4 h-4" />
            <span>info@metalworks.com</span>
          </div>
        </div>

        {/* Right side: social icons */}
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <a href="#" aria-label="Facebook" className="hover:text-white transition">
            <Facebook className="w-4 h-4" />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-white transition">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-white transition">
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 