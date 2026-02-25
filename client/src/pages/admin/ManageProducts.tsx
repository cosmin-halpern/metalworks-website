import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {getApiBaseUrl, getApiUrl} from "../../services/env.ts";
import { apiFetch } from '../../services/authService';

type Product = {
    id: number;
    title: string;
    description?: string;
    price: number;
    imageUrl: string;
    active: boolean;
};

const ManageProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // create
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<string>('0');
    const [image, setImage] = useState<File | null>(null);

    // edit
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editPrice, setEditPrice] = useState<string>('0');
    const [editActive, setEditActive] = useState<boolean>(true);
    const [editImage, setEditImage] = useState<File | null>(null);

    const API_BASE = getApiUrl();
    const SERVER_URL = getApiBaseUrl() || window.location.origin;

    const getFullUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${SERVER_URL}${path}`;
    };

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchProducts = async () => {
        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
    };

    const resetCreateForm = () => {
        setTitle('');
        setDescription('');
        setPrice('0');
        setImage(null);
        const input = document.getElementById('product-image-input') as HTMLInputElement | null;
        if (input) input.value = '';
    };

    const startEdit = (p: Product) => {
        setEditingId(p.id);
        setEditTitle(p.title);
        setEditDescription(p.description || '');
        setEditPrice(String(p.price));
        setEditActive(Boolean(p.active));
        setEditImage(null);
        const input = document.getElementById('product-edit-image-input') as HTMLInputElement | null;
        if (input) input.value = '';
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
        setEditDescription('');
        setEditPrice('0');
        setEditActive(true);
        setEditImage(null);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) return alert('Vă rugăm selectați o imagine.');

        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('image', image);

        try {
            const res = await apiFetch(`${API_BASE}/products`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                alert(err?.msg || 'Eroare la adăugare produs');
                return;
            }

            resetCreateForm();
            await fetchProducts();
        } catch (error) {
            alert('Eroare server');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('title', editTitle);
        formData.append('description', editDescription);
        formData.append('price', editPrice);
        formData.append('active', String(editActive));
        if (editImage) formData.append('image', editImage);

        try {
            const res = await apiFetch(`${API_BASE}/products/${editingId}`, {
                method: 'PUT',
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                alert(err?.msg || 'Eroare la actualizare produs');
                return;
            }

            cancelEdit();
            await fetchProducts();
        } catch (error) {
            alert('Eroare server');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Ștergi acest produs?')) return;

        try {
            const res = await apiFetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });

            if (res.ok) await fetchProducts();
            else alert('Doar administratorii pot șterge.');
        } catch (error) {
            alert('Eroare server');
        }
    };

    const editingProduct = editingId !== null ? products.find(p => p.id === editingId) ?? null : null;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Gestionare Produse</h1>
                    <Link to="/admin" className="text-slate-600 hover:underline">
                        ← Dashboard
                    </Link>
                </div>

                {/* Create */}
                <form
                    onSubmit={handleCreate}
                    className="bg-white p-6 rounded-lg shadow-md mb-10 flex flex-col gap-4 border-t-4 border-blue-600"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium mb-1">Titlu</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Raft metalic"
                                required
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium mb-1">Preț (RON)</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                min={0}
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium mb-1">Imagine</label>
                            <input
                                id="product-image-input"
                                type="file"
                                className="w-full"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Descriere (opțional)</label>
                        <textarea
                            className="w-full p-2 border rounded"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 rounded text-white font-bold whitespace-nowrap ${
                                loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {loading ? 'Se încarcă...' : 'Adaugă Produs'}
                        </button>
                    </div>
                </form>

                {/* Edit */}
                {editingId !== null && (
                    <form
                        onSubmit={handleUpdate}
                        className="bg-white p-6 rounded-lg shadow-md mb-10 flex flex-col gap-4 border-t-4 border-amber-500"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="text-xl font-bold text-slate-900">Editează produs</h2>
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="text-slate-600 hover:underline"
                            >
                                Anulează
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium mb-1">Titlu</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium mb-1">Preț (RON)</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded"
                                    value={editPrice}
                                    onChange={(e) => setEditPrice(e.target.value)}
                                    min={0}
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium mb-1">Activ</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={editActive ? 'true' : 'false'}
                                    onChange={(e) => setEditActive(e.target.value === 'true')}
                                >
                                    <option value="true">Da</option>
                                    <option value="false">Nu</option>
                                </select>
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium mb-1">Imagine nouă (opțional)</label>
                                {editingProduct && (
                                    <div className="mb-2 w-16 h-12 bg-gray-100 rounded overflow-hidden">
                                        <img
                                            src={getFullUrl(editingProduct.imageUrl)}
                                            alt="Imagine curentă"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <input
                                    id="product-edit-image-input"
                                    type="file"
                                    className="w-full"
                                    accept="image/*"
                                    onChange={(e) => setEditImage(e.target.files ? e.target.files[0] : null)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Descriere</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-2 rounded text-white font-bold whitespace-nowrap ${
                                    loading ? 'bg-gray-400' : 'bg-amber-600 hover:bg-amber-700'
                                }`}
                            >
                                {loading ? 'Se încarcă...' : 'Salvează modificări'}
                            </button>
                        </div>
                    </form>
                )}

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map((p) => (
                        <div key={p.id} className="bg-white p-4 rounded-lg shadow relative border">
                            <div className="flex gap-4">
                                <div className="w-28 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                    <img
                                        src={getFullUrl(p.imageUrl)}
                                        alt={p.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-900 truncate">{p.title}</p>
                                            <p className="text-sm text-slate-600 truncate">
                                                {p.description || '—'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">{p.price} RON</p>
                                            <p className={`text-xs font-bold ${p.active ? 'text-green-700' : 'text-red-700'}`}>
                                                {p.active ? 'ACTIV' : 'INACTIV'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => startEdit(p)}
                                            className="px-3 py-1.5 rounded bg-slate-900 text-white text-sm font-bold hover:opacity-90"
                                        >
                                            Editează
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(p.id)}
                                            className="px-3 py-1.5 rounded bg-red-600 text-white text-sm font-bold hover:bg-red-700"
                                        >
                                            Șterge
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-20 text-slate-600">
                        Nu există produse încă.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageProducts;