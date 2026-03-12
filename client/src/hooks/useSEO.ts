import { useEffect } from 'react';

type SEOProps = {
    title: string;
    description: string;
    canonical?: string;
};

export function useSEO({ title, description, canonical }: SEOProps) {
    useEffect(() => {
        document.title = `${title} | Corsican Engineering`;

        const setMeta = (name: string, content: string, attr = 'name') => {
            let el = document.querySelector(`meta[${attr}="${name}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, name);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMeta('description', description);
        setMeta('og:title', `${title} | Corsican Engineering`, 'property');
        setMeta('og:description', description, 'property');

        if (canonical) {
            let link = document.querySelector('link[rel="canonical"]');
            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', 'canonical');
                document.head.appendChild(link);
            }
            link.setAttribute('href', canonical);
        }
    }, [title, description, canonical]);
}
