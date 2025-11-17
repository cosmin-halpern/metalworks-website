import {motion} from 'framer-motion';
import {Link} from 'react-router-dom';
import {ArrowRight, Briefcase} from 'lucide-react';
import Banner from '../components/Banner';

const projects = [
    {
        title: 'Instalații de țeavă',
        description:
            'Montăm instalații industriale de țeavă pentru fluide ( glicol, amoniac, CO2). Avem sudori și omologări TUV, Intertek',
        image: '/public/shelf-1.jpg',
    },
    {
        title: 'Rafturi industriale',
        description: 'Producem rafturi metalice personalizate, create pentru a maximiza spațiul și productivitatea',
        image: '/public/shelf-2.jpg',
    },
    {
        title: 'Structuri metalice',
        description:
            'Executăm structuri metalice complexe, concepute pe termen lung',
        image: '/public/shelf-3.jpg',
    },
    {
        title: 'Protecții din inox',
        description: 'Fabricăm protecții și balustrade din inox care îmbină rezistența cu un finisaj impecabil',
        image: '/public/shelf-4.jpg',
    },
    {
        title: 'Cărucioare de marfă',
        description: 'Producem cărucioare robuste și ergonomice pentru manipulare marfă',
        image: '/public/shelf-4.jpg',
    },
    {
        title: 'Terase metalice',
        description: 'Construim terase metalice durabile, adaptate oricărui spațiu și stil arhitectural',
        image: '/public/shelf-4.jpg',
    },
];

const WorkPage = () => {
    return (
        <div className="min-h-screen">
            {/* Banner Section - Using the new Banner component */}
            <Banner
                title="Proiectele noastre"
                subtitle="Proiectele noastre vorbesc de la sine – descoperă profesionalismul în detalii"
                backgroundImage="/images/banners/work-banner.jpg"
                height="h-64"
            />

            {/* Projects Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.5}}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Descoperă portofoliul
                            nostru</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Mai jos îți oferim detalii despre câteva dintre proiectele noastre
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, idx) => (
                            <motion.div
                                key={project.title}
                                initial={{opacity: 0, y: 20}}
                                whileInView={{opacity: 1, y: 0}}
                                viewport={{once: true}}
                                transition={{duration: 0.5, delay: idx * 0.1}}
                                className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col"
                            >
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-40 object-cover rounded mb-4"
                                />
                                <div className="flex items-center space-x-3 mb-2">
                                    <Briefcase className="h-6 w-6 text-blue-600"/>
                                    <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                                </div>
                                <p className="text-gray-700 flex-grow">{project.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.5}}
                        className="bg-blue-600 rounded-2xl overflow-hidden"
                    >
                        <div className="px-6 py-12 sm:px-12 lg:px-16 text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">Planifici un nou proiect?</h2>
                            <p className="text-xl text-blue-100 mb-8">
                                Discută cu noi soluțiile potrivite.
                            </p>
                            <Link
                                to="/contact"
                                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200"
                            >
                                Contactează-ne
                                <ArrowRight className="ml-2 h-5 w-5"/>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default WorkPage;
