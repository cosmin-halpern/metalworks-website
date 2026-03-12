import React, { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { motion } from 'framer-motion';
import ServiceIcon from '../components/ServiceIcon';
import ServiceGalleryModal from '../components/ServiceGalleryModal';
import type { Service } from '../types';
import Banner from '../components/Banner';

// 3 services only
const services: Service[] = [
    {
        id: 'proiectare',
        title: 'Proiectare',
        description:
            'Proiectare și consultanță pentru structuri și echipamente metalice, adaptate cerințelor fiecărui proiect.',
        icon: 'proiectare'
    },
    {
        id: 'executie',
        title: 'Execuție',
        description:
            'Execuție și fabricație de componente și structuri metalice, cu accent pe precizie și calitate.',
        icon: 'executie'
    },
    {
        id: 'montaj',
        title: 'Montaj',
        description:
            'Montaj și instalare la fața locului pentru sisteme și structuri metalice industriale.',
        icon: 'montaj'
    }
];

// galleries for each service – you can add more images here
const serviceGalleries: Record<string, string[]> = {
    proiectare: [
        '/images/servicesImagesGaleries/proiectare/proiectare1.jpg',
        '/images/servicesImagesGaleries/proiectare/proiectare2.png',
        '/images/servicesImagesGaleries/proiectare/proiectare3.jpg',
        '/images/servicesImagesGaleries/proiectare/proiectare4.jpg',
        '/images/servicesImagesGaleries/proiectare/proiectare5.jpg',
        '/images/servicesImagesGaleries/proiectare/proiectare6.jpg',
        '/images/servicesImagesGaleries/proiectare/proiectare7.jpg',
        '/images/servicesImagesGaleries/proiectare/proiectare8.jpg',
        '/images/servicesImagesGaleries/proiectare/proiectare9.jpg',
        '/images/servicesImagesGaleries/proiectare/proiectare10.jpg',
        '/images/servicesImagesGaleries/proiectare/proiectare11.jpg'
    ],
    executie: [
        '/images/servicesImagesGaleries/executie/executie1.jpg',
        '/images/servicesImagesGaleries/executie/executie2.jpg',
        '/images/servicesImagesGaleries/executie/executie3.jpg',
        '/images/servicesImagesGaleries/executie/executie4.jpg',
        '/images/servicesImagesGaleries/executie/executie5.jpg',
        '/images/servicesImagesGaleries/executie/executie6.jpg',
        '/images/servicesImagesGaleries/executie/executie7.jpg',
        '/images/servicesImagesGaleries/executie/executie8.jpg',
        '/images/servicesImagesGaleries/executie/executie9.jpg',
        '/images/servicesImagesGaleries/executie/executie10.jpg',
        '/images/servicesImagesGaleries/executie/executie11.jpg',
        '/images/servicesImagesGaleries/executie/executie12.jpg',
        '/images/servicesImagesGaleries/executie/executie13.jpg'
    ],
    montaj: [
        '/images/servicesImagesGaleries/montaj/montaj1.jpg',
        '/images/servicesImagesGaleries/montaj/montaj2.jpg',
        '/images/servicesImagesGaleries/montaj/montaj3.jpg',
        '/images/servicesImagesGaleries/montaj/montaj4.jpg',
        '/images/servicesImagesGaleries/montaj/montaj5.jpg',
        '/images/servicesImagesGaleries/montaj/montaj6.jpg'
    ]
};

const ServicesPage: React.FC = () => {
    useSEO({
        title: 'Servicii – CNC, Sudare, Structuri Metalice, Instalații Țeavă',
        description: 'Servicii complete de prelucrare metalică: construcții metalice, servicii CNC, sudare, instalații industriale de țeavă și montaj în România.',
        canonical: 'https://www.corsican.ro/servicii',
    });

    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

    const selectedService = services.find((s) => s.id === selectedServiceId);

    return (
        <div className="min-h-screen bg-white">
            {/* Page Banner */}
            <Banner
                title="Serviciile noastre"
                subtitle="Proiectare, execuție și montaj pentru structuri și echipamente metalice"
                backgroundImage="/images/banners/banner01.webp"
                height="h-72 md:h-80"
                backgroundColor="bg-primary-dark"
            />

            {/* Services Section */}
            <section className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-20"
                    >
                        {/* UPDATED CLASS: removed 'font-semibold text-lg', added 'text-gray-600 max-w-2xl mx-auto' to match ClientsPage */}
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium font-sans">
                            Oferim servicii complete de proiectare, execuție și montaj pentru structuri și echipamente metalice.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="bg-neutral-light rounded-2xl p-12 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-200 min-h-[400px]"
                            >
                                <ServiceIcon iconKey={service.icon} className="h-20 w-20 mb-8" />

                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    {service.title}
                                </h2>
                                <p className="text-base text-gray-600 mb-8 flex-1 leading-relaxed">
                                    {service.description}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setSelectedServiceId(service.id)}
                                    className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-primary hover:text-primary-dark border border-primary hover:border-primary-dark rounded-lg transition-colors"
                                >
                                    Vezi galerie
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Modal */}
            <ServiceGalleryModal
                open={!!selectedService}
                onClose={() => setSelectedServiceId(null)}
                serviceTitle={selectedService?.title ?? ''}
                images={selectedService ? serviceGalleries[selectedService.id] ?? [] : []}
            />
        </div>
    );
};

export default ServicesPage;