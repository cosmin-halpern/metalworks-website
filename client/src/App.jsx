import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import QuoteFormDialog from "./features/QuoteFormDialog.jsx";

export default function App() {
    const [openQuoteForm, setOpenQuoteForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleQuoteClick = (productId) => {
        setSelectedProduct(productId);
        setOpenQuoteForm(true);
    };

    return (
        <Router>
            <Header />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<HomePage onQuoteClick={handleQuoteClick} />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage onQuoteClick={handleQuoteClick} />} />
                </Routes>
            </main>
            <Footer />

            <QuoteFormDialog
                open={openQuoteForm}
                setOpen={setOpenQuoteForm}
                selectedProduct={selectedProduct}
            />
        </Router>
    );
}
