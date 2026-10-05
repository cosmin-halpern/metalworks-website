import React from 'react';
import { motion } from 'framer-motion';
import Banner from '../components/Banner';
import { clientLogos } from '../data/clientLogos';

const ClientsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <Banner
                title="Clienții noștri"
                subtitle="Suntem mândri să colaborăm cu companii de renume din industrie"
                backgroundImage="/images/banners/banner01.webp"
                height="h-72 md:h-80"
                backgroundColor="bg-primary-dark"
            />

            <section className="py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        {/* APPLIED STANDARD CLASS */}
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium font-sans">
                            De-a lungul anilor am construit parteneriate solide cu companii din diverse sectoare industriale.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {clientLogos.map((logo, index) => (
                            <motion.div
                                key={logo}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center hover:shadow-lg transition-shadow duration-200"
                            >
                                <img
                                    src={logo}
                                    alt={`Client ${index + 1}`}
                                    className="max-w-full max-h-20 object-contain"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ClientsPage;