// src/components/Footer.jsx
import React from "react";

export default function Footer() {
    return (
        <footer className="bg-slate-800 text-white py-6 mt-12">
            <div className="max-w-6xl mx-auto px-6 text-center text-sm">
                &copy; {new Date().getFullYear()} MetalWorks. All rights reserved.
            </div>
        </footer>
    );
}
