import { useState } from 'react';
import { MapPin } from 'lucide-react';

const ADDRESS = 'Bulevardul Eroilor 81, Voluntari, Ilfov';
// Google's keyless embed for a place search (what ?q=...&output=embed redirects to)
const EMBED_URL = `https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1s${encodeURIComponent(ADDRESS)}`;
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

// Google Maps can set cookies, so the map loads only when the visitor asks for it
// (described in PoliticaCookiesPage); until then nothing is requested from Google.
const ContactMap = () => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="mt-16 rounded-xl overflow-hidden border border-gray-200 bg-neutral-light h-80 md:h-96">
            {loaded ? (
                <iframe
                    src={EMBED_URL}
                    title={`Hartă – ${ADDRESS}`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                />
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                    <MapPin className="h-10 w-10 text-primary mb-3" />
                    <p className="text-lg font-medium text-gray-900">{ADDRESS}</p>
                    <button
                        type="button"
                        onClick={() => setLoaded(true)}
                        className="mt-4 bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-primary-dark transition-colors duration-200"
                    >
                        Afișează harta
                    </button>
                    <p className="text-sm text-gray-500 mt-3 max-w-md">
                        Harta este furnizată de Google Maps, care poate seta cookie-uri la afișare. Sau{' '}
                        <a
                            href={MAPS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary font-medium hover:underline"
                        >
                            deschideți locația în Google Maps
                        </a>
                        .
                    </p>
                </div>
            )}
        </div>
    );
};

export default ContactMap;
