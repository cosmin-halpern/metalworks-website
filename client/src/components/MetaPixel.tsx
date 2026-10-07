import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getConsent } from '../lib/consent';
import { initMetaPixel, trackPageView } from '../lib/metaPixel';

// Sends a PageView on every route change (the site is a SPA, so the browser
// only loads one page), but only if the visitor accepted marketing cookies.
const MetaPixel = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        if (getConsent() !== 'accepted') return;
        initMetaPixel();
        trackPageView();
    }, [pathname]);

    return null;
};

export default MetaPixel;
