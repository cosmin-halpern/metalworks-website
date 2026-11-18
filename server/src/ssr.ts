import fs from 'fs';
import { pathToFileURL } from 'url';
import { listProjects } from './repositories/projectRepo.js';
import { listClientLogos } from './repositories/clientLogoRepo.js';

// Server-side rendering of the public pages, so crawlers (many AI crawlers don't run JS)
// get the full page text in the HTML. The React app is rendered by the bundle built from
// client/src/entry-server.tsx; the browser then hydrates it (client/src/main.tsx).

// Must match InitialData in client/src/lib/initialData.tsx
type InitialData = { projects?: unknown[]; clientLogos?: unknown[] };
type RenderFn = (url: string, data: InitialData) => string;

export type RenderedApp = { html: string; data: InitialData };

let renderer: Promise<RenderFn | null> | null = null;

function loadRenderer(serverEntry: string): Promise<RenderFn | null> {
    // Missing before the first client build; checked again on the next request
    if (!fs.existsSync(serverEntry)) return Promise.resolve(null);
    // Loaded once: a deploy restarts the app (Passenger), which picks up a new bundle
    renderer ??= import(pathToFileURL(serverEntry).href)
        .then((mod) => mod.render as RenderFn)
        .catch((err) => {
            console.error('[ssr] Could not load the server bundle:', err);
            return null;
        });
    return renderer;
}

// The same data the pages would otherwise fetch from /api after loading, in the same shape
async function loadInitialData(routePath: string): Promise<InitialData> {
    try {
        if (routePath === '/') {
            return { clientLogos: await listClientLogos() };
        }
        if (routePath === '/proiecte' || routePath.startsWith('/servicii/')) {
            return { projects: (await listProjects(1, 100)).data };
        }
    } catch (err) {
        // Render without it; the page then fetches the data in the browser as before
        console.error(`[ssr] Failed to load data for ${routePath}:`, err);
    }
    return {};
}

// Returns null when the page should be rendered in the browser only (fallback)
export async function renderApp(serverEntry: string, url: string, routePath: string): Promise<RenderedApp | null> {
    const render = await loadRenderer(serverEntry);
    if (!render) return null;

    const data = await loadInitialData(routePath);
    try {
        return { html: render(url, data), data };
    } catch (err) {
        console.error(`[ssr] Render failed for ${url}:`, err);
        return null;
    }
}
