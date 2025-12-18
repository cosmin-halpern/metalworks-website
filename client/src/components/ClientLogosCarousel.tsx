import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ClientLogosCarousel: React.FC = () => {
    const [logos, setLogos] = useState<any[]>([]);
    const speed = 30;

    // @ts-ignore
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const SERVER_URL = 'http://localhost:5001';

    useEffect(() => {
        const fetchLogos = async () => {
            try {
                const res = await fetch(`${API_BASE}/clients`);
                const data = await res.json();
                setLogos(data);
            } catch (err) {
                console.error('Failed to load client logos');
            }
        };
        fetchLogos();
    }, [API_BASE]);

    if (logos.length === 0) return null;

    // Duplicate logos for seamless infinite scroll
    const duplicatedLogos = [...logos, ...logos, ...logos];

    return (
        <div className="w-full overflow-hidden bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
                    Clienții noștri
                </h2>

                <div className="relative flex overflow-hidden">
                    <motion.div
                        className="flex gap-12 items-center"
                        animate={{ x: ['0%', '-33.33%'] }}
                        transition={{
                            duration: speed,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                    >
                        {duplicatedLogos.map((client, index) => (
                            <div
                                key={`${client._id}-${index}`}
                                className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
                            >
                                <img
                                    src={`${SERVER_URL}${client.imageUrl}`}
                                    alt={client.name}
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