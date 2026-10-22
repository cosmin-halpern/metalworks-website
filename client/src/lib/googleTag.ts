// Google Tag Manager, loaded only after the visitor accepts marketing cookies.
// The container ID (GTM-XXXXXXX) is set from the admin panel (Setări Site); with no ID
// nothing is loaded. Conversions are configured inside GTM by whoever runs the ads,
// using the dataLayer events pushed by trackEvent() (see the list in Tracking.tsx).
import { getApiUrl } from '../services/env';
import { getConsent } from './consent';

type DataLayerEvent = Record<string, unknown>;

declare global {
    interface Window {
        dataLayer?: unknown[];
    }
}

const GOOGLE_COOKIE_PREFIXES = ['_ga', '_gcl', '_gid', '_gat'];

let gtmIdPromise: Promise<string> | null = null;
let loadedId: string | null = null;

function dataLayer(): unknown[] {
    window.dataLayer = window.dataLayer || [];
    return window.dataLayer;
}

// Same as Google's gtag() helper: consent commands must be pushed as an `arguments` object
function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    dataLayer().push(arguments);
}

function fetchGtmId(): Promise<string> {
    if (!gtmIdPromise) {
        gtmIdPromise = fetch(`${getApiUrl()}/settings`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data: { gtmId?: unknown } | null) => (typeof data?.gtmId === 'string' ? data.gtmId : ''))
            .catch(() => '');
    }
    return gtmIdPromise;
}

// What Google tags have been told so far on this page: nothing yet, granted, or denied
let consentState: 'none' | 'granted' | 'denied' = 'none';

export async function initGoogleTag() {
    // Consent Mode v2: everything denied by default, then granted because this only
    // runs after the visitor clicked "Accept". Pushed before anything else (synchronously,
    // before fetching the ID) so GTM sees the consent state ahead of the first event.
    if (consentState !== 'granted') {
        if (consentState === 'none') gtag('consent', 'default', consentFlags('denied'));
        gtag('consent', 'update', consentFlags('granted'));
        consentState = 'granted';
    }

    const gtmId = await fetchGtmId();
    if (!gtmId || loadedId) return;
    loadedId = gtmId;

    dataLayer().push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
    document.head.appendChild(script);
}

function consentFlags(value: 'granted' | 'denied') {
    return { ad_storage: value, ad_user_data: value, ad_personalization: value, analytics_storage: value };
}

// Called when the visitor withdraws consent: tell Google tags to stop, remove Google's cookies
export function revokeGoogleTag() {
    if (consentState === 'granted') {
        gtag('consent', 'update', consentFlags('denied'));
        consentState = 'denied';
    }
    const host = window.location.hostname.replace(/^www\./, '');
    for (const cookie of document.cookie.split(';')) {
        const name = cookie.split('=')[0].trim();
        if (!GOOGLE_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix))) continue;
        document.cookie = `${name}=; Max-Age=0; path=/`;
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.${host}`;
    }
}

// Pushes an event for GTM. Only after consent: otherwise GTM, once loaded, would also
// process events recorded before the visitor agreed.
export function trackEvent(event: string, params: DataLayerEvent = {}) {
    if (getConsent() !== 'accepted') return;
    // GA4 ecommerce: clear the previous ecommerce object before pushing a new one
    if ('ecommerce' in params) dataLayer().push({ ecommerce: null });
    dataLayer().push({ event, ...params });
}

// ── Shop purchases ───────────────────────────────────────────────────────────
// Card payments leave the site for Stripe and come back on /plata-finalizata, which only
// knows the order number; the value is kept in sessionStorage across the redirect.
const PENDING_PURCHASE_KEY = 'pending_purchase';

type Purchase = { orderNumber: string; total: number };

export function trackPurchase({ orderNumber, total }: Purchase) {
    trackEvent('purchase', {
        ecommerce: { transaction_id: orderNumber, value: total, currency: 'RON' },
    });
}

export function rememberPendingPurchase(purchase: Purchase) {
    try {
        sessionStorage.setItem(PENDING_PURCHASE_KEY, JSON.stringify(purchase));
    } catch {
        // storage blocked: the purchase just isn't reported
    }
}

// Reports the pending purchase once, if it matches the order shown on the success page
export function trackPendingPurchase(orderNumber: string | null) {
    try {
        const raw = sessionStorage.getItem(PENDING_PURCHASE_KEY);
        if (!raw || !orderNumber) return;
        const pending = JSON.parse(raw) as Purchase;
        if (pending.orderNumber !== orderNumber) return;
        sessionStorage.removeItem(PENDING_PURCHASE_KEY);
        trackPurchase(pending);
    } catch {
        // ignore malformed storage
    }
}
