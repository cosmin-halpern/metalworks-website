import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

type ProjectMedia = {
    type: 'image' | 'video';
    src: string;
};

type ProjectGalleryModalProps = {
    open: boolean;
    onClose: () => void;
    projectTitle: string;
    media: ProjectMedia[];
};

const ProjectGalleryModal: React.FC<ProjectGalleryModalProps> = ({
                                                                     open,
                                                                     onClose,
                                                                     projectTitle,
                                                                     media
                                                                 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const hasMedia = media && media.length > 0;
    const currentItem = hasMedia ? media[currentIndex] : null;

    const nextItem = () => {
        if (!hasMedia) return;
        setCurrentIndex((prev) => (prev + 1) % media.length);
    };

    const prevItem = () => {
        if (!hasMedia) return;
        setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
    };

    // reset index when re-opening or changing project
    useEffect(() => {
        if (open) setCurrentIndex(0);
    }, [open, projectTitle]);

    // keyboard controls
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') nextItem();
            if (e.key === 'ArrowLeft') prevItem();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    });

    if (!open) return null;

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
                                Galerie proiect – {projectTitle}
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

                        {/* Main media area */}
                        <div className="relative bg-black flex items-center justify-center">
                            {!hasMedia && (
                                <div className="py-16 px-6 text-center">
                                    <p className="text-gray-300">
                                        Galeria va fi disponibilă în curând.
                                    </p>
                                </div>
                            )}

                            {hasMedia && currentItem && (
                                <>
                                    {currentItem.type === 'image' && (
                                        <motion.img
                                            key={currentItem.src}
                                            src={currentItem.src}
                                            alt={projectTitle}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.02 }}
                                            transition={{ duration: 0.3 }}
                                            className="max-h-[70vh] w-auto object-contain select-none"
                                        />
                                    )}

                                    {currentItem.type === 'video' && (
                                        <motion.video
                                            key={currentItem.src}
                                            src={currentItem.src}
                                            controls
                                            controlsList="nodownload"
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.02 }}
                                            transition={{ duration: 0.3 }}
                                            className="max-h-[70vh] w-auto object-contain bg-black"
                                        />
                                    )}

                                    {/* Prev / Next arrows */}
                                    {media.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={prevItem}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 text-white p-2 hover:bg-black/80"
                                                aria-label="Elementul anterior"
                                            >
                                                <ChevronLeft className="h-6 w-6" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={nextItem}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 text-white p-2 hover:bg-black/80"
                                                aria-label="Elementul următor"
                                            >
                                                <ChevronRight className="h-6 w-6" />
                                            </button>
                                        </>
                                    )}

                                    {/* Counter */}
                                    <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-xs text-gray-200">
                                        {currentIndex + 1} / {media.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {hasMedia && media.length > 1 && (
                            <div className="border-t border-gray-800 bg-gray-900 px-4 py-3 overflow-x-auto">
                                <div className="flex space-x-2">
                                    {media.map((item, index) => (
                                        <button
                                            key={`${item.src}-${index}`}
                                            type="button"
                                            onClick={() => setCurrentIndex(index)}
                                            className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border ${
                                                index === currentIndex
                                                    ? 'border-blue-500'
                                                    : 'border-transparent'
                                            }`}
                                        >
                                            {item.type === 'image' ? (
                                                <img
                                                    src={item.src}
                                                    alt={projectTitle}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-black flex items-center justify-center text-white">
                                                    <Play className="h-6 w-6" />
                                                </div>
                                            )}

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

export default ProjectGalleryModal;