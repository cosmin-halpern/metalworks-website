import Banner from '../components/Banner';

const PoliticaCookiesPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <title>Politica de Cookies — Corsican Engineering</title>
            <Banner title="Politica de Cookies" height="h-48" />

            <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-slate">
                <p className="text-sm text-gray-500 mb-8">Ultima actualizare: februarie 2026</p>

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
                        <strong>Consimțământul cookie</strong> (<code>cookie_consent</code>) — reținem
                        că ați vizualizat și acceptat prezenta politică
                    </li>
                </ul>

                <h2>3. Cookie-uri de urmărire și analiză</h2>
                <p>
                    În prezent, <strong>nu folosim</strong> cookie-uri de analiză (ex. Google Analytics),
                    cookie-uri de marketing sau cookie-uri de urmărire terțe.
                </p>

                <h2>4. Cookie-uri strict necesare</h2>
                <p>
                    Stocarea locală menționată mai sus (coș de cumpărături) este strict necesară
                    funcționării magazinului online. Fără ea, experiența de cumpărare nu poate fi asigurată.
                </p>

                <h2>5. Cum puteți controla sau șterge datele stocate</h2>
                <p>
                    Puteți șterge oricând datele stocate local din setările browserului:
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
