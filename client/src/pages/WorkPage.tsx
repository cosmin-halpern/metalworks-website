import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Banner from '../components/Banner';
import ProjectGalleryModal from '../components/ProjectGalleryModal';
import { getApiBaseUrl, getApiUrl } from '../services/env';
import { useInitialData } from '../lib/initialData';

// This must match exactly what your backend returns and what ProjectGalleryModal expects
type ProjectMedia = {
    type: 'image' | 'video';
    src: string;
};

type Project = {
    id: number;
    title: string;
    description: string;
    coverImage: string;
    media: ProjectMedia[];
};

const WorkPage = () => {
    const initialProjects = useInitialData<Project>('projects');
    const [projects, setProjects] = useState<Project[]>(initialProjects ?? []);
    const [loading, setLoading] = useState(!initialProjects);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const API_URL = getApiUrl();
    const SERVER_URL = getApiBaseUrl();

    useEffect(() => {
        // Already rendered with the server's data
        if (initialProjects) return;
        const fetchProjects = async () => {
            try {
                const res = await fetch(`${API_URL}/projects?limit=100`);
                const data = await res.json();
                setProjects(Array.isArray(data.data) ? data.data : []);
            } catch (err) {
                console.error('Failed to load projects:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [API_URL, initialProjects]);

    const handleOpenGallery = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const getFullUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${SERVER_URL}${path}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Banner
                title="Proiectele Noastre"
                subtitle="O selecție a celor mai reprezentative lucrări din portofoliul Corsican Engineering"
                backgroundImage="/images/banners/services-banner.jpg"
            />

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={getFullUrl(project.coverImage)}
                                        alt={project.title}
                                        width={800}
                                        height={600}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => handleOpenGallery(project)}
                                            className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg"
                                        >
                                            Vezi Galerie
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                                    <p className="text-gray-600 line-clamp-3 text-sm">{project.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {projects.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium">Momentan nu există proiecte publicate.</p>
                        </div>
                    )}
                </div>
            </section>

            {selectedProject && (
                <ProjectGalleryModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    projectTitle={selectedProject.title}
                    media={selectedProject.media.map(m => ({
                        type: m.type,
                        src: getFullUrl(m.src)
                    }))}
                />
            )}
        </div>
    );
};

export default WorkPage;