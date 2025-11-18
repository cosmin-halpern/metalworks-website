import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectGalleryModal from '../components/ProjectGalleryModal';
import Banner from '../components/Banner';

type ProjectMedia = {
    type: 'image' | 'video';
    src: string;
};

type Project = {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    media: ProjectMedia[];
};

const projects: Project[] = [
    {
        id: 'rafturi-industriale',
        title: 'Rafturi industriale',
        description: 'Soluții robuste de depozitare pentru spații industriale.',
        coverImage: '/images/imaginiProiecteleNoastre/imaginiRafturiIndustriale/rafturi7.jpg',
        media: [
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiRafturiIndustriale/rafturi1.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiRafturiIndustriale/rafturi2.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiRafturiIndustriale/rafturi3.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiRafturiIndustriale/rafturi4.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiRafturiIndustriale/rafturi5.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiRafturiIndustriale/rafturi6.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiRafturiIndustriale/rafturi7.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiRafturiIndustriale/rafturi8.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiRafturiIndustriale/rafturi9.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiRafturiIndustriale/rafturi10.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiRafturiIndustriale/rafturi11.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiRafturiIndustriale/rafturi12.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiRafturiIndustriale/rafturi13.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiRafturiIndustriale/rafturi14.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiRafturiIndustriale/rafturi15.jpg' },
            { type: 'video', src: '/images/imaginiProiecteleNoastre/imaginiRafturiIndustriale/VideoRafturi1.mp4' }
        ]
    },
    {
        id: 'structuri-metalice',
        title: 'Structuri metalice',
        description: 'Structuri metalice pentru hale, platforme și alte aplicații.',
        coverImage: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri1.jpg',
        media: [
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri1.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri2.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri3.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri4.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri5.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri6.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri7.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri8.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri9.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri10.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri11.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri12.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri13.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri14.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri15.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri16.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri17.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri18.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri19.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri20.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri21.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri22.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri23.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri24.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri25.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri26.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri27.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri28.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri29.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri30.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri31.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri32.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri33.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri34.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri35.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri36.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri37.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri38.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri39.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri40.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiStructuriMetalice/structuri41.jpg' }
        ]
    },
    {
        id: 'instalatii-teava',
        title: 'Instalații de țeavă',
        description: 'Instalații industriale de țeavă pentru diverse aplicații.',
        coverImage: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii1.jpg',
        media: [
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii1.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii2.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii3.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii4.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii5.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii6.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii7.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii8.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii9.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii10.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii11.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii12.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii13.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii14.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii15.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii16.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii17.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii18.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii19.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii20.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiInstalatiiTeava/instalatii21.jpg' }
        ]
    },
    {
        id: 'protectii-inox',
        title: 'Protecții inox',
        description: 'Protecții și finisaje din inox pentru medii exigente.',
        coverImage: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii1.jpg',
        media: [
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii1.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii2.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii3.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii4.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii5.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii6.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii7.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii8.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii9.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii10.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii11.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii12.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii13.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii14.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii15.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii16.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii17.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii18.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii19.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii20.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii21.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii22.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii23.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii24.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii25.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii26.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii27.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii28.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii29.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiProtectiiInox/protectii30.jpg' }
        ]
    },
    {
        id: 'terase-mobilier-horeca',
        title: 'Terase & mobilier HoReCa',
        description: 'Structuri și mobilier metalic pentru terase și spații HoReCa.',
        coverImage: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase1.jpg',
        media: [
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase1.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase2.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase3.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase4.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase5.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase6.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase7.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase8.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase9.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase10.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase11.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase12.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase13.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase14.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase15.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase16.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase17.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase18.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase19.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase20.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase21.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase22.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase23.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase24.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase25.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase26.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase27.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase28.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase29.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase30.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase31.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase32.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiTeraseMobilierHoreca/terase33.jpg' }
        ]
    },
    {
        id: 'carucioare-marfa',
        title: 'Cărucioare marfă',
        description: 'Cărucioare personalizate pentru manipularea mărfurilor.',
        coverImage: '/images/imaginiProiecteleNoastre/imaginiCarucioareMarfa/carucioare1.jpg',
        media: [
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiCarucioareMarfa/carucioare1.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiCarucioareMarfa/carucioare2.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiCarucioareMarfa/carucioare3.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiCarucioareMarfa/carucioare4.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiCarucioareMarfa/carucioare5.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiCarucioareMarfa/carucioare6.jpg' },
            { type: 'image', src: '/images/imaginiProiecteleNoastre/imaginiCarucioareMarfa/carucioare7.jpg' },
        ]
    }
];

const WorkPage: React.FC = () => {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const selectedProject = projects.find((p) => p.id === selectedProjectId);

    return (
        <div className="min-h-screen bg-white">
            {/* Page Banner */}
            <Banner
                title="Proiectele noastre"
                subtitle="O selecție de lucrări realizate pentru clienții noștri"
                backgroundImage="/images/banners/services-banner.png"
                height="h-72 md:h-80"
                backgroundColor="bg-primary-dark"
            />

            {/* Projects Section */}
            <section className="py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="bg-neutral-light rounded-xl overflow-hidden flex flex-col"
                            >
                                <div className="aspect-video bg-gray-200">
                                    <img
                                        src={project.coverImage}
                                        alt={project.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {project.title}
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-600 flex-1">
                                        {project.description}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedProjectId(project.id)}
                                        className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
                                    >
                                        Vezi galeria
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Modal */}
            <ProjectGalleryModal
                open={!!selectedProject}
                onClose={() => setSelectedProjectId(null)}
                projectTitle={selectedProject?.title ?? ''}
                media={selectedProject?.media ?? []}
            />
        </div>
    );
};

export default WorkPage;