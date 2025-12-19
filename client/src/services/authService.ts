const getBaseUrl = () => {
    const host = window.location.hostname;
    // If we are developing locally
    if (host === 'localhost' || host === '127.0.0.1') {
        return 'http://localhost:5001';
    }
    // If we are on the test server
    if (host === 'test.corsican.ro') {
        return 'https://api-test.corsican.ro';
    }
    // Production
    return 'https://api.corsican.ro';
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