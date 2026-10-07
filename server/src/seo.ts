import fs from 'fs';
import path from 'path';

// Per-route SEO for the SPA shell. The route table lives in client/public/seo-routes.json
// (copied to client/dist on build) and is shared with the client (client/src/seo/seo.ts),
// which applies the same tags on client-side navigation.

type RouteMeta = { title: string; description?: string; noindex?: boolean };

type SeoConfig = {
    siteUrl: string;
    siteName: string;
    defaultImage: string;
    routes: Record<string, RouteMeta>;
    admin: RouteMeta;
    notFound: RouteMeta;
};

const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export function normalizePath(pathname: string): string {
    const trimmed = pathname.replace(/\/+$/, '');
    return trimmed === '' ? '/' : trimmed;
}

export function renderSpaShell(clientDistPath: string, pathname: string): { status: number; html: string } {
    // Read on every request: both files are tiny, and this picks up a new build without a restart
    const html = fs.readFileSync(path.join(clientDistPath, 'index.html'), 'utf8');
    const config: SeoConfig = JSON.parse(
        fs.readFileSync(path.join(clientDistPath, 'seo-routes.json'), 'utf8')
    );

    const routePath = normalizePath(pathname);
    const isAdmin = routePath === '/admin' || routePath.startsWith('/admin/');
    const known = routePath in config.routes;
    const meta = config.routes[routePath] ?? (isAdmin ? config.admin : config.notFound);

    const title = escapeHtml(`${meta.title} | ${config.siteName}`);
    const description = escapeHtml(meta.description ?? config.routes['/'].description ?? '');
    const canonical = escapeHtml(config.siteUrl + (known && routePath !== '/' ? routePath : '/'));
    const image = escapeHtml(config.siteUrl + config.defaultImage);
    const robots = meta.noindex ? 'noindex, follow' : 'index, follow';

    const block = `<!--seo:start-->
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${image}" />
    <!--seo:end-->`;

    return {
        status: known || isAdmin ? 200 : 404,
        html: html.replace(SEO_BLOCK, () => block),
    };
}
