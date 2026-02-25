import Banner from '../components/Banner';

const PoliticaConfidentialitatePage = () => {
    return (
        <div className="min-h-screen bg-white">
            <title>Politica de Confidențialitate — Corsican Engineering</title>
            <Banner title="Politica de Confidențialitate" height="h-48" />

            <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-slate">
                <p className="text-sm text-gray-500 mb-8">Ultima actualizare: februarie 2026</p>

                <h2>1. Operatorul de date</h2>
                <p>
                    Operatorul datelor cu caracter personal este{' '}
                    <strong>[COMPLETAȚI — denumire juridică completă]</strong>, CUI{' '}
                    <strong>[COMPLETAȚI]</strong>, cu sediul în{' '}
                    <strong>[COMPLETAȚI — adresă sediu]</strong>, e-mail:{' '}
                    <a href="mailto:office@corsican.ro">office@corsican.ro</a>.
                </p>
                <p>
                    Responsabil cu Protecția Datelor (DPO):{' '}
                    <strong>[COMPLETAȚI — email DPO, dacă este cazul]</strong>.
                </p>

                <h2>2. Datele colectate</h2>
                <p>Colectăm exclusiv datele necesare procesării comenzilor:</p>
                <ul>
                    <li>Nume și prenume</li>
                    <li>Număr de telefon</li>
                    <li>Adresă de e-mail</li>
                    <li>Adresă de livrare (stradă, oraș)</li>
                    <li>Date de facturare (dacă solicitați factură pe firmă): denumire firmă, CUI, adresă</li>
                </ul>
                <p>
                    Nu colectăm date despre card bancar — plățile prin card sunt procesate direct de Netopia
                    Payments S.A., care are propriile politici de confidențialitate.
                </p>

                <h2>3. Scopul și temeiul juridic</h2>
                <p>
                    Datele sunt prelucrate în scopul <strong>executării contractului</strong> de vânzare la
                    distanță (art. 6 alin. 1 lit. b GDPR): procesarea comenzii, livrarea produselor,
                    emiterea facturii și comunicarea cu dvs. referitor la comandă.
                </p>

                <h2>4. Durata păstrării datelor</h2>
                <p>
                    Datele aferente comenzilor sunt păstrate timp de <strong>5 ani</strong> de la data
                    comenzii, în conformitate cu obligațiile legale de arhivare fiscală (Legea
                    contabilității nr. 82/1991). La expirarea termenului, datele sunt șterse sau
                    anonimizate.
                </p>

                <h2>5. Destinatarii datelor</h2>
                <p>
                    Datele sunt transmise exclusiv partenerilor necesari executării contractului:
                </p>
                <ul>
                    <li>
                        <strong>Curier rapid</strong> — pentru livrarea coletului (nume, telefon, adresă de
                        livrare)
                    </li>
                    <li>
                        <strong>Netopia Payments S.A.</strong> — procesator de plăți (pentru plăți prin
                        card online)
                    </li>
                </ul>
                <p>Nu vindem, închiriem sau transmitem datele dvs. altor terți.</p>

                <h2>6. Drepturile dvs.</h2>
                <p>Conform GDPR, aveți dreptul la:</p>
                <ul>
                    <li>
                        <strong>Acces</strong> — să obțineți o copie a datelor prelucrate
                    </li>
                    <li>
                        <strong>Rectificare</strong> — să corectați datele inexacte
                    </li>
                    <li>
                        <strong>Ștergere</strong> — să solicitați ștergerea datelor, în limitele
                        obligațiilor legale
                    </li>
                    <li>
                        <strong>Portabilitate</strong> — să primiți datele într-un format structurat
                    </li>
                    <li>
                        <strong>Restricționare</strong> și <strong>opoziție</strong> la prelucrare
                    </li>
                </ul>
                <p>
                    Cererile se transmit la{' '}
                    <a href="mailto:office@corsican.ro">office@corsican.ro</a>. Aveți de asemenea dreptul
                    de a depune plângere la{' '}
                    <strong>ANSPDCP</strong> (Autoritatea Națională de Supraveghere a Prelucrării Datelor
                    cu Caracter Personal) —{' '}
                    <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer">
                        dataprotection.ro
                    </a>
                    .
                </p>

                <h2>7. Securitate</h2>
                <p>
                    Aplicăm măsuri tehnice și organizatorice adecvate pentru protejarea datelor împotriva
                    accesului neautorizat, pierderii sau distrugerii (conexiuni criptate HTTPS, acces
                    restricționat la baza de date).
                </p>
            </section>
        </div>
    );
};

export default PoliticaConfidentialitatePage;
