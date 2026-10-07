// Per-route SEO metadata. The same JSON is read by the server (server/src/seo.ts),
// which injects these tags into index.html before sending it, so crawlers get the
// right tags without running JS. This module keeps them in sync on client-side navigation.
import seoConfig from '../../public/seo-routes.json';

type RouteMeta = {
    title: string;
    description?: string;
    noindex?: boolean;
};

export type ResolvedSeo = {
    title: string;
    description: string;
    canonical: string;
    image: string;
    robots: string;
};

const routes: Record<string, RouteMeta> = seoConfig.routes;

export function normalizePath(pathname: string): string {
    const trimmed = pathname.replace(/\/+$/, '');
    return trimmed === '' ? '/' : trimmed;
}

export function resolveSeo(pathname: string): ResolvedSeo {
    const path = normalizePath(pathname);
    const isAdmin = path === '/admin' || path.startsWith('/admin/');
    const meta: RouteMeta = routes[path] ?? (isAdmin ? seoConfig.admin : seoConfig.notFound);
    const known = path in routes;

    return {
        title: `${meta.title} | ${seoConfig.siteName}`,
        description: meta.description ?? routes['/'].description!,
        canonical: seoConfig.siteUrl + (known && path !== '/' ? path : '/'),
        image: seoConfig.siteUrl + seoConfig.defaultImage,
        robots: meta.noindex ? 'noindex, follow' : 'index, follow',
    };
}

function setAttr(selector: string, attr: string, value: string) {
    document.head.querySelector(selector)?.setAttribute(attr, value);
}

export function applySeo(seo: ResolvedSeo) {
    document.title = seo.title;
    setAttr('meta[name="description"]', 'content', seo.description);
    setAttr('meta[name="robots"]', 'content', seo.robots);
    setAttr('link[rel="canonical"]', 'href', seo.canonical);
    setAttr('meta[property="og:title"]', 'content', seo.title);
    setAttr('meta[property="og:description"]', 'content', seo.description);
    setAttr('meta[property="og:url"]', 'content', seo.canonical);
    setAttr('meta[property="og:image"]', 'content', seo.image);
}
