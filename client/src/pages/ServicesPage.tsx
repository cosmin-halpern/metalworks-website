import React from "react";
import Banner from "../components/Banner";

interface Service {
  title: string;
  description: string;
  image: string;
}

const services: Service[] = [
  {
    title: "Custom Shelving Design",
    description: "We craft tailored shelving solutions to maximize your space and efficiency.",
    image: "https://placehold.co/300x200/eeeeee/333333?text=Service+1",
  },
  {
    title: "Heavy-Duty Industrial Racks",
    description: "Durable, high-capacity racking systems built for the toughest environments.",
    image: "https://placehold.co/300x200/eeeeee/333333?text=Service+2",
  },
  {
    title: "Retail Display Fixtures",
    description: "Eye-catching metal displays that showcase your products in style.",
    image: "https://placehold.co/300x200/eeeeee/333333?text=Service+3",
  },
  {
    title: "Custom Metal Fabrication",
    description: "Precision-cut and welded metal parts for bespoke projects.",
    image: "https://placehold.co/300x200/eeeeee/333333?text=Service+4",
  },
  {
    title: "Installation & Assembly",
    description: "On-site installation by our expert technicians, done right the first time.",
    image: "https://placehold.co/300x200/eeeeee/333333?text=Service+5",
  },
  {
    title: "Maintenance & Repair",
    description: "Keep your systems running smoothly with our scheduled maintenance packages.",
    image: "https://placehold.co/300x200/eeeeee/333333?text=Service+6",
  },
];

const ServicesPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-white">

      {/* Banner - Using the new Banner component */}
      <Banner
        title="Our Services"
        subtitle="Discover our comprehensive range of metal fabrication services"
        backgroundImage="/images/banners/services-banner.jpg"
        height="h-64"
      />

      {/* Services Grid */}
      <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-slate-800 mb-12">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(({ title, description, image }) => (
            <div
              key={title}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <img
                src={image}
                alt={title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {title}
              </h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ServicesPage; 