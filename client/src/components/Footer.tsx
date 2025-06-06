import React from "react";

const Footer: React.FC = () => (
  <footer className="w-full py-6 bg-background-dark text-center text-text-light border-t border-background">
    <span className="text-sm">
      &copy; {new Date().getFullYear()} MetalWorks. All rights reserved.
    </span>
  </footer>
);

export default Footer; 