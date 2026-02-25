export function getApiBaseUrl(): string {
    // Prefer Vite env if defined
    try {
        const viteEnv = (import.meta as any)?.env;
        const fromVite = viteEnv?.VITE_API_BASE_URL || viteEnv?.VITE_API_URL;
        if (typeof fromVite === 'string' && fromVite.trim()) {
            // If someone set VITE_API_URL to ".../api", normalize to base
            return fromVite.replace(/\/api\/?$/, '');
        }
    } catch {
        // ignore
    }

    // Fallback for local dev
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
        return 'http://localhost:5001';
    }

    // Same-origin fallback (useful behind reverse proxy)
    return '';
}

export function getApiUrl(): string {
    const base = getApiBaseUrl();
    return `${base}/api`;
}