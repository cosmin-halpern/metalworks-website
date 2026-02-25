import Banner from '../components/Banner';

const TermeniConditiiPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <title>Termeni și Condiții — Corsican Engineering</title>
            <Banner title="Termeni și Condiții" height="h-48" />

            <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-slate">
                <p className="text-sm text-gray-500 mb-8">Ultima actualizare: februarie 2026</p>

                <h2>1. Informații despre vânzător</h2>
                <p>
                    Contractul de vânzare-cumpărare la distanță se încheie între dvs. (Cumpărătorul) și{' '}
                    <strong>[COMPLETAȚI — denumire juridică completă]</strong>, cu sediul în{' '}
                    <strong>[COMPLETAȚI — adresă sediu]</strong>, CUI <strong>[COMPLETAȚI]</strong>,
                    nr. Reg. Com. <strong>[COMPLETAȚI — J__/__/____]</strong>, e-mail:{' '}
                    <a href="mailto:office@corsican.ro">office@corsican.ro</a>, tel.:{' '}
                    <a href="tel:+40768515774">+40 768 515 774</a> (denumit în continuare „Vânzătorul").
                </p>

                <h2>2. Obiectul contractului</h2>
                <p>
                    Vânzătorul pune la dispoziția Cumpărătorilor produse din categoria construcțiilor
                    metalice și prelucrărilor mecanice, disponibile pe site-ul{' '}
                    <strong>corsican.ro</strong>. Plasarea unei comenzi constituie acceptul Cumpărătorului
                    față de prezentele Termeni și Condiții.
                </p>

                <h2>3. Prețuri și plată</h2>
                <p>
                    Toate prețurile afișate sunt exprimate în lei românești (RON) și includ TVA, dacă nu se
                    specifică altfel. Vânzătorul își rezervă dreptul de a modifica prețurile fără notificare
                    prealabilă; prețul aplicabil comenzii este cel afișat la momentul plasării comenzii.
                </p>
                <p>Metodele de plată acceptate sunt:</p>
                <ul>
                    <li>Ramburs (numerar la livrare)</li>
                    <li>Transfer bancar</li>
                    <li>Card bancar online (prin procesatorul de plăți Netopia Payments)</li>
                </ul>

                <h2>4. Livrare</h2>
                <p>
                    Termenul de livrare estimat este comunicat pe pagina produsului sau la confirmarea
                    comenzii. Livrarea se realizează pe teritoriul României prin curier rapid. Costul
                    livrării este afișat în etapa de finalizare a comenzii.
                </p>
                <p>
                    Riscul pierderii sau deteriorării produselor se transferă Cumpărătorului în momentul
                    livrării fizice a coletului.
                </p>

                <h2>5. Dreptul de retragere (OUG 34/2014)</h2>
                <p>
                    În conformitate cu Ordonanța de urgență nr. 34/2014, Cumpărătorul persoană fizică are
                    dreptul de a se retrage din contract, fără a invoca niciun motiv, în termen de{' '}
                    <strong>14 zile calendaristice</strong> de la data primirii produsului.
                </p>
                <p>
                    Pentru exercitarea dreptului de retragere, Cumpărătorul trebuie să transmită o
                    declarație neechivocă de retragere (de ex. prin e-mail la{' '}
                    <a href="mailto:office@corsican.ro">office@corsican.ro</a>) înainte de expirarea
                    termenului de 14 zile. Costurile directe de returnare a produsului sunt suportate de
                    Cumpărător.
                </p>
                <p>
                    <strong>Excepții:</strong> Dreptul de retragere nu se aplică produselor realizate
                    conform specificațiilor Cumpărătorului sau personalizate, conform art. 16 lit. (c) din
                    OUG 34/2014.
                </p>
                <p>
                    Rambursarea sumelor plătite se efectuează în cel mult 14 zile de la data la care
                    Vânzătorul a primit produsul returnat sau dovada expedierii acestuia, utilizând aceeași
                    metodă de plată ca cea folosită la cumpărare, dacă nu s-a convenit altfel.
                </p>

                <h2>6. Garanție și conformitate</h2>
                <p>
                    Produsele beneficiază de garanție legală de conformitate conform Legii nr. 449/2003
                    republicată. Orice defect de conformitate apărut în termen de 2 ani de la livrare poate
                    fi reclamat Vânzătorului.
                </p>

                <h2>7. Soluționarea litigiilor</h2>
                <p>
                    În caz de litigii, Cumpărătorul poate apela la:
                </p>
                <ul>
                    <li>
                        <strong>ANPC</strong> (Autoritatea Națională pentru Protecția Consumatorilor) —{' '}
                        <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer">
                            anpc.ro
                        </a>
                    </li>
                    <li>
                        Platforma europeană SOL (Soluționarea Online a Litigiilor) —{' '}
                        <a
                            href="https://ec.europa.eu/consumers/odr"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ec.europa.eu/consumers/odr
                        </a>
                    </li>
                    <li>Instanțele judecătorești competente din România</li>
                </ul>

                <h2>8. Legea aplicabilă</h2>
                <p>
                    Prezentul contract este guvernat de legislația română. Orice litigiu se soluționează de
                    instanțele judecătorești competente din România.
                </p>
            </section>
        </div>
    );
};

export default TermeniConditiiPage;
