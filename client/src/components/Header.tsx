import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../lib/cart';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const location = useLocation();

    const { items, itemCount, removeItem, clear } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigation = [
        { name: 'Acasă', href: '/' },
        { name: 'Servicii', href: '/servicii' },
        { name: 'Proiectele noastre', href: '/proiecte' },
        { name: 'Magazin', href: '/magazin' },
        { name: 'Clienți', href: '/clienti' },
        { name: 'Contact', href: '/contact' },
    ];

    const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 font-sans ${
                scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-4'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex-shrink-0 flex items-center gap-3">
                        <img
                            src="/logo.jpeg"
                            alt="Corsican Engineering Logo"
                            className={`transition-all duration-300 ${scrolled ? 'h-12' : 'h-16'} w-auto object-contain`}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`text-lg font-medium uppercase tracking-wide transition-colors duration-200 hover:text-primary ${
                                    location.pathname === item.href
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-gray-600'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Cart icon AFTER Contact */}
                        <div
                            className="relative"
                            onMouseEnter={() => setCartOpen(true)}
                            onMouseLeave={() => setCartOpen(false)}
                        >
                            <Link
                                to="/cos"
                                className="relative text-gray-600 hover:text-primary transition-colors"
                                aria-label="Coș"
                            >
                                <ShoppingCart className="h-7 w-7" />

                                {itemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>

                            <AnimatePresence>
                                {cartOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <p className="font-bold text-gray-900">Coș</p>
                                                {items.length > 0 ? (
                                                    <button
                                                        type="button"
                                                        onClick={clear}
                                                        className="text-xs font-bold text-red-600 hover:underline"
                                                    >
                                                        Golește
                                                    </button>
                                                ) : null}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {items.length === 0 ? 'Coșul este gol.' : 'Produsele adăugate în coș.'}
                                            </p>
                                        </div>

                                        {items.length > 0 && (
                                            <div className="max-h-80 overflow-auto">
                                                {items.map((it) => (
                                                    <div
                                                        key={it.productId}
                                                        className="p-4 flex gap-3 border-b border-gray-50"
                                                    >
                                                        <div className="w-14 h-12 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={it.imageUrl}
                                                                alt={it.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 truncate">
                                                                {it.title}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                {it.quantity} × {it.price} RON
                                                            </p>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(it.productId)}
                                                            className="text-gray-500 hover:text-red-600"
                                                            aria-label="Șterge produs"
                                                            title="Șterge"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="p-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Total</span>
                                                <span className="font-bold text-gray-900">{total} RON</span>
                                            </div>

                                            <Link
                                                to="/cos"
                                                className="mt-3 block w-full text-center bg-slate-900 text-white py-2 rounded-lg font-bold hover:opacity-95"
                                            >
                                                Vezi coșul
                                            </Link>

                                            <Link
                                                to="/checkout"
                                                className="mt-2 block w-full text-center border border-slate-900 text-slate-900 py-2 rounded-lg font-bold hover:bg-slate-50"
                                            >
                                                Finalizare comandă
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-primary focus:outline-none"
                        >
                            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-lg font-medium uppercase tracking-wide ${
                                        location.pathname === item.href
                                            ? 'text-primary bg-neutral-light'
                                            : 'text-gray-600 hover:text-primary hover:bg-neutral-light'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;