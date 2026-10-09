import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import CarouselBanner from '../components/CarouselBanner';
import ClientLogosCarousel from '../components/ClientLogosCarousel';

const HomePage = () => {
    // Items with a service page link to it
    const features: { name: string; href?: string }[] = [
        { name: 'Instalații industriale de țeavă', href: '/servicii/instalatii-industriale-de-teava' },
        { name: 'Structuri metalice', href: '/servicii/structuri-metalice' },
        { name: 'Rafturi industriale', href: '/servicii/rafturi-industriale' },
        { name: 'Mobilier industrial', href: '/servicii/mobilier-industrial-si-terase-metalice' },
        { name: 'Servicii CNC' },
        { name: 'Servicii de reparații prin sudare' }
    ];

    // The slide title is the page's H1, so it names what we do; the slogan is the subtitle
    const heroTitle = 'Structuri metalice, instalații industriale și rafturi';
    const heroSubtitle = 'Performanță și precizie în fiecare proiect metalic – de la concept la soluția finală';

    const heroSlides = [
        {
            image: '/images/homePageBanners/home1.jpg',
            title: heroTitle,
            subtitle: heroSubtitle
        },
        {
            image: '/images/homePageBanners/home2.jpg',
            title: heroTitle,
            subtitle: heroSubtitle
        },
        {
            image: '/images/homePageBanners/home3.jpg',
            title: heroTitle,
            subtitle: heroSubtitle
        },
        {
            image: '/images/homePageBanners/home4.jpg',
            title: heroTitle,
            subtitle: heroSubtitle
        },
        {
            image: '/images/homePageBanners/home5.jpg',
            title: heroTitle,
            subtitle: heroSubtitle
        }
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

                    {/* Changed from Grid to Flex for centered alignment */}
                    <div className="flex flex-wrap justify-center gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                // Using flex-basis to size items roughly like columns but allowing centering
                                className="bg-neutral-light rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)]"
                            >
                                {feature.href ? (
                                    <Link to={feature.href} className="group flex items-center space-x-3 h-full">
                                        <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors flex-1">
                                            {feature.name}
                                        </h3>
                                        <ArrowRight className="h-5 w-5 text-primary flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ) : (
                                    <div className="flex items-center space-x-3 h-full">
                                        <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                                        <h3 className="text-xl font-semibold text-gray-900">{feature.name}</h3>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Client Logos Carousel */}
            <ClientLogosCarousel />

            {/* CTA Section */}
            <section className="py-20 bg-neutral-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-primary rounded-2xl overflow-hidden"
                    >
                        <div className="px-6 py-12 sm:px-12 lg:px-16 text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Hai să găsim soluții împreună
                            </h2>
                            <Link
                                to="/contact"
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