import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const CreateUser = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'editor' });
    const [status, setStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);
    // @ts-ignore
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...authService.getAuthHeader()
            };

            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                setStatus({ type: 'success', msg: `Contul pentru ${formData.username} a fost creat.` });
                setFormData({ username: '', email: '', password: '', role: 'editor' });
            } else {
                setStatus({ type: 'error', msg: data.msg || 'Eroare la crearea utilizatorului.' });
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'Eroare de conexiune la server.' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto">
                <Link to="/admin" className="text-blue-600 mb-4 inline-block hover:underline">← Înapoi la Dashboard</Link>
                <div className="bg-white rounded-lg shadow p-8">
                    <h1 className="text-2xl font-bold mb-6">Creare Utilizator Nou Staff</h1>

                    {status && (
                        <div className={`p-4 rounded mb-6 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {status.msg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nume Utilizator (Username)</label>
                            <input
                                type="text" className="mt-1 w-full p-2 border rounded"
                                value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email" className="mt-1 w-full p-2 border rounded"
                                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Parolă Inițială</label>
                            <input
                                type="password" className="mt-1 w-full p-2 border rounded"
                                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Rol</label>
                            <select
                                className="mt-1 w-full p-2 border rounded bg-white"
                                value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="editor">Editor (Poate adăuga/edita, dar NU poate șterge)</option>
                                <option value="admin">Admin (Control total, inclusiv ștergere și staff)</option>
                            </select>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition mt-6">
                            Creează Utilizator
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateUser;