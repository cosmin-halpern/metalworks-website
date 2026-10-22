import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiBaseUrl, getApiUrl } from '../../services/env';
import { apiFetch } from '../../services/authService';

const ManageSiteSettings = () => {
    const [loading, setLoading] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [currentLogoUrl, setCurrentLogoUrl] = useState<string>('');
    const [gtmId, setGtmId] = useState('');
    const [savedGtmId, setSavedGtmId] = useState('');
    const [trackingMessage, setTrackingMessage] = useState<{ ok: boolean; text: string } | null>(null);
    const [savingTracking, setSavingTracking] = useState(false);

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
        setGtmId(data?.gtmId || '');
        setSavedGtmId(data?.gtmId || '');
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

    const handleSaveTracking = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingTracking(true);
        setTrackingMessage(null);
        try {
            const res = await apiFetch(`${API_URL}/settings/tracking`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gtmId }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                setTrackingMessage({ ok: false, text: data?.msg || 'Eroare la salvare' });
                return;
            }
            setGtmId(data.gtmId);
            setSavedGtmId(data.gtmId);
            setTrackingMessage({
                ok: true,
                text: data.gtmId ? `Salvat. Google Tag Manager (${data.gtmId}) este activ pe site.` : 'Salvat. Tracking-ul Google este dezactivat.',
            });
        } catch {
            setTrackingMessage({ ok: false, text: 'Eroare server' });
        } finally {
            setSavingTracking(false);
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

                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600 mt-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Google Tag Manager (reclame Google)</h2>
                    <p className="text-sm text-slate-600 mb-4">
                        Lipiți aici ID-ul containerului primit de la cine se ocupă de reclame (forma <code>GTM-XXXXXXX</code>).
                        Se încarcă doar pentru vizitatorii care acceptă cookie-urile. Lăsați gol pentru a dezactiva.
                    </p>
                    <p className="text-sm mb-4">
                        Stare:{' '}
                        {savedGtmId ? (
                            <span className="font-medium text-green-700">activ ({savedGtmId})</span>
                        ) : (
                            <span className="font-medium text-slate-500">neconfigurat</span>
                        )}
                    </p>
                    <form onSubmit={handleSaveTracking} className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={gtmId}
                            onChange={(e) => setGtmId(e.target.value)}
                            placeholder="GTM-XXXXXXX"
                            pattern="\s*([Gg][Tt][Mm]-[A-Za-z0-9]{4,12})?\s*"
                            title="Forma GTM-XXXXXXX"
                            className="flex-1 border rounded p-2 font-mono uppercase"
                        />
                        <button
                            type="submit"
                            disabled={savingTracking}
                            className={`px-6 py-2 rounded text-white font-bold ${
                                savingTracking ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {savingTracking ? 'Se salvează...' : 'Salvează'}
                        </button>
                    </form>
                    {trackingMessage && (
                        <p className={`text-sm mt-3 ${trackingMessage.ok ? 'text-green-700' : 'text-red-600'}`}>{trackingMessage.text}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageSiteSettings;