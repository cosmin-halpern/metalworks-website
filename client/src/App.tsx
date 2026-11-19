import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import RouteSEO from './components/RouteSEO';
import NotFoundPage from './pages/NotFoundPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Tracking from './components/Tracking';
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
import ProtectedRoute from './pages/admin/ProtectedRoute';

// Admin pages load in separate chunks, so public visitors don't download them.
// They are never rendered on the server (see server/src/index.ts).
const Login = lazy(() => import('./pages/admin/Login'));
const CreateUser = lazy(() => import('./pages/admin/CreateUser'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageProjects = lazy(() => import('./pages/admin/ManageProjects'));
const ManageClients = lazy(() => import('./pages/admin/ManageClients'));
const ManageProducts = lazy(() => import('./pages/admin/ManageProducts'));
const ManageOrders = lazy(() => import('./pages/admin/ManageOrders'));
const ManageSiteSettings = lazy(() => import('./pages/admin/ManageSiteSettings'));

// The router is provided by the entry point: BrowserRouter in main.tsx, StaticRouter in entry-server.tsx
function App() {
    return (
        <>
            <ScrollToTop />
            <RouteSEO />
            <Routes>
                {/* ADMIN ROUTES (No Header/Footer) */}
                <Route element={<Suspense fallback={null}><Outlet /></Suspense>}>
                    <Route path="/admin/login" element={<Login />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/users" element={<CreateUser />} />
                        <Route path="/admin/projects" element={<ManageProjects />} />
                        <Route path="/admin/clients" element={<ManageClients />} />
                        <Route path="/admin/products" element={<ManageProducts />} />
                        <Route path="/admin/orders" element={<ManageOrders />} />
                        <Route path="/admin/settings" element={<ManageSiteSettings />} />
                    </Route>
                </Route>

                {/* PUBLIC ROUTES (With Header/Footer) */}
                <Route path="*" element={
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <CookieBanner />
                        <Tracking />
                        <main className="flex-grow">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/servicii" element={<ServicesPage />} />
                                <Route path="/servicii/:slug" element={<ServiceDetailPage />} />
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
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                } />
            </Routes>
        </>
    );
}

export default App;