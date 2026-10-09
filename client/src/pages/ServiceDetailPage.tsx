import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle, Phone } from 'lucide-react';
import Banner from '../components/Banner';
import ProjectGalleryModal from '../components/ProjectGalleryModal';
import NotFoundPage from './NotFoundPage';
import { findServicePage, servicePages } from '../data/services';
import { getApiBaseUrl, getApiUrl } from '../services/env';

type ProjectMedia = { type: 'image' | 'video'; src: string };
type Project = { id: number; title: string; coverImage: string; media: ProjectMedia[] };

// Photos shown on the page; the rest are in the full gallery
const PREVIEW_COUNT = 8;

const steps = [
    { title: 'Proiectare', text: 'Analizăm cerințele și realizăm proiectul și desenele de execuție.' },
    { title: 'Execuție', text: 'Fabricăm componentele cu accent pe precizie și calitatea îmbinărilor.' },
    { title: 'Montaj', text: 'Montăm și punem în funcțiune la fața locului.' },
];

const ServiceDetailPage = () => {
    const { slug } = useParams();
    const service = findServicePage(slug);

    const [projects, setProjects] = useState<Project[]>([]);
    const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

    const API_URL = getApiUrl();
    const SERVER_URL = getApiBaseUrl() || window.location.origin;
    const fullUrl = (src: string) => (src.startsWith('http') ? src : `${SERVER_URL}${src}`);

    useEffect(() => {
        if (!service) return;
        setProjects([]);
        fetch(`${API_URL}/projects?limit=100`)
            .then((res) => res.json())
            .then((data) => {
                const all: Project[] = Array.isArray(data.data) ? data.data : [];
                setProjects(all.filter((p) => service.projectIds.includes(p.id)));
            })
            .catch((err) => console.error('Failed to load service photos:', err));
    }, [API_URL, service]);

    if (!service) return <NotFoundPage />;

    const media = projects.flatMap((p) => p.media.map((m) => ({ ...m, src: fullUrl(m.src) })));
    const images = media
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item.type === 'image');
    const cover = projects[0]?.coverImage ? fullUrl(projects[0].coverImage) : undefined;
    const otherServices = servicePages.filter((s) => s.slug !== service.slug);

    return (
        <div className="min-h-screen bg-white">
            <Banner
                title={service.name}
                subtitle={service.summary}
                backgroundImage={cover}
                height="h-72 md:h-80"
            />

            <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-sm text-gray-500">
                <Link to="/" className="hover:text-primary">Acasă</Link>
                <span className="mx-2">/</span>
                <Link to="/servicii" className="hover:text-primary">Servicii</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-700">{service.name}</span>
            </nav>

            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    <div className="lg:col-span-3 space-y-5 text-lg text-gray-700 leading-relaxed">
                        {service.intro.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>
                    <div className="lg:col-span-2 bg-neutral-light rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Ce includ serviciile noastre</h2>
                        <ul className="space-y-3">
                            {service.includes.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-gray-700">
                                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section className="bg-neutral-light py-12 md:py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">Cum lucrăm</h2>
                    <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {steps.map((step, index) => (
                            <li key={step.title} className="bg-white rounded-xl p-6 shadow-sm">
                                <span className="text-primary font-bold text-sm">Pasul {index + 1}</span>
                                <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2">{step.title}</h3>
                                <p className="text-gray-600">{step.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {images.length > 0 && (
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
                        Proiecte realizate
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {images.slice(0, PREVIEW_COUNT).map(({ item, index }) => (
                            <button
                                key={item.src}
                                type="button"
                                onClick={() => setGalleryIndex(index)}
                                className="aspect-square overflow-hidden rounded-lg group"
                                aria-label={`Deschide fotografia ${index + 1} din galerie`}
                            >
                                <img
                                    src={item.src}
                                    alt={`${service.name} – proiect realizat de Corsican Engineering`}
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </button>
                        ))}
                    </div>
                    {media.length > PREVIEW_COUNT && (
                        <div className="text-center mt-6">
                            <button
                                type="button"
                                onClick={() => setGalleryIndex(0)}
                                className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-primary hover:text-primary-dark border border-primary hover:border-primary-dark rounded-lg transition-colors"
                            >
                                Vezi toate cele {media.length} fotografii
                            </button>
                        </div>
                    )}
                </section>
            )}

            <section className="bg-primary-dark text-white py-12 md:py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Aveți un proiect?</h2>
                    <p className="text-gray-200 mb-8">
                        Spuneți-ne de ce aveți nevoie și vă trimitem o ofertă.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-white text-primary-dark font-medium hover:bg-gray-100 transition-colors"
                        >
                            Solicită o ofertă
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <a
                            href="tel:+40768515774"
                            className="inline-flex items-center justify-center px-8 py-3 rounded-md border border-white font-medium hover:bg-white/10 transition-colors"
                        >
                            <Phone className="mr-2 h-5 w-5" />
                            +40 768 515 774
                        </a>
                    </div>
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Alte servicii</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {otherServices.map((other) => (
                        <Link
                            key={other.slug}
                            to={`/servicii/${other.slug}`}
                            className="block border border-gray-200 rounded-lg p-5 hover:shadow-lg hover:border-primary transition-all"
                        >
                            <h3 className="font-bold text-gray-900 mb-1">{other.name}</h3>
                            <p className="text-sm text-gray-600">{other.summary}</p>
                        </Link>
                    ))}
                </div>
            </section>

            <ProjectGalleryModal
                open={galleryIndex !== null}
                onClose={() => setGalleryIndex(null)}
                projectTitle={service.name}
                media={media}
                initialIndex={galleryIndex ?? 0}
            />
        </div>
    );
};

export default ServiceDetailPage;
