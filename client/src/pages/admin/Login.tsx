import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, authService } from '../../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const text = await res.text();
            let data: any = {};
            try {
                data = JSON.parse(text);
            } catch {
                data = { msg: text };
            }

            if (res.ok) {
                authService.setToken(data.token);
                authService.setUser(data.user);
                navigate('/admin');
            } else {
                setError(data.msg || data.message || 'Email sau parolă incorectă');
            }
        } catch (err) {
            setError(
                'Nu s-a putut contacta serverul. Verificați conexiunea la internet sau dacă API-ul este pornit.'
            );
            console.error('Login Error:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
                    Admin Login
                </h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-slate-900 text-white p-3 rounded-md mt-8 font-semibold hover:bg-slate-800 transition"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default Login;