import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CONSENT_KEY = 'cookie_consent';

const CookieBanner = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(CONSENT_KEY);
        if (!consent) setVisible(true);
    }, []);

    const dismiss = () => {
        localStorage.setItem(CONSENT_KEY, 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white px-4 py-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-sm text-gray-200 flex-1">
                    Folosim stocarea locală (localStorage) pentru a reține coșul de cumpărături.
                    Nu utilizăm cookie-uri de urmărire sau analiză.{' '}
                    <Link to="/politica-de-cookies" className="underline hover:text-white">
                        Aflați mai multe
                    </Link>
                    .
                </p>
                <button
                    type="button"
                    onClick={dismiss}
                    className="shrink-0 bg-white text-gray-900 font-bold text-sm px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                >
                    Am înțeles
                </button>
            </div>
        </div>
    );
};

export default CookieBanner;
