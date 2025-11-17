import React from 'react';
import {Instagram, Linkedin} from 'lucide-react';
import {Phone, Mail} from 'lucide-react';
import {FaFacebook} from 'react-icons/fa';

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
                        <Phone className="w-4 h-4"/>
                        <span>+40 (768) 515 774</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4"/>
                        <span>+40 (768) 367 563</span>
                    </div>
                    <div className="hidden sm:flex items-center space-x-1">
                        <Mail className="w-4 h-4"/>
                        <span>office@corsican.ro</span>
                    </div>
                </div>

                {/* Right side: social icons */}
                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                    <a href="https://www.facebook.com/p/Corsican-Engineering-100064100884554/" aria-label="Facebook"
                       className="hover:text-white transition" target="_blank" rel="noopener noreferrer">
                        <FaFacebook className="w-4 h-4"/>
                    </a>
                    <a href="#" aria-label="Instagram" className="hover:text-white transition">
                        <Instagram className="w-4 h-4"/>
                    </a>
                    <a href="#" aria-label="LinkedIn" className="hover:text-white transition">
                        <Linkedin className="w-4 h-4"/>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
