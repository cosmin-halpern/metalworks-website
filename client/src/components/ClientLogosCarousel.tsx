import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {getApiBaseUrl, getApiUrl} from "../services/env.ts";
import { clientLogos } from '../data/clientLogos';

type Logo = { key: string; src: string; alt: string };

const staticLogos: Logo[] = clientLogos.map((src, index) => ({
    key: src,
    src,
    alt: `Client ${index + 1}`,
}));

const ClientLogosCarousel: React.FC = () => {
    const [uploadedLogos, setUploadedLogos] = useState<Logo[]>([]);

    const API_URL = getApiUrl();
    const SERVER_URL = getApiBaseUrl() || window.location.origin;

    useEffect(() => {
        const fetchLogos = async () => {
            try {
                const res = await fetch(`${API_URL}/clients`);
                const data = await res.json();
                setUploadedLogos(
                    data.map((client: any) => ({
                        key: `uploaded-${client.id}`,
                        src: `${SERVER_URL}${client.src}`,
                        alt: client.name,
                    }))
                );
            } catch (err) {
                console.error('Failed to load client logos');
            }
        };
        fetchLogos();
    }, [API_URL, SERVER_URL]);

    const logos = [...staticLogos, ...uploadedLogos];
    if (logos.length === 0) return null;

    // ~3s per logo keeps the scroll speed constant regardless of how many logos there are
    const speed = logos.length * 3;

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
                        {duplicatedLogos.map((logo, index) => (
                            <div
                                key={`${logo.key}-${index}`}
                                className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
                            >
                                <img
                                    src={logo.src}
                                    alt={logo.alt}
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
