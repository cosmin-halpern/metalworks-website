import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import WorkPage from './pages/WorkPage';
import ClientsPage from './pages/ClientsPage';
import StorePage from './pages/StorePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PlataFinalizataPage from './pages/PlataFinalizataPage';
import TermeniConditiiPage from './pages/TermeniConditiiPage';
import PoliticaConfidentialitatePage from './pages/PoliticaConfidentialitatePage';
import PoliticaCookiesPage from './pages/PoliticaCookiesPage';
import PoliticaReturPage from './pages/PoliticaReturPage';
import Login from './pages/admin/Login';
import CreateUser from './pages/admin/CreateUser';
import ProtectedRoute from './pages/admin/ProtectedRoute';
import AdminDashboard from './pages/admin/Dashboard';
import ManageProjects from './pages/admin/ManageProjects';
import ManageClients from './pages/admin/ManageClients';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';

function App() {
    return (
        <Router>
            <Routes>
                {/* ADMIN ROUTES (No Header/Footer) */}
                <Route path="/admin/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<CreateUser />} />
                    <Route path="/admin/projects" element={<ManageProjects />} />
                    <Route path="/admin/clients" element={<ManageClients />} />
                    <Route path="/admin/products" element={<ManageProducts />} />
                    <Route path="/admin/orders" element={<ManageOrders />} />
                </Route>

                {/* PUBLIC ROUTES (With Header/Footer) */}
                <Route path="*" element={
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <CookieBanner />
                        <main className="flex-grow">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/servicii" element={<ServicesPage />} />
                                <Route path="/proiecte" element={<WorkPage />} />
                                <Route path="/magazin" element={<StorePage />} />
                                <Route path="/cos" element={<CartPage />} />
                                <Route path="/checkout" element={<CheckoutPage />} />
                                <Route path="/clienti" element={<ClientsPage />} />
                                <Route path="/contact" element={<ContactPage />} />
                                <Route path="/plata-finalizata" element={<PlataFinalizataPage />} />
                                <Route path="/termeni-si-conditii" element={<TermeniConditiiPage />} />
                                <Route path="/politica-de-confidentialitate" element={<PoliticaConfidentialitatePage />} />
                                <Route path="/politica-de-cookies" element={<PoliticaCookiesPage />} />
                                <Route path="/politica-de-retur" element={<PoliticaReturPage />} />
                                <Route path="*" element={<HomePage />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                } />
            </Routes>
        </Router>
    );
}

export default App;