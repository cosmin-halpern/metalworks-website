import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Banner from "../components/Banner";

const HomePage = () => {
  const features = [
    'Custom Metal Fabrication',
    'CNC Machining',
    'Welding Services',
    'Metal Finishing',
    'Quality Assurance',
    'Expert Consultation',
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Using the new Banner component */}
      <Banner
        title="Precision Metal Fabrication"
        subtitle="Crafting excellence in metal since 1995"
        backgroundImage="/images/banners/hero-bg.jpg"
        height="h-screen"
        backgroundColor="bg-gradient-to-r from-gray-900 to-gray-800"
      >
        <Link
          to="/contact"
          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Banner>

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
              Why Choose Metalworks?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with traditional craftsmanship to deliver exceptional results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">{feature}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-blue-600 rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-12 sm:px-12 lg:px-16 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Contact us today for a free consultation and quote.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200"
              >
                Contact Us
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