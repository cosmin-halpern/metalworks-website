const getBaseUrl = () => {
    const host = window.location.hostname;
    if (host === 'localhost') return 'http://localhost:5001';
    if (host === 'test.corsican.ro') return 'https://api-test.corsican.ro';
    return 'https://api.corsican.ro'; // Production
};

const BASE_URL = getBaseUrl();
export const API_URL = `${BASE_URL}/api`;

export const authService = {
    setToken(token: string) {
        localStorage.setItem('token', token);
    },
    getToken() {
        return localStorage.getItem('token');
    },
    setUser(user: any) {
        localStorage.setItem('user', JSON.stringify(user));
    },
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getAuthHeader(): Record<string, string> {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};