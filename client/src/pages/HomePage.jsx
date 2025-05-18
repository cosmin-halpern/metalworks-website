// src/pages/HomePage.jsx
import React, { useState } from "react";
import { Button } from "client/src/components/ui/button.jsx";
import ProductCard from "client/src/features/ProductCard.jsx";
import QuoteFormDialog from "client/src/features/QuoteFormDialog.jsx";

export default function HomePage() {
    const [openQuoteForm, setOpenQuoteForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleQuoteClick = (productId) => {
        setSelectedProduct(productId);
        setOpenQuoteForm(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Hero Section */}
            <section
                className="bg-cover bg-center py-24 px-8 text-center text-white"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581091012184-d498c5f6c7c4?auto=format&fit=crop&w=1950&q=80')" }}
            >
                <h1 className="text-5xl font-extrabold mb-6 drop-shadow-md">Custom Metal Shelving</h1>
                <p className="text-xl mb-8 max-w-2xl mx-auto drop-shadow">
                    Built for industrial strength, customized for your space.
                </p>
                <Button className="text-lg px-8 py-3 rounded-full bg-white text-slate-800 font-semibold hover:bg-gray-200" onClick={() => handleQuoteClick("General")}>Request a Quote</Button>
            </section>

            {/* Products Section */}
            <section className="py-16 px-8 bg-white">
                <h2 className="text-3xl font-semibold text-center mb-10 text-slate-800">Featured Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[1, 2, 3].map((id) => (
                        <ProductCard key={id} id={id} onQuoteClick={handleQuoteClick} />
                    ))}
                </div>
            </section>

            {/* Contact CTA */}
            <section className="bg-slate-800 py-16 px-8 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Need something specific?</h2>
                <p className="mb-6 max-w-xl mx-auto text-lg">
                    We work closely with retail and industrial clients to build the right shelving for any environment.
                </p>
                <Button className="text-lg px-8 py-3 rounded-full bg-white text-slate-800 font-semibold hover:bg-gray-200" onClick={() => handleQuoteClick("General Inquiry")}>Contact Us</Button>
            </section>

            {/* Quote Request Modal */}
            <QuoteFormDialog
                open={openQuoteForm}
                setOpen={setOpenQuoteForm}
                selectedProduct={selectedProduct}
            />
        </div>
    );
}
