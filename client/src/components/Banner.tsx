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
                                           backgroundColor = 'bg-primary-dark', // Changed default
                                       }) => {
    return (
        <div className={`relative w-full ${height} overflow-hidden ${backgroundColor}`}>
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
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 max-w-4xl"
                >
                    {title}
                </motion.h1>

                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg sm:text-xl text-gray-200 max-w-2xl mb-8"
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