import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import TopBar from "./components/TopBar"; // Removed separate TopBar
import Header from "./components/Header";
import Footer from "./components/Footer";
// import TestComponent from "./components/TestComponent"; // Removed test component

import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import ProductsPage from "./pages/ProductsPage";

// Define the type for the App component
const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Top contact bar - now integrated into Header */}
        {/* <TopBar /> */}

        {/* Main navigation and integrated Top Bar */}
        <Header />

        {/* Page content */}
        <main className="flex-grow pt-[120px]"> {/* Adjusted padding to account for combined header height */}
          {/* <TestComponent /> */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/products" element={<ProductsPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App; 