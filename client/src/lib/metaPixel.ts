// Meta Pixel, loaded only after the visitor accepts marketing cookies.
// Bundled here instead of an inline <script> in index.html so the site's
// Content-Security-Policy can keep blocking inline scripts.
const PIXEL_ID = '1079763571568055';
const SCRIPT_SRC = 'https://connect.facebook.net/en_US/fbevents.js';

type Fbq = ((...args: unknown[]) => void) & {
    callMethod?: (...args: unknown[]) => void;
    queue: unknown[][];
    push: Fbq;
    loaded: boolean;
    version: string;
};

declare global {
    interface Window {
        fbq?: Fbq;
        _fbq?: Fbq;
    }
}

let initialized = false;

// Same queueing stub as Meta's official snippet: calls made before fbevents.js
// finishes loading are queued and replayed by the library.
function installStub() {
    if (window.fbq) return;
    const fbq = function (...args: unknown[]) {
        if (fbq.callMethod) fbq.callMethod(...args);
        else fbq.queue.push(args);
    } as Fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    window.fbq = fbq;
    if (!window._fbq) window._fbq = fbq;

    const script = document.createElement('script');
    script.async = true;
    script.src = SCRIPT_SRC;
    document.head.appendChild(script);
}

export function initMetaPixel() {
    if (initialized) return;
    initialized = true;
    installStub();
    window.fbq!('consent', 'grant');
    window.fbq!('init', PIXEL_ID);
}

export function trackPageView() {
    if (initialized) window.fbq?.('track', 'PageView');
}

// Called when the visitor withdraws consent: stop sending events and remove Meta's first-party cookies
export function revokeMetaPixel() {
    if (initialized) window.fbq?.('consent', 'revoke');
    for (const name of ['_fbp', '_fbc']) {
        const host = window.location.hostname.replace(/^www\./, '');
        document.cookie = `${name}=; Max-Age=0; path=/`;
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.${host}`;
    }
}
