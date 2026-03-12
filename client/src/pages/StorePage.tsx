import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Banner from '../components/Banner';
import { useCart } from '../lib/cart';
import { getApiUrl, getApiBaseUrl } from '../services/env';
import { useSEO } from '../hooks/useSEO';

type Product = {
    id: number;
    title: string;
    description?: string;
    price: number;
    imageUrl: string; // "/uploads/..."
    active: boolean;
};

const Store = () => {
    useSEO({
        title: 'Magazin – Rafturi Industriale și Mobilier Industrial',
        description: 'Cumpără rafturi industriale, mobilier industrial și echipamente metalice. Produse de calitate pentru depozite și spații industriale din România.',
        canonical: 'https://www.corsican.ro/magazin',
    });

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const { addItem, items } = useCart();

    const API_BASE = getApiUrl();
    const SERVER_URL = getApiBaseUrl();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE}/products`);
                const data = await res.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to load products:', err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [API_BASE]);

    const getFullUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${SERVER_URL}${path}`;
    };

    const isInCart = (productId: string) => items.some((it) => it.productId === productId);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Banner
                title="Magazin"
                subtitle="Produse disponibile – adaugă rapid în coș"
                backgroundImage="/images/banners/services-banner.png"
            />

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Produse</h2>
                            <p className="text-gray-600 mt-1">Alege produsul și apasă „Adaugă în coș”.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((p, index) => {
                            const productId = String(p.id);
                            const inCart = isInCart(productId);

                            return (
                                <motion.div
                                    key={productId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={getFullUrl(p.imageUrl)}
                                            alt={p.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />

                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addItem({
                                                        productId,
                                                        title: p.title,
                                                        price: p.price,
                                                        imageUrl: getFullUrl(p.imageUrl),
                                                    })
                                                }
                                                className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg hover:bg-gray-100"
                                            >
                                                {inCart ? 'Adaugă încă unul' : 'Adaugă în coș'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{p.title}</h3>
                                            <div className="text-gray-900 font-bold whitespace-nowrap">
                                                {p.price} RON
                                            </div>
                                        </div>

                                        {p.description ? (
                                            <p className="text-gray-600 line-clamp-3 text-sm">{p.description}</p>
                                        ) : null}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {products.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium">Momentan nu există produse încărcate.</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Accesați panoul de administrare pentru a adăuga produse noi.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Store;