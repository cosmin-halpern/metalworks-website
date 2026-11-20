import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Images, FileText } from 'lucide-react';
import Banner from '../components/Banner';
import ProductDetailsModal from '../components/ProductDetailsModal';
import { useCart } from '../lib/cart';
import { getApiUrl, getApiBaseUrl } from '../services/env';

type Product = {
    id: number;
    title: string;
    description?: string;
    price: number;
    priceOnRequest?: boolean; // no price shown, "Cere ofertă" instead of "Adaugă în coș"
    imageUrl: string; // "/uploads/..."
    images?: { id: number; src: string }[]; // extra images after imageUrl
    attachments?: { id: number; src: string; name: string }[]; // PDFs
    active: boolean;
};

const Store = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Product | null>(null);

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

    const quoteUrl = (p: Product) => `/contact?produs=${encodeURIComponent(p.title)}`;

    const addToCart = (p: Product) =>
        addItem({
            productId: String(p.id),
            title: p.title,
            price: p.price,
            imageUrl: getFullUrl(p.imageUrl),
        });


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
                backgroundImage="/images/banners/services-banner.jpg"
            />

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Produse</h2>
                            <p className="text-gray-600 mt-1">
                                Alege produsul și apasă „Adaugă în coș”, sau „Cere ofertă” pentru produsele la comandă.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((p, index) => {
                            const productId = String(p.id);
                            const inCart = isInCart(productId);
                            const imageCount = 1 + (p.images?.length ?? 0);
                            const fileCount = p.attachments?.length ?? 0;

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

                                        <div
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                            onClick={() => setSelected(p)}
                                        >
                                            {p.priceOnRequest ? (
                                                <Link
                                                    to={quoteUrl(p)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg hover:bg-gray-100"
                                                >
                                                    Cere ofertă
                                                </Link>
                                            ) : (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(p);
                                                }}
                                                className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg hover:bg-gray-100"
                                            >
                                                {inCart ? 'Adaugă încă unul' : 'Adaugă în coș'}
                                            </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{p.title}</h3>
                                            {p.priceOnRequest ? (
                                                <Link
                                                    to={quoteUrl(p)}
                                                    className="text-primary font-bold whitespace-nowrap hover:underline"
                                                >
                                                    Cere ofertă
                                                </Link>
                                            ) : (
                                                <div className="text-gray-900 font-bold whitespace-nowrap">
                                                    {p.price} RON
                                                </div>
                                            )}
                                        </div>

                                        {p.description ? (
                                            <p className="text-gray-600 line-clamp-3 text-sm">{p.description}</p>
                                        ) : null}
                                    </div>

                                    <div className="px-6 pb-5 flex items-center justify-between gap-4 text-sm">
                                        <button
                                            type="button"
                                            onClick={() => setSelected(p)}
                                            className="font-semibold text-primary hover:underline"
                                        >
                                            Vezi detalii
                                        </button>
                                        <div className="flex items-center gap-3 text-gray-500">
                                            {imageCount > 1 && (
                                                <span className="flex items-center gap-1" title={`${imageCount} imagini`}>
                                                    <Images className="h-4 w-4" /> {imageCount}
                                                </span>
                                            )}
                                            {fileCount > 0 && (
                                                <span className="flex items-center gap-1" title={`${fileCount} documente PDF`}>
                                                    <FileText className="h-4 w-4" /> {fileCount} PDF
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {products.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium">Momentan nu sunt produse disponibile online.</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Pentru rafturi sau mobilier industrial la comandă,{' '}
                                <Link to="/contact" className="font-semibold text-gray-600 hover:underline">
                                    cereți o ofertă
                                </Link>
                                .
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {selected && (
                <ProductDetailsModal
                    product={{
                        title: selected.title,
                        description: selected.description,
                        price: selected.price,
                        priceOnRequest: selected.priceOnRequest,
                        images: [selected.imageUrl, ...(selected.images ?? []).map((m) => m.src)].map(getFullUrl),
                        attachments: (selected.attachments ?? []).map((f) => ({ src: getFullUrl(f.src), name: f.name })),
                    }}
                    onClose={() => setSelected(null)}
                    quoteUrl={quoteUrl(selected)}
                    inCart={isInCart(String(selected.id))}
                    onAddToCart={() => addToCart(selected)}
                />
            )}
        </div>
    );
};

export default Store;