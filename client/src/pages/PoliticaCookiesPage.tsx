import Banner from '../components/Banner';

const PoliticaCookiesPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Banner title="Politica de Cookies" height="h-48" />

            <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-slate">
                <p className="text-sm text-gray-500 mb-8">Ultima actualizare: octombrie 2026</p>

                <h2>1. Ce sunt cookie-urile?</h2>
                <p>
                    Cookie-urile sunt fișiere text de mici dimensiuni stocate de browserul dvs. atunci când
                    vizitați un site web. Acestea permit site-ului să vă recunoască la vizite ulterioare și
                    să rețină anumite preferințe.
                </p>

                <h2>2. Ce stocăm în browserul dvs.</h2>
                <p>
                    Site-ul nostru utilizează <strong>localStorage</strong> (stocare locală în browser —
                    tehnologie similară cookie-urilor, dar fără dată de expirare automată) pentru:
                </p>
                <ul>
                    <li>
                        <strong>Coșul de cumpărături</strong> (<code>cart</code>) — reținem produsele
                        adăugate în coș între sesiuni, astfel încât coșul să nu se golească la închiderea
                        browserului
                    </li>
                    <li>
                        <strong>Preferința privind cookie-urile</strong> (<code>cookie_consent_v2</code>) —
                        reținem dacă ați acceptat sau refuzat cookie-urile de marketing, pentru a nu vă
                        întreba la fiecare vizită
                    </li>
                </ul>

                <h2>3. Cookie-uri strict necesare</h2>
                <p>
                    Stocarea locală menționată mai sus este strict necesară funcționării magazinului
                    online și nu necesită consimțământul dvs.
                </p>

                <h2>4. Cookie-uri de marketing (Meta Pixel)</h2>
                <p>
                    <strong>Numai dacă le acceptați</strong> din bannerul de cookie-uri, folosim Meta Pixel,
                    un instrument furnizat de Meta Platforms Ireland Ltd. (Facebook, Instagram), pentru a
                    măsura eficiența reclamelor noastre și pentru a afișa reclame relevante persoanelor care
                    au vizitat site-ul. Dacă refuzați, Meta Pixel nu este încărcat.
                </p>
                <ul>
                    <li>
                        <code>_fbp</code> — identifică browserul dvs. pentru măsurarea reclamelor; durată:
                        90 de zile
                    </li>
                    <li>
                        <code>_fbc</code> — reține reclama de pe care ați ajuns pe site, dacă este cazul;
                        durată: 90 de zile
                    </li>
                </ul>
                <p>
                    Informațiile colectate (paginile vizitate, adresa IP, tipul browserului) sunt
                    prelucrate de Meta conform{' '}
                    <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">
                        politicii sale de confidențialitate
                    </a>
                    . Nu folosim cookie-uri de analiză (ex. Google Analytics).
                </p>

                <h2>5. Cum vă puteți retrage consimțământul sau șterge datele</h2>
                <p>
                    Vă puteți schimba oricând alegerea din linkul <strong>„Setări cookie-uri”</strong>{' '}
                    din subsolul paginii. Dacă retrageți consimțământul, Meta Pixel nu mai este folosit,
                    iar cookie-urile <code>_fbp</code> și <code>_fbc</code> sunt șterse.
                </p>
                <p>
                    De asemenea, puteți șterge oricând datele stocate din setările browserului:
                </p>
                <ul>
                    <li>
                        <strong>Chrome:</strong> Setări → Confidențialitate și securitate → Ștergeți datele
                        de navigare → Imagini și fișiere din cache / Date despre site
                    </li>
                    <li>
                        <strong>Firefox:</strong> Setări → Confidențialitate și securitate → Cookie-uri și
                        date despre site → Ștergeți datele
                    </li>
                    <li>
                        <strong>Safari:</strong> Preferințe → Confidențialitate → Gestionați datele despre
                        site-uri web
                    </li>
                </ul>
                <p>
                    Dezactivarea stocării locale poate împiedica funcționarea coșului de cumpărături.
                </p>

                <h2>6. Contact</h2>
                <p>
                    Pentru orice întrebări legate de utilizarea datelor, ne puteți contacta la{' '}
                    <a href="mailto:office@corsican.ro">office@corsican.ro</a>.
                </p>
            </section>
        </div>
    );
};

export default PoliticaCookiesPage;
