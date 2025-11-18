import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import CarouselBanner from '../components/CarouselBanner';
import ClientLogosCarousel from '../components/ClientLogosCarousel';

const HomePage = () => {
    const features = [
        'Instalații industriale de țeavă',
        'Structuri metalice',
        'Mobilier industrial',
        'Servicii CNC',
        'Servicii de reparații prin sudare'
    ];

    const heroSlides = [
        {
            image: '/images/homePageBanners/home1.jpg',
            title: 'PERFORMANȚĂ ȘI PRECIZIE ÎN FIECARE PROIECT METALIC',
            subtitle: 'De la concept la montaj'
        },
        {
            image: '/images/homePageBanners/home2.jpg',
            title: 'PERFORMANȚĂ ȘI PRECIZIE ÎN FIECARE PROIECT METALIC',
            subtitle: 'De la concept la montaj'
        },
        {
            image: '/images/homePageBanners/home3.jpg',
            title: 'PERFORMANȚĂ ȘI PRECIZIE ÎN FIECARE PROIECT METALIC',
            subtitle: 'De la concept la montaj'
        },
        {
            image: '/images/homePageBanners/home4.jpg',
            title: 'PERFORMANȚĂ ȘI PRECIZIE ÎN FIECARE PROIECT METALIC',
            subtitle: 'De la concept la montaj'
        },
        {
            image: '/images/homePageBanners/home5.jpg',
            title: 'PERFORMANȚĂ ȘI PRECIZIE ÎN FIECARE PROIECT METALIC',
            subtitle: 'De la concept la montaj'
        }
    ];

    const clientLogos = [
        '/images/sigleClienti/sigla1.jpg',
        '/images/sigleClienti/sigla2.png',
        '/images/sigleClienti/sigla3.png',
        '/images/sigleClienti/sigla4.png',
        '/images/sigleClienti/sigla5.png',
        '/images/sigleClienti/sigla6.png',
        '/images/sigleClienti/sigla7.png',
        '/images/sigleClienti/sigla8.png',
        '/images/sigleClienti/sigla9.png',
        '/images/sigleClienti/sigla10.png',
        '/images/sigleClienti/sigla11.png',
        '/images/sigleClienti/sigla12.png',
        '/images/sigleClienti/sigla13.png',
        '/images/sigleClienti/sigla14.png',
        '/images/sigleClienti/sigla15.png',
        '/images/sigleClienti/sigla16.png',
        '/images/sigleClienti/sigla17.png',
        '/images/sigleClienti/sigla18.png',
        '/images/sigleClienti/sigla19.png',
        '/images/sigleClienti/sigla20.png',
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section - Carousel Banner */}
            <div className="relative">
                <CarouselBanner
                    slides={heroSlides}
                    height="h-screen"
                    autoPlayIntervalMs={6000}
                    cta={
                        <Link
                            to="/contact"
                            // Updated button color
                            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors duration-200 mt-6"
                        >
                            Află mai multe
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    }
                />
            </div>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Oferim soluții complete, precise și durabile, adaptate cerințelor fiecărui proiect
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                // Changed bg-gray-50 to bg-neutral-light
                                className="bg-neutral-light rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="flex items-center space-x-3">
                                    {/* Changed text-blue-600 to text-primary */}
                                    <CheckCircle className="h-6 w-6 text-primary" />
                                    <h3 className="text-xl font-semibold text-gray-900">{feature}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Client Logos Carousel */}
            <ClientLogosCarousel logos={clientLogos} speed={40} />

            {/* CTA Section */}
            <section className="py-20 bg-neutral-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        // Changed bg-blue-600 to bg-primary
                        className="bg-primary rounded-2xl overflow-hidden"
                    >
                        <div className="px-6 py-12 sm:px-12 lg:px-16 text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Hai să găsim soluții împreună
                            </h2>
                            <Link
                                to="/contact"
                                // Updated button color (text-blue-600 -> text-primary, hover:bg-blue-50 -> hover:bg-neutral-light)
                                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-neutral-light transition-colors duration-200"
                            >
                                Contactează-ne
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;