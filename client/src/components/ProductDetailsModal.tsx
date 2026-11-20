import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

export type ProductDetails = {
    title: string;
    description?: string;
    price: number;
    priceOnRequest?: boolean;
    /** Main image first, then the extra ones (full URLs) */
    images: string[];
    attachments: { src: string; name: string }[];
};

type ProductDetailsModalProps = {
    product: ProductDetails;
    onClose: () => void;
    quoteUrl: string;
    inCart: boolean;
    onAddToCart: () => void;
};

const ProductDetailsModal = ({ product, onClose, quoteUrl, inCart, onAddToCart }: ProductDetailsModalProps) => {
    const [index, setIndex] = useState(0);
    const { images } = product;
    const count = images.length;

    const next = () => setIndex((i) => (i + 1) % count);
    const prev = () => setIndex((i) => (i - 1 + count) % count);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (count > 1 && e.key === 'ArrowRight') next();
            if (count > 1 && e.key === 'ArrowLeft') prev();
        };
        window.addEventListener('keydown', handler);
        // Keep the page behind from scrolling while the dialog is open
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handler);
            document.body.style.overflow = overflow;
        };
    });

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClose}
        >
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={product.title}
                className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl grid grid-cols-1 md:grid-cols-2"
                initial={{ scale: 0.97, y: 16, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 text-gray-700 shadow hover:bg-white"
                    aria-label="Închide"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Images */}
                <div className="bg-gray-100 flex flex-col">
                    <div className="relative aspect-[4/3] flex items-center justify-center bg-gray-100">
                        <img
                            key={images[index]}
                            src={images[index]}
                            alt={count > 1 ? `${product.title} – imaginea ${index + 1}` : product.title}
                            className="max-h-full max-w-full object-contain"
                        />
                        {count > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={prev}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                                    aria-label="Imaginea anterioară"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={next}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                                    aria-label="Imaginea următoare"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                                <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                                    {index + 1} / {count}
                                </div>
                            </>
                        )}
                    </div>

                    {count > 1 && (
                        <div className="flex gap-2 overflow-x-auto p-3">
                            {images.map((src, i) => (
                                <button
                                    key={src}
                                    type="button"
                                    onClick={() => setIndex(i)}
                                    className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                                        i === index ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                                    }`}
                                    aria-label={`Imaginea ${i + 1}`}
                                >
                                    <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="p-6 md:p-8 flex flex-col gap-5">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 pr-8">{product.title}</h2>
                        <p className="mt-2 text-xl font-bold text-gray-900">
                            {product.priceOnRequest ? 'Preț la cerere' : `${product.price} RON`}
                        </p>
                    </div>

                    {product.description ? (
                        <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                    ) : null}

                    {product.attachments.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Documente</h3>
                            <ul className="space-y-2">
                                {product.attachments.map((file) => (
                                    <li key={file.src}>
                                        <a
                                            href={file.src}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 text-gray-800 hover:border-primary hover:text-primary"
                                        >
                                            <FileText className="h-5 w-5 flex-shrink-0 text-red-600" />
                                            <span className="truncate">{file.name || 'Fișier PDF'}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mt-auto pt-2">
                        {product.priceOnRequest ? (
                            <Link
                                to={quoteUrl}
                                className="block w-full rounded-full bg-primary px-6 py-3 text-center font-bold text-white hover:bg-primary-dark"
                            >
                                Cere ofertă
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={onAddToCart}
                                className="w-full rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-primary-dark"
                            >
                                {inCart ? 'Adaugă încă unul' : 'Adaugă în coș'}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ProductDetailsModal;
