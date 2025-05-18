// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="bg-white shadow px-6 py-4 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-slate-800">
                    MetalWorks
                </Link>
                <nav className="space-x-6 text-sm font-medium text-slate-600">
                    <Link to="/" className="hover:text-slate-900">Home</Link>
                    <Link to="/about" className="hover:text-slate-900">About</Link>
                    <Link to="/contact" className="hover:text-slate-900">Contact</Link>
                </nav>
            </div>
        </header>
    );
}
