import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiBaseUrl, getApiUrl } from '../../services/env';
import { apiFetch } from '../../services/authService';

const ManageSiteSettings = () => {
    const [loading, setLoading] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [currentLogoUrl, setCurrentLogoUrl] = useState<string>('');

    const API_URL = getApiUrl();
    const SERVER_URL = getApiBaseUrl() || window.location.origin;

    const toFullUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${SERVER_URL}${path}`;
    };

    const fetchSettings = async () => {
        const res = await fetch(`${API_URL}/settings`);
        const data = await res.json();
        setCurrentLogoUrl(data?.logoUrl ? toFullUrl(data.logoUrl) : '');
    };

    useEffect(() => {
        fetchSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!logoFile) return alert('Selectează un fișier logo.');

        setLoading(true);
        const formData = new FormData();
        formData.append('logo', logoFile);

        try {
            const res = await apiFetch(`${API_URL}/settings/logo`, {
                method: 'PUT',
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                alert(err?.msg || 'Eroare la încărcare logo');
                return;
            }

            setLogoFile(null);
            const input = document.getElementById('site-logo-input') as HTMLInputElement | null;
            if (input) input.value = '';

            await fetchSettings();
        } catch {
            alert('Eroare server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Setări Site</h1>
                    <Link to="/admin" className="text-slate-600 hover:underline">← Dashboard</Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Logo</h2>

                    {currentLogoUrl ? (
                        <div className="mb-6">
                            <p className="text-sm font-medium text-slate-600 mb-2">Logo curent:</p>
                            <div className="bg-gray-50 border rounded p-4 flex items-center justify-center">
                                <img src={currentLogoUrl} alt="Logo curent" className="h-20 w-auto object-contain" />
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-600 mb-6">Nu există logo salvat în setări (se folosește fallback).</p>
                    )}

                    <form onSubmit={handleUpload} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Încarcă logo nou</label>
                            <input
                                id="site-logo-input"
                                type="file"
                                className="w-full"
                                accept="image/*"
                                onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 rounded text-white font-bold ${
                                loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {loading ? 'Se încarcă...' : 'Salvează Logo'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManageSiteSettings;