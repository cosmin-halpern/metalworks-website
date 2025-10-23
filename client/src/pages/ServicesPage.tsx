import React from 'react';
import Banner from '../components/Banner';

interface Service {
  title: string;
  description: string;
  image: string;
}

const services: Service[] = [
  {
    title: 'Proiectare tehnică  personalizată',
    description: 'Creăm soluții de proiectare precise și eficiente, adaptate cerințelor fiecărui proiect',
    image: 'https://placehold.co/300x200/eeeeee/333333?text=Service+1',
  },
  {
    title: 'Execuție structuri metalice',
    description: 'Realizăm structuri metalice durabile și precise, conform celor mai înalte standarde de calitate',
    image: 'https://placehold.co/300x200/eeeeee/333333?text=Service+2',
  },
  {
    title: 'Montaj industrial',
    description: 'Asigurăm montajul sigur și eficient al instalațiilor industriale și al ansamblurilor metalice',
    image: 'https://placehold.co/300x200/eeeeee/333333?text=Service+3',
  },
  {
    title: 'Service și reparații',
    description: 'Oferim servicii profesionale de întreținere și reparații prin sudare, pentru prelungirea duratei de viață a echipamentelor',
    image: 'https://placehold.co/300x200/eeeeee/333333?text=Service+4',
  }
];

const ServicesPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-white">
      {/* Banner - Using the new Banner component */}
      <Banner
        title="Serviciile noastre"
        subtitle={'Descoperă performanța serviciilor Corsican. \nPentru noi – fiecare detaliu contează'}
        backgroundImage="/images/banners/services-banner.jpg"
        height="h-64"
      />

      {/* Services Grid */}
      <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(({ title, description, image }) => (
            <div
              key={title}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <img src={image} alt={title} className="w-full h-40 object-cover rounded-md mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
