import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import Banner from '../components/Banner';
import ContactForm from '../components/ContactForm';

const ContactPage = () => {
    const contactInfo = [
        {
            icon: Phone,
            title: 'Telefon',
            details: ['+40 (768) 515 774', '+40 (768) 367 563'],
            description: 'Luni - Vineri, 08:00 - 17:00'
        },
        {
            icon: Mail,
            title: 'Email',
            details: ['office@corsican.ro'],
            description: 'Răspundem în maxim 24 de ore'
        },
        {
            icon: MapPin,
            title: 'Locație',
            details: ['România'],
            description: 'Disponibili pentru proiecte naționale'
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Banner
                title="Contactează-ne"
                subtitle="Suntem aici pentru a răspunde întrebărilor tale și pentru a discuta despre viitorul tău proiect"
                backgroundImage="/images/banners/contact-banner.jpg"
                height="h-72 md:h-80"
                backgroundColor="bg-primary-dark"
            />

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Information */}
                        <div className="lg:col-span-1 space-y-8">
                            {contactInfo.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex items-start space-x-4"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="p-3 bg-neutral-light rounded-lg">
                                            <item.icon className="h-6 w-6 text-primary" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                                        {item.details.map((detail) => (
                                            <p key={detail} className="text-primary font-medium">
                                                {detail}
                                            </p>
                                        ))}
                                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;