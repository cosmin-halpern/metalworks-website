// src/pages/AboutPage.jsx
import React from "react";

export default function AboutPage() {
    return (
        <section className="max-w-5xl mx-auto px-6 py-16 text-gray-800">
            <h1 className="text-4xl font-bold mb-6 text-center">About MetalWorks</h1>
            <img
                src="https://images.unsplash.com/photo-1605902711622-cfb43c4437d4?auto=format&fit=crop&w=1050&q=80"
                alt="Workshop"
                className="rounded-lg mb-8 w-full h-64 object-cover shadow"
            />
            <p className="text-lg leading-relaxed text-gray-700 mb-4">
                MetalWorks is a leading manufacturer of high-quality custom metal shelving solutions for
                retail stores, warehouses, and industrial spaces. Our mission is to provide durable, efficient,
                and cost-effective storage systems tailored to your specific needs.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
                With years of experience and a passion for precision metalwork, our team is committed to helping
                clients across Europe build the infrastructure they need to grow and thrive.
            </p>
        </section>
    );
}
