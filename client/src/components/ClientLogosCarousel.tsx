import React from 'react';
import { motion } from 'framer-motion';

type ClientLogosCarouselProps = {
    logos: string[]; // array of logo image paths
    speed?: number; // seconds for one full loop
};

const ClientLogosCarousel: React.FC<ClientLogosCarouselProps> = ({
                                                                     logos,
                                                                     speed = 30
                                                                 }) => {
    // Duplicate logos for seamless infinite scroll
    const duplicatedLogos = [...logos, ...logos];

    return (
        <div className="w-full overflow-hidden bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
                    Clienții noștri
                </h2>

                <div className="relative flex overflow-hidden">
                    <motion.div
                        className="flex gap-12 items-center"
                        animate={{
                            x: ['0%', '-50%']
                        }}
                        transition={{
                            duration: speed,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                    >
                        {duplicatedLogos.map((logo, index) => (
                            <div
                                key={`${logo}-${index}`}
                                className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
                            >
                                <img
                                    src={logo}
                                    alt={`Client logo ${index + 1}`}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ClientLogosCarousel;