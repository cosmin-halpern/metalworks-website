// Visitor's choice about marketing cookies (Meta Pixel).
// The key is versioned: the old `cookie_consent` only meant "banner seen", which is not
// consent to tracking, so visitors who dismissed the old banner are asked again.
const CONSENT_KEY = 'cookie_consent_v2';
const OPEN_EVENT = 'cookie-consent:open';

export type ConsentChoice = 'accepted' | 'rejected';

export function getConsent(): ConsentChoice | null {
    try {
        const value = localStorage.getItem(CONSENT_KEY);
        return value === 'accepted' || value === 'rejected' ? value : null;
    } catch {
        return null;
    }
}

export function setConsent(choice: ConsentChoice) {
    try {
        localStorage.setItem(CONSENT_KEY, choice);
    } catch {
        // Storage blocked: the choice applies to this page view only
    }
}

// Lets the footer's "Setări cookie-uri" link reopen the banner
export function openConsentBanner() {
    window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onConsentBannerOpen(handler: () => void): () => void {
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
}
