// Service pages (/servicii/:slug). Each page's title/description for search engines
// lives in public/seo-routes.json under the same path. Photos come from the matching
// projects managed in the admin (projectIds = project ids from /api/projects).

export type ServicePage = {
    slug: string;
    name: string;
    /** One line, used on cards and as the banner subtitle */
    summary: string;
    intro: string[];
    includes: string[];
    projectIds: number[];
};

export const servicePages: ServicePage[] = [
    {
        slug: 'structuri-metalice',
        name: 'Structuri metalice',
        summary: 'Structuri metalice complexe, proiectate și executate pentru a rezista pe termen lung.',
        intro: [
            'Proiectăm, executăm și montăm structuri metalice pentru spații industriale, comerciale și ' +
                'logistice. Fiecare structură este gândită pentru sarcinile și condițiile reale de utilizare, ' +
                'astfel încât să rămână sigură și stabilă ani la rând.',
            'Lucrăm de la desenul de execuție până la montajul final, cu aceeași echipă, ceea ce înseamnă ' +
                'un singur interlocutor pentru tot proiectul și mai puține surprize pe șantier.',
        ],
        includes: [
            'Proiectare și desene de execuție pentru structura metalică',
            'Debitare, sudare și asamblare în atelierul propriu',
            'Protecție anticorozivă și finisaj',
            'Transport și montaj la fața locului',
            'Modificări și consolidări ale structurilor existente',
        ],
        projectIds: [15],
    },
    {
        slug: 'instalatii-industriale-de-teava',
        name: 'Instalații industriale de țeavă',
        summary: 'Instalații de țeavă pentru fluide industriale: glicol, amoniac, CO2.',
        intro: [
            'Montăm instalații industriale de țeavă pentru transportul fluidelor tehnologice, precum ' +
                'glicol, amoniac și CO2, folosite în instalațiile frigorifice și în procesele industriale.',
            'Lucrările sunt executate de sudori cu omologări TÜV și Intertek, pentru îmbinări care ' +
                'respectă cerințele de calitate și siguranță ale acestor instalații.',
        ],
        includes: [
            'Trasee de țeavă pentru glicol, amoniac și CO2',
            'Sudură executată de sudori omologați TÜV și Intertek',
            'Prefabricarea tronsoanelor în atelier',
            'Suporți și structuri metalice pentru trasee',
            'Montaj la fața locului',
        ],
        projectIds: [16],
    },
    {
        slug: 'rafturi-industriale',
        name: 'Rafturi industriale',
        summary: 'Rafturi metalice personalizate, create pentru a maximiza spațiul și productivitatea.',
        intro: [
            'Producem rafturi metalice personalizate pentru depozite, magazine și spații de producție. ' +
                'Le dimensionăm după spațiul disponibil, după greutatea și tipul mărfii, ca să folosiți cât ' +
                'mai bine fiecare metru pătrat.',
            'Pe lângă rafturile din oferta magazinului online, realizăm și variante la comandă, adaptate ' +
                'fluxului de lucru din spațiul dumneavoastră.',
        ],
        includes: [
            'Rafturi metalice la dimensiuni personalizate',
            'Dimensionare în funcție de sarcina pe raft',
            'Rafturi pentru depozite, magazine și ateliere',
            'Livrare și montaj',
        ],
        projectIds: [11],
    },
    {
        slug: 'mobilier-industrial-si-terase-metalice',
        name: 'Mobilier industrial și terase metalice',
        summary: 'Terase metalice și mobilier în stil industrial, adaptate oricărui spațiu.',
        intro: [
            'Construim terase metalice durabile și mobilier în stil industrial pentru restaurante, ' +
                'cafenele, birouri și spații comerciale, adaptate oricărui spațiu și stil arhitectural.',
            'Combinăm structura metalică cu lemn, sticlă sau alte materiale, astfel încât rezultatul să ' +
                'fie rezistent la utilizarea intensă și să arate bine.',
        ],
        includes: [
            'Terase metalice pentru restaurante și cafenele',
            'Mese, scaune și mobilier în stil industrial',
            'Structuri pentru copertine și închideri de terasă',
            'Execuție la comandă, după proiect',
        ],
        projectIds: [12],
    },
];

export function findServicePage(slug: string | undefined): ServicePage | undefined {
    return servicePages.find((s) => s.slug === slug);
}
