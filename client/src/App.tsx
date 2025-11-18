import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import WorkPage from './pages/WorkPage';
import ClientsPage from './pages/ClientsPage';

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                {/* Removed TopBar component from here */}
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/servicii" element={<ServicesPage />} />
                        <Route path="/proiecte" element={<WorkPage />} />
                        <Route path="/clienti" element={<ClientsPage />} />
                        <Route path="/contact" element={<ContactPage />} />

                        {/* Fallback route */}
                        <Route path="*" element={<HomePage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;