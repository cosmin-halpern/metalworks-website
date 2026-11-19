import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getConsent } from '../lib/consent';
import { initMetaPixel, trackPageView } from '../lib/metaPixel';
import { initGoogleTag, trackEvent } from '../lib/googleTag';

// Marketing tags (Meta Pixel, Google Tag Manager), only for visitors who accepted cookies.
// Meta Pixel events: PageView on every route change, Lead when the quote form is sent.
//
// dataLayer events available in GTM for the ads setup:
//   virtual_page_view  every route change (SPA)       page_path, page_title
//   phone_click        click on a tel: link           link_url
//   email_click        click on a mailto: link        link_url
//   generate_lead      quote form sent (/contact)     form, service
//   purchase           shop order placed              ecommerce { transaction_id, value, currency }
const Tracking = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        if (getConsent() !== 'accepted') return;
        initMetaPixel();
        trackPageView();
        void initGoogleTag();
        // Wait a tick so the page has set its own document.title
        const timer = window.setTimeout(
            () => trackEvent('virtual_page_view', { page_path: pathname, page_title: document.title }),
            0
        );
        return () => window.clearTimeout(timer);
    }, [pathname]);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            const link = (e.target as Element | null)?.closest?.('a[href^="tel:"], a[href^="mailto:"]');
            if (!link) return;
            const href = link.getAttribute('href') || '';
            trackEvent(href.startsWith('tel:') ? 'phone_click' : 'email_click', { link_url: href });
        };
        document.addEventListener('click', onClick, true);
        return () => document.removeEventListener('click', onClick, true);
    }, []);

    return null;
};

export default Tracking;
