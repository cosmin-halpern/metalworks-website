import fs from 'fs';
import path from 'path';
import type { RenderedApp } from './ssr.js';

// Per-route SEO for the SPA shell. The route table lives in client/public/seo-routes.json
// (copied to client/dist on build) and is shared with the client (client/src/seo/seo.ts),
// which applies the same tags on client-side navigation.

type RouteMeta = {
    title: string;
    description?: string;
    noindex?: boolean;
    // The title already names the brand, so " | siteName" isn't appended
    noSuffix?: boolean;
    // Service pages also get Service + BreadcrumbList structured data
    service?: { name: string; serviceType: string };
};

type SeoConfig = {
    siteUrl: string;
    siteName: string;
    defaultImage: string;
    routes: Record<string, RouteMeta>;
    admin: RouteMeta;
    notFound: RouteMeta;
};

const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
const EMPTY_ROOT = '<div id="root"></div>';

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// JSON inside <script> must not be able to close the tag
function jsonLd(data: object): string {
    return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

function serviceJsonLd(config: SeoConfig, routePath: string, meta: RouteMeta): string {
    if (!meta.service) return '';
    const url = config.siteUrl + routePath;
    return `
    ${jsonLd({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: meta.service.name,
        serviceType: meta.service.serviceType,
        description: meta.description,
        url,
        provider: { '@id': `${config.siteUrl}/#business` },
        areaServed: { '@type': 'Country', name: 'România' },
    })}
    ${jsonLd({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Acasă', item: `${config.siteUrl}/` },
            { '@type': 'ListItem', position: 2, name: 'Servicii', item: `${config.siteUrl}/servicii` },
            { '@type': 'ListItem', position: 3, name: meta.service.name, item: url },
        ],
    })}`;
}

export function normalizePath(pathname: string): string {
    const trimmed = pathname.replace(/\/+$/, '');
    return trimmed === '' ? '/' : trimmed;
}

export function isAdminPath(pathname: string): boolean {
    const routePath = normalizePath(pathname);
    return routePath === '/admin' || routePath.startsWith('/admin/');
}

export function renderSpaShell(
    clientDistPath: string,
    pathname: string,
    app: RenderedApp | null = null
): { status: number; html: string } {
    // Read on every request: both files are tiny, and this picks up a new build without a restart
    const html = fs.readFileSync(path.join(clientDistPath, 'index.html'), 'utf8');
    const config: SeoConfig = JSON.parse(
        fs.readFileSync(path.join(clientDistPath, 'seo-routes.json'), 'utf8')
    );

    const routePath = normalizePath(pathname);
    const isAdmin = isAdminPath(routePath);
    const known = routePath in config.routes;
    const meta = config.routes[routePath] ?? (isAdmin ? config.admin : config.notFound);

    const title = escapeHtml(meta.noSuffix ? meta.title : `${meta.title} | ${config.siteName}`);
    const description = escapeHtml(meta.description ?? config.routes['/'].description ?? '');
    // Only real pages get a canonical URL; a 404 or admin page shouldn't point at the homepage
    const canonical = known ? escapeHtml(config.siteUrl + (routePath !== '/' ? routePath : '/')) : '';
    const image = escapeHtml(config.siteUrl + config.defaultImage);
    const robots = meta.noindex ? 'noindex, follow' : 'index, follow';

    const block = `<!--seo:start-->
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="${robots}" />
    ${canonical ? `<link rel="canonical" href="${canonical}" />` : ''}
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    ${canonical ? `<meta property="og:url" content="${canonical}" />` : ''}
    <meta property="og:image" content="${image}" />${known ? serviceJsonLd(config, routePath, meta) : ''}
    <!--seo:end-->`;

    let page = html.replace(SEO_BLOCK, () => block);
    if (app) {
        // The data goes next to #root, not inside it, so React hydrates exactly the rendered markup.
        // Escaping "<" keeps the JSON from closing the script tag.
        const data = JSON.stringify(app.data).replace(/</g, '\\u003c');
        page = page.replace(
            EMPTY_ROOT,
            () =>
                `<div id="root">${app.html}</div>\n<script type="application/json" id="initial-data">${data}</script>`
        );
    }

    return {
        status: known || isAdmin ? 200 : 404,
        html: page,
    };
}
