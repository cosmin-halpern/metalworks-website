import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundColor?: string; // Tailwind class like 'bg-gradient-to-r from-gray-900 to-gray-800'
  height?: string; // Tailwind class like 'h-screen' or 'h-72'
  children?: React.ReactNode; // For additional content like buttons
}

// Cache for preloaded images
const preloadedImages = new Set<string>();

const Banner: React.FC<BannerProps> = ({
  title,
  subtitle,
  backgroundImage,
  backgroundColor = 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900', // Updated default background
  height = 'h-72', // Default height
  children,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (backgroundImage) {
      // If image is already preloaded, show it immediately
      if (preloadedImages.has(backgroundImage)) {
        setIsImageLoaded(true);
        return;
      }

      const img = new Image();
      img.src = backgroundImage;
      img.onload = () => {
        preloadedImages.add(backgroundImage);
        setIsImageLoaded(true);
      };
    }
  }, [backgroundImage]);

  return (
    <section
      className={`relative ${height} flex items-center justify-center text-white overflow-hidden ${backgroundColor}`}
    >
      {/* Background Image */}
      <AnimatePresence mode="wait">
        {backgroundImage && (
          <motion.div 
            key={backgroundImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: isImageLoaded ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url('${backgroundImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-lg md:text-xl text-blue-100 drop-shadow-sm"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Banner; 