import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getApiUrl } from '../services/env';
import { servicePages } from '../data/services';
import { trackEvent } from '../lib/googleTag';
import { trackLead } from '../lib/metaPixel';

const OTHER_SERVICE = 'Alt serviciu';

type FormState = {
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    website: string; // honeypot, hidden from people
};

const inputClass =
    'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border';

const ContactForm = () => {
    const [searchParams] = useSearchParams();
    // Service pages link here as /contact?serviciu=<slug>
    const preselected = servicePages.find((s) => s.slug === searchParams.get('serviciu'))?.name ?? '';

    const [form, setForm] = useState<FormState>({
        name: '',
        email: '',
        phone: '',
        service: preselected,
        message: '',
        website: '',
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (form.phone.replace(/\D/g, '').length < 9 && !form.email.trim()) {
            setStatus('error');
            setError('Lăsați un număr de telefon sau o adresă de e-mail ca să vă putem răspunde.');
            return;
        }

        setStatus('submitting');
        try {
            const res = await fetch(`${getApiUrl()}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                setStatus('error');
                setError(data?.msg || 'Mesajul nu a putut fi trimis. Vă rugăm să ne sunați la +40 768 515 774.');
                return;
            }
            trackEvent('generate_lead', { form: 'contact', service: form.service || OTHER_SERVICE });
            trackLead(form.service || OTHER_SERVICE);
            setStatus('success');
        } catch {
            setStatus('error');
            setError('Nu s-a putut contacta serverul. Verificați conexiunea sau sunați-ne la +40 768 515 774.');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-white p-8 rounded-lg shadow-lg text-center" role="status">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Mulțumim, mesajul a fost trimis!</h2>
                <p className="text-gray-600">
                    Vă răspundem în maxim 24 de ore. Pentru urgențe, sunați-ne la{' '}
                    <a href="tel:+40768515774" className="text-primary font-medium">+40 768 515 774</a>.
                </p>
            </div>
        );
    }

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="relative space-y-6 bg-white p-8 rounded-lg shadow-lg"
        >
            <h2 className="text-2xl font-bold text-gray-900">Solicită o ofertă</h2>

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nume complet
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    value={form.name}
                    onChange={update('name')}
                    className={inputClass}
                    placeholder="Ion Popescu"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Telefon
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        maxLength={30}
                        autoComplete="tel"
                        value={form.phone}
                        onChange={update('phone')}
                        className={inputClass}
                        placeholder="07xx xxx xxx"
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
                        maxLength={150}
                        autoComplete="email"
                        value={form.email}
                        onChange={update('email')}
                        className={inputClass}
                        placeholder="ion@exemplu.ro"
                    />
                </div>
            </div>
            <p className="text-xs text-gray-500 -mt-4">Completați cel puțin telefonul sau adresa de e-mail.</p>

            <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                    Serviciu
                </label>
                <select id="service" name="service" value={form.service} onChange={update('service')} className={inputClass}>
                    <option value="">Alegeți (opțional)</option>
                    {servicePages.map((s) => (
                        <option key={s.slug} value={s.name}>
                            {s.name}
                        </option>
                    ))}
                    <option value={OTHER_SERVICE}>{OTHER_SERVICE}</option>
                </select>
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Mesaj
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    minLength={10}
                    maxLength={5000}
                    value={form.message}
                    onChange={update('message')}
                    className={inputClass}
                    placeholder="Descrieți pe scurt proiectul: ce aveți nevoie, dimensiuni, locație, termen."
                />
            </div>

            {/* Honeypot: invisible to people, bots tend to fill every field */}
            <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
            </div>

            {status === 'error' && error && (
                <p className="text-red-600 text-sm" role="alert">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={status === 'submitting'}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
                    status === 'submitting' ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
                }`}
            >
                {status === 'submitting' ? 'Se trimite...' : 'Trimite cererea'}
            </button>

            <p className="text-xs text-gray-500">
                Folosim datele doar pentru a vă răspunde la cerere. Detalii în{' '}
                <a href="/politica-de-confidentialitate" className="underline">
                    Politica de Confidențialitate
                </a>
                .
            </p>
        </motion.form>
    );
};

export default ContactForm;
