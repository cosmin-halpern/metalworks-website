import { getApiUrl } from './env';

const API_URL = getApiUrl();

export const authService = {
    setUser(user: any) {
        localStorage.setItem('user', JSON.stringify(user));
    },
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    async logout() {
        try {
            await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
        } catch {
            // ignore network errors on logout
        }
        localStorage.removeItem('user');
    },
};

/**
 * Authenticated fetch wrapper for admin API calls.
 * - Always sends credentials (httpOnly cookie).
 * - On 401, clears local user state and redirects to /admin/login.
 */
export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const res = await fetch(url, { credentials: 'include', ...options });

    if (res.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
    }

    return res;
};