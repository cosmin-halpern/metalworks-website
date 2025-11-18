import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type ServiceGalleryModalProps = {
    open: boolean;
    onClose: () => void;
    serviceTitle: string;
    images: string[];
};

const ServiceGalleryModal: React.FC<ServiceGalleryModalProps> = ({
                                                                     open,
                                                                     onClose,
                                                                     serviceTitle,
                                                                     images
                                                                 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // reset index when service changes or modal re-opens
    useEffect(() => {
        if (open) {
            setCurrentIndex(0);
        }
    }, [open, serviceTitle]);

    // close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    });

    if (!open) return null;

    const hasImages = images && images.length > 0;
    const currentImage = hasImages ? images[currentIndex] : null;

    const nextImage = () => {
        if (!hasImages) return;
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        if (!hasImages) return;
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="relative w-full max-w-6xl mx-4 bg-gray-900 rounded-lg shadow-xl overflow-hidden"
                        initial={{ scale: 0.95, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: 20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
                            <h2 className="text-lg md:text-xl font-semibold text-white">
                                Galerie – {serviceTitle}
                            </h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-400 hover:text-white"
                                aria-label="Închide"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Main image area */}
                        <div className="relative bg-black flex items-center justify-center">
                            {!hasImages && (
                                <div className="py-16 px-6 text-center">
                                    <p className="text-gray-300">
                                        Galeria va fi disponibilă în curând.
                                    </p>
                                </div>
                            )}

                            {hasImages && currentImage && (
                                <>
                                    {/* Large image */}
                                    <motion.img
                                        key={currentImage}
                                        src={currentImage}
                                        alt={serviceTitle}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        transition={{ duration: 0.3 }}
                                        className="max-h-[70vh] w-auto object-contain select-none"
                                    />

                                    {/* Prev / Next arrows */}
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 text-white p-2 hover:bg-black/80"
                                                aria-label="Imaginea anterioară"
                                            >
                                                <ChevronLeft className="h-6 w-6" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 text-white p-2 hover:bg-black/80"
                                                aria-label="Imaginea următoare"
                                            >
                                                <ChevronRight className="h-6 w-6" />
                                            </button>
                                        </>
                                    )}

                                    {/* Counter */}
                                    <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-xs text-gray-200">
                                        {currentIndex + 1} / {images.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {hasImages && images.length > 1 && (
                            <div className="border-t border-gray-800 bg-gray-900 px-4 py-3 overflow-x-auto">
                                <div className="flex space-x-2">
                                    {images.map((src, index) => (
                                        <button
                                            key={src}
                                            type="button"
                                            onClick={() => setCurrentIndex(index)}
                                            className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border ${
                                                index === currentIndex
                                                    ? 'border-blue-500'
                                                    : 'border-transparent'
                                            }`}
                                        >
                                            <img
                                                src={src}
                                                alt={serviceTitle}
                                                className="h-full w-full object-cover"
                                            />
                                            {index === currentIndex && (
                                                <span className="absolute inset-0 ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900 pointer-events-none" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ServiceGalleryModal;