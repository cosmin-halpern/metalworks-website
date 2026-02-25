import Banner from '../components/Banner';

const PoliticaReturPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <title>Politica de Retur — Corsican Engineering</title>
            <Banner title="Politica de Retur" height="h-48" />

            <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-slate">
                <p className="text-sm text-gray-500 mb-8">Ultima actualizare: februarie 2026</p>

                <h2>1. Termenul de retur</h2>
                <p>
                    Conform OUG 34/2014, aveți dreptul să returnați produsele achiziționate în{' '}
                    <strong>14 zile calendaristice</strong> de la data primirii coletului, fără a fi
                    necesară o justificare.
                </p>

                <h2>2. Excepții</h2>
                <p>Dreptul de retur <strong>nu se aplică</strong> pentru:</p>
                <ul>
                    <li>
                        Produse realizate <strong>la comandă</strong> conform specificațiilor
                        Cumpărătorului (construcții metalice personalizate, piese prelucrate după desen
                        tehnic)
                    </li>
                    <li>
                        Produse care au fost <strong>instalate sau montate</strong> și care nu mai pot fi
                        readuse la starea inițială
                    </li>
                </ul>

                <h2>3. Starea produsului returnat</h2>
                <p>Produsul trebuie returnat:</p>
                <ul>
                    <li>În starea în care a fost primit, fără a fi utilizat sau deteriorat</li>
                    <li>În ambalajul original, dacă este posibil</li>
                    <li>Împreună cu toate accesoriile și documentele primite</li>
                </ul>
                <p>
                    Dacă produsul a scăzut în valoare ca urmare a manipulării excesive dincolo de
                    necesitățile de verificare, ne rezervăm dreptul de a deduce această depreciere din
                    valoarea rambursată.
                </p>

                <h2>4. Cum inițiați returul</h2>
                <ol>
                    <li>
                        Trimiteți un e-mail la{' '}
                        <a href="mailto:office@corsican.ro">office@corsican.ro</a> cu subiectul{' '}
                        <strong>„Retur comandă [numărul comenzii]"</strong>
                    </li>
                    <li>Veți primi în maxim 2 zile lucrătoare instrucțiunile de returnare</li>
                    <li>
                        Expediați produsul la adresa indicată; costurile de retur sunt suportate de
                        Cumpărător
                    </li>
                </ol>

                <h2>5. Rambursarea</h2>
                <p>
                    Rambursarea sumei aferente produsului (excluzând costurile de livrare inițiale) se
                    efectuează în cel mult <strong>14 zile calendaristice</strong> de la data la care am
                    primit produsul returnat sau dovada expedierii, utilizând aceeași metodă de plată ca la
                    cumpărare.
                </p>

                <h2>6. Produse defecte sau neconforme</h2>
                <p>
                    Dacă ați primit un produs defect sau neconform cu descrierea, contactați-ne la{' '}
                    <a href="mailto:office@corsican.ro">office@corsican.ro</a> în cel mult 48 de ore de la
                    livrare, atașând fotografii cu defectul constatat. În acest caz, costurile de retur și
                    înlocuire sunt suportate de Vânzător.
                </p>

                <h2>7. Contact</h2>
                <p>
                    Pentru orice clarificări, ne puteți contacta la{' '}
                    <a href="mailto:office@corsican.ro">office@corsican.ro</a> sau la telefon{' '}
                    <a href="tel:+40768515774">+40 768 515 774</a>.
                </p>
            </section>
        </div>
    );
};

export default PoliticaReturPage;
