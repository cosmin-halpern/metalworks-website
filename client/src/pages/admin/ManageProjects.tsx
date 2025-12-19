import React, {useState, useEffect} from 'react';
import {authService, API_URL, SERVER_URL} from '../../services/authService';
import {Link} from 'react-router-dom';

const ManageProjects = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [gallery, setGallery] = useState<FileList | null>(null);

    // @ts-ignore
    // const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const res = await fetch(`${API_URL}/projects`);
        const data = await res.json();
        setProjects(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (coverImage) formData.append('coverImage', coverImage);
        if (gallery) {
            for (let i = 0; i < gallery.length; i++) {
                formData.append('gallery', gallery[i]);
            }
        }

        try {
            const res = await fetch(`${API_URL}/projects`, {
                method: 'POST',
                headers: authService.getAuthHeader(), // Don't set Content-Type, browser sets it for FormData
                body: formData,
            });

            if (res.ok) {
                alert('Project added successfully!');
                setTitle('');
                setDescription('');
                setShowForm(false);
                fetchProjects();
            } else {
                const err = await res.json();
                alert('Error: ' + err.msg);
            }
        } catch (error) {
            alert('Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Sigur vrei să ștergi acest proiect?')) return;

        const res = await fetch(`${API_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: authService.getAuthHeader(),
        });

        if (res.ok) {
            fetchProjects();
        } else {
            alert('Doar administratorii pot șterge proiecte.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Gestionare Proiecte</h1>
                    <div className="space-x-4">
                        <Link to="/admin" className="text-slate-600 hover:underline">← Dashboard</Link>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
                        >
                            {showForm ? 'Anulează' : '+ Proiect Nou'}
                        </button>
                    </div>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit}
                          className="bg-white p-6 rounded-lg shadow-md mb-10 space-y-4 border-t-4 border-blue-600">
                        <h2 className="text-xl font-bold mb-4">Adaugă Proiect</h2>
                        <div>
                            <label className="block text-sm font-medium">Titlu Proiect</label>
                            <input type="text" className="w-full p-2 border rounded" value={title}
                                   onChange={e => setTitle(e.target.value)} required/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Descriere</label>
                            <textarea className="w-full p-2 border rounded" rows={3} value={description}
                                      onChange={e => setDescription(e.target.value)} required/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Imagine Copertă (Thumbnail)</label>
                                <input type="file" className="w-full"
                                       onChange={e => setCoverImage(e.target.files ? e.target.files[0] : null)}
                                       required/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Galerie Foto/Video (Selecție
                                    Multiplă)</label>
                                <input type="file" className="w-full" multiple
                                       onChange={e => setGallery(e.target.files)}/>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded text-white font-bold ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {loading ? 'Se încarcă...' : 'Salvează Proiectul'}
                        </button>
                    </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project._id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                            <img
                                src={`${SERVER_URL}${project.coverImage}`}
                                alt={project.title}
                                className="h-48 w-full object-cover"
                            />
                            <div className="p-4 flex-1">
                                <h3 className="font-bold text-lg">{project.title}</h3>
                                <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                            </div>
                            <div className="p-4 bg-gray-50 border-t flex justify-between">
                                <span className="text-xs text-gray-400">Media: {project.media?.length || 0} items</span>
                                <button
                                    onClick={() => handleDelete(project._id)}
                                    className="text-red-600 text-sm font-bold hover:underline"
                                >
                                    Șterge
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageProjects;