import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Linkedin } from 'lucide-react';
import { FaFacebook } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-primary-dark text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Corsican Engineering</h3>
                        <p className="text-gray-300">
                            Soluții complete în domeniul construcțiilor metalice și prelucrărilor mecanice.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Link-uri rapide</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/servicii" className="text-gray-300 hover:text-white transition-colors">
                                    Servicii
                                </Link>
                            </li>
                            <li>
                                <Link to="/proiecte" className="text-gray-300 hover:text-white transition-colors">
                                    Proiectele noastre
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Informații legale</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/termeni-si-conditii" className="text-gray-300 hover:text-white transition-colors">
                                    Termeni și Condiții
                                </Link>
                            </li>
                            <li>
                                <Link to="/politica-de-confidentialitate" className="text-gray-300 hover:text-white transition-colors">
                                    Politica de Confidențialitate
                                </Link>
                            </li>
                            <li>
                                <Link to="/politica-de-cookies" className="text-gray-300 hover:text-white transition-colors">
                                    Politica de Cookies
                                </Link>
                            </li>
                            <li>
                                <Link to="/politica-de-retur" className="text-gray-300 hover:text-white transition-colors">
                                    Politica de Retur
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-accent" />
                                <span className="text-gray-300">+40 (768) 515 774</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-accent" />
                                <span className="text-gray-300">office@corsican.ro</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <MapPin className="h-5 w-5 text-accent" />
                                <span className="text-gray-300">România</span>
                            </li>
                        </ul>
                        <div className="flex space-x-4 mt-6">
                            <a href="https://www.facebook.com/p/Corsican-Engineering-100064100884554/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                                <FaFacebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                <Linkedin className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Corsican Engineering. Toate drepturile rezervate.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;