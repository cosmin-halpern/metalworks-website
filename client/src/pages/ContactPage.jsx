import React from "react";
import { Button } from "client/src/components/ui/button.jsx";

export default function ContactPage({ onQuoteClick }) {
    return (
        <section className="max-w-3xl mx-auto px-6 py-16 text-gray-800 text-center">
            <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
            <p className="text-lg text-gray-600 mb-10">
                We'd love to hear from you. Click below to request a quote or ask a question.
            </p>
            <Button
                onClick={() => onQuoteClick("General Inquiry")}
                className="text-lg px-8 py-3 rounded-full"
            >
                Open Contact Form
            </Button>
        </section>
    );
}
