import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ConsentChoice, getConsent, onConsentBannerOpen, setConsent } from '../lib/consent';
import { initMetaPixel, revokeMetaPixel, trackPageView } from '../lib/metaPixel';

const CookieBanner = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!getConsent()) setVisible(true);
        return onConsentBannerOpen(() => setVisible(true));
    }, []);

    const choose = (choice: ConsentChoice) => {
        setConsent(choice);
        if (choice === 'accepted') {
            initMetaPixel();
            trackPageView();
        } else {
            revokeMetaPixel();
        }
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-label="Preferințe cookie-uri"
            className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white px-4 py-4 shadow-lg"
        >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-sm text-gray-200 flex-1">
                    Cu acordul dvs., folosim cookie-uri de marketing (Meta Pixel) pentru a măsura
                    eficiența reclamelor noastre pe Facebook și Instagram. Coșul de cumpărături
                    funcționează și fără ele.{' '}
                    <Link to="/politica-de-cookies" className="underline hover:text-white">
                        Aflați mai multe
                    </Link>
                    .
                </p>
                <div className="flex gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={() => choose('rejected')}
                        className="border border-white text-white font-bold text-sm px-4 py-2 rounded hover:bg-white/10 transition-colors"
                    >
                        Refuz
                    </button>
                    <button
                        type="button"
                        onClick={() => choose('accepted')}
                        className="bg-white text-gray-900 font-bold text-sm px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
