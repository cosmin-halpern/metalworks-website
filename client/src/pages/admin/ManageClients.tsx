import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { Link } from 'react-router-dom';

const ManageClients = () => {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [logo, setLogo] = useState<File | null>(null);

    // @ts-ignore
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        const res = await fetch(`${API_BASE}/clients`);
        const data = await res.json();
        setClients(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!logo) return alert('Vă rugăm selectați un logo.');

        setLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('logo', logo);

        try {
            const res = await fetch(`${API_BASE}/clients`, {
                method: 'POST',
                headers: authService.getAuthHeader(),
                body: formData,
            });

            if (res.ok) {
                setName('');
                setLogo(null);
                // Reset file input
                (document.getElementById('logo-input') as HTMLInputElement).value = '';
                fetchClients();
            } else {
                alert('Eroare la încărcare');
            }
        } catch (error) {
            alert('Eroare server');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Ștergi acest client?')) return;

        try {
            const res = await fetch(`${API_BASE}/clients/${id}`, {
                method: 'DELETE',
                headers: authService.getAuthHeader(),
            });
            if (res.ok) fetchClients();
            else alert('Doar administratorii pot șterge.');
        } catch (error) {
            alert('Eroare server');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Gestionare Clienți</h1>
                    <Link to="/admin" className="text-slate-600 hover:underline">← Dashboard</Link>
                </div>

                {/* Upload Form */}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-10 flex flex-col md:flex-row gap-4 items-end border-t-4 border-blue-600">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium mb-1">Nume Client</label>
                        <input type="text" className="w-full p-2 border rounded" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Company SRL" required />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium mb-1">Logo (Imagine)</label>
                        <input id="logo-input" type="file" className="w-full" onChange={e => setLogo(e.target.files ? e.target.files[0] : null)} required />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 rounded text-white font-bold whitespace-nowrap ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {loading ? 'Se încarcă...' : 'Adaugă Client'}
                    </button>
                </form>

                {/* Clients Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {clients.map((client) => (
                        <div key={client._id} className="bg-white p-4 rounded-lg shadow group relative">
                            <div className="h-24 flex items-center justify-center mb-2">
                                <img
                                    src={`http://localhost:5001${client.imageUrl}`}
                                    alt={client.name}
                                    className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition"
                                />
                            </div>
                            <p className="text-center text-xs font-bold text-gray-500 truncate">{client.name}</p>
                            <button
                                onClick={() => handleDelete(client._id)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-lg"
                                title="Șterge"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageClients;