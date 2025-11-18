import { useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type CarouselSlide = {
    image: string;
    title: string;
    subtitle?: string;
};

type CarouselBannerProps = {
    slides: CarouselSlide[];
    height?: string; // e.g. "h-screen" or "h-[70vh]"
    autoPlayIntervalMs?: number;
    cta?: ReactNode; // optional button/link rendered under subtitle
};

const CarouselBanner: React.FC<CarouselBannerProps> = ({
                                                           slides,
                                                           height = 'h-screen',
                                                           autoPlayIntervalMs = 5000,
                                                           cta
                                                       }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (slides.length <= 1) return;

        const id = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, autoPlayIntervalMs);

        return () => clearInterval(id);
    }, [slides.length, autoPlayIntervalMs]);

    const currentSlide = slides[currentIndex];

    return (
        // Changed bg-black to bg-primary-dark
        <section className={`relative w-full ${height} overflow-hidden bg-primary-dark`}>
            {/* Background images */}
            <div className="absolute inset-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide.image}
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0"
                    >
                        <div
                            className="w-full h-full bg-center bg-cover"
                            style={{ backgroundImage: `url(${currentSlide.image})` }}
                        />
                        <div className="absolute inset-0 bg-black/50" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                    <motion.h1
                        key={currentSlide.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight"
                    >
                        {currentSlide.title}
                    </motion.h1>

                    {currentSlide.subtitle && (
                        <motion.p
                            key={currentSlide.subtitle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="text-lg md:text-xl text-gray-100 mb-6"
                        >
                            {currentSlide.subtitle}
                        </motion.p>
                    )}

                    {cta && (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                        >
                            {cta}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 w-2 rounded-full transition-all ${
                            index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default CarouselBanner;