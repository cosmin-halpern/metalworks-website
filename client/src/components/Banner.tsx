import React from 'react';
import { motion } from 'framer-motion';

interface BannerProps {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
    height?: string;
    children?: React.ReactNode;
    backgroundColor?: string;
}

const Banner: React.FC<BannerProps> = ({
                                           title,
                                           subtitle,
                                           backgroundImage,
                                           height = 'h-96',
                                           children,
                                           backgroundColor = 'bg-primary-dark',
                                       }) => {
    return (
        <div className={`relative w-full ${height} overflow-hidden ${backgroundColor} font-sans`}>
            {/* Background Image */}
            {backgroundImage && (
                <div className="absolute inset-0 w-full h-full">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    // Reduced sizes: text-3xl -> text-2xl, sm:text-4xl -> sm:text-3xl, etc.
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 max-w-4xl uppercase tracking-wider"
                >
                    {title}
                </motion.h1>

                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        // Reduced sizes: text-lg -> text-base, sm:text-xl -> sm:text-lg
                        className="text-base sm:text-lg text-gray-200 max-w-2xl mb-8 font-light tracking-wide"
                    >
                        {subtitle}
                    </motion.p>
                )}

                {children && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {children}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Banner;