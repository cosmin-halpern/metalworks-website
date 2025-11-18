import { useState } from 'react';
import { motion } from 'framer-motion';

const ContactForm = () => {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            // Reset form here if needed
        }, 1000);
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-8 rounded-lg shadow-lg"
        >
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nume complet
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border"
                    placeholder="Ion Popescu"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border"
                    placeholder="ion@exemplu.ro"
                />
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Telefon
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border"
                    placeholder="07xx xxx xxx"
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Mesaj
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border"
                    placeholder="Cum vă putem ajuta?"
                />
            </div>

            <button
                type="submit"
                disabled={status === 'submitting'}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
                    status === 'submitting'
                        ? 'bg-primary/70 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary-dark'
                }`}
            >
                {status === 'submitting' ? 'Se trimite...' : 'Trimite mesajul'}
            </button>

            {status === 'success' && (
                <div className="text-green-600 text-center">
                    Mesajul a fost trimis cu succes! Vă vom contacta în curând.
                </div>
            )}
        </motion.form>
    );
};

export default ContactForm;