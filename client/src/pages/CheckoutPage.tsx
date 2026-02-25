import {useMemo, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { getApiUrl } from '../services/env';
import {useCart} from '../lib/cart';

type ShippingDetails = {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
};

type InvoiceDetails = {
    needInvoice: boolean;
    companyName: string;
    cui: string;
    companyAddress: string;
};

type PaymentMethod = 'cash' | 'bank' | 'card';

const steps = ['Livrare', 'Facturare', 'Plată', 'Confirmare'] as const;
type StepIndex = 0 | 1 | 2 | 3;

type FieldErrors = Partial<Record<keyof ShippingDetails, string>>;

const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
const isPhoneValid = (phone: string) => {
    const cleaned = phone.replace(/[^\d+]/g, '');
    return cleaned.length >= 8 && cleaned.length <= 15;
};

const CheckoutPage = () => {
    const navigate = useNavigate();
    const {items, clear} = useCart();

    const [step, setStep] = useState<StepIndex>(0);

    const [shipping, setShipping] = useState<ShippingDetails>({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
    });

    const [invoice, setInvoice] = useState<InvoiceDetails>({
        needInvoice: false,
        companyName: '',
        cui: '',
        companyAddress: '',
    });

    const [payment, setPayment] = useState<PaymentMethod>('cash');

    const [touched, setTouched] = useState<Partial<Record<keyof ShippingDetails, boolean>>>({});
    const [errors, setErrors] = useState<FieldErrors>({});

    const [placing, setPlacing] = useState(false);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);

    const API_BASE = getApiUrl();

    const total = useMemo(
        () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
        [items]
    );

    const validateShipping = (data: ShippingDetails): FieldErrors => {
        const e: FieldErrors = {};

        if (!data.fullName.trim() || data.fullName.trim().length < 2) e.fullName = 'Introduceți numele complet.';
        if (!data.phone.trim() || !isPhoneValid(data.phone)) e.phone = 'Introduceți un număr de telefon valid.';
        if (!data.email.trim() || !isEmailValid(data.email)) e.email = 'Introduceți un email valid.';
        if (!data.city.trim() || data.city.trim().length < 2) e.city = 'Introduceți orașul.';
        if (!data.address.trim() || data.address.trim().length < 5) e.address = 'Introduceți adresa completă.';

        return e;
    };

    const canNext = () => {
        if (items.length === 0) return false;

        if (step === 0) {
            const e = validateShipping(shipping);
            return Object.keys(e).length === 0;
        }

        if (step === 1) {
            if (!invoice.needInvoice) return true;
            return Boolean(invoice.companyName.trim() && invoice.cui.trim() && invoice.companyAddress.trim());
        }

        if (step === 2) return Boolean(payment);

        return true;
    };

    const next = () => {
        if (step === 0) {
            const e = validateShipping(shipping);
            setErrors(e);
            setTouched({fullName: true, phone: true, email: true, city: true, address: true});
            if (Object.keys(e).length > 0) return;
        }

        setStep((s) => (s < 3 ? ((s + 1) as StepIndex) : s));
    };

    const back = () => setStep((s) => (s > 0 ? ((s - 1) as StepIndex) : s));

    const placeOrder = async () => {
        setPlacing(true);
        try {
            const res = await fetch(`${API_BASE}/orders`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    items: items.map((it) => ({
                        productId: it.productId,
                        quantity: it.quantity,
                    })),
                    shipping,
                    invoice,
                    paymentMethod: payment,
                }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                alert(err?.msg || 'Eroare la plasarea comenzii.');
                return;
            }

            const data = await res.json();

            if (data?.paymentURL) {
                clear();
                window.location.href = data.paymentURL;
                return;
            }

            setOrderNumber(data?.orderNumber || null);
            clear();
        } catch (e) {
            alert('Nu s-a putut contacta serverul. Verificați conexiunea.');
        } finally {
            setPlacing(false);
        }
    };

    const fieldClass = (key: keyof ShippingDetails) => {
        const hasErr = Boolean(errors[key] && touched[key]);
        return `w-full border rounded p-2 ${hasErr ? 'border-red-500' : 'border-gray-200'}`;
    };

    if (items.length === 0 && !orderNumber) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Finalizare comandă</h1>
                    <p className="text-gray-600 mt-2">Coșul este gol. Adaugă produse înainte de finalizare.</p>
                    <Link to="/magazin" className="inline-block mt-6 font-bold text-slate-900 hover:underline">
                        Mergi la magazin →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <section className="py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Finalizare comandă</h1>
                            <p className="text-gray-600 mt-1">Completează pașii de mai jos.</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate('/cos')}
                            className="text-sm font-bold text-slate-900 hover:underline"
                        >
                            ← Înapoi la coș
                        </button>
                    </div>

                    {/* Step indicator */}
                    <div className="grid grid-cols-4 gap-2 mb-8">
                        {steps.map((label, idx) => {
                            const active = idx === step;
                            const done = idx < step;
                            return (
                                <div
                                    key={label}
                                    className={`rounded-lg px-3 py-2 text-sm font-bold text-center border ${
                                        active
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : done
                                                ? 'bg-green-50 text-green-800 border-green-200'
                                                : 'bg-white text-gray-600 border-gray-200'
                                    }`}
                                >
                                    {label}
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: step content */}
                        <div className="lg:col-span-2 border rounded-xl p-6">
                            {step === 0 && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Detalii livrare</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Nume complet</label>
                                            <input
                                                className={fieldClass('fullName')}
                                                value={shipping.fullName}
                                                onBlur={() => setTouched((t) => ({...t, fullName: true}))}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    const nextShipping = {...shipping, fullName: v};
                                                    setShipping(nextShipping);
                                                    setErrors(validateShipping(nextShipping));
                                                }}
                                            />
                                            {touched.fullName && errors.fullName ? (
                                                <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Telefon</label>
                                            <input
                                                className={fieldClass('phone')}
                                                value={shipping.phone}
                                                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    const nextShipping = { ...shipping, phone: v };
                                                    setShipping(nextShipping);
                                                    setErrors(validateShipping(nextShipping));
                                                }}
                                            />
                                            {touched.phone && errors.phone ? (
                                                <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Email</label>
                                            <input
                                                className={fieldClass('email')}
                                                value={shipping.email}
                                                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    const nextShipping = { ...shipping, email: v };
                                                    setShipping(nextShipping);
                                                    setErrors(validateShipping(nextShipping));
                                                }}
                                            />
                                            {touched.email && errors.email ? (
                                                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Oraș</label>
                                            <input
                                                className={fieldClass('city')}
                                                value={shipping.city}
                                                onBlur={() => setTouched((t) => ({ ...t, city: true }))}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    const nextShipping = { ...shipping, city: v };
                                                    setShipping(nextShipping);
                                                    setErrors(validateShipping(nextShipping));
                                                }}
                                            />
                                            {touched.city && errors.city ? (
                                                <p className="text-xs text-red-600 mt-1">{errors.city}</p>
                                            ) : null}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-1">Adresă</label>
                                            <input
                                                className={fieldClass('address')}
                                                value={shipping.address}
                                                onBlur={() => setTouched((t) => ({ ...t, address: true }))}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    const nextShipping = { ...shipping, address: v };
                                                    setShipping(nextShipping);
                                                    setErrors(validateShipping(nextShipping));
                                                }}
                                            />
                                            {touched.address && errors.address ? (
                                                <p className="text-xs text-red-600 mt-1">{errors.address}</p>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 1 && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Detalii facturare</h2>

                                    <label className="flex items-center gap-2 font-medium">
                                        <input
                                            type="checkbox"
                                            checked={invoice.needInvoice}
                                            onChange={(e) => setInvoice((i) => ({...i, needInvoice: e.target.checked}))}
                                        />
                                        Doresc factură pe firmă
                                    </label>

                                    {invoice.needInvoice && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Denumire firmă</label>
                                                <input
                                                    className="w-full border rounded p-2"
                                                    value={invoice.companyName}
                                                    onChange={(e) => setInvoice((i) => ({
                                                        ...i,
                                                        companyName: e.target.value
                                                    }))}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1">CUI</label>
                                                <input
                                                    className="w-full border rounded p-2"
                                                    value={invoice.cui}
                                                    onChange={(e) => setInvoice((i) => ({...i, cui: e.target.value}))}
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-1">Adresă firmă</label>
                                                <input
                                                    className="w-full border rounded p-2"
                                                    value={invoice.companyAddress}
                                                    onChange={(e) => setInvoice((i) => ({
                                                        ...i,
                                                        companyAddress: e.target.value
                                                    }))}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 2 && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Metodă de plată</h2>

                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="payment"
                                                checked={payment === 'cash'}
                                                onChange={() => setPayment('cash')}
                                            />
                                            Ramburs (cash la livrare)
                                        </label>

                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="payment"
                                                checked={payment === 'bank'}
                                                onChange={() => setPayment('bank')}
                                            />
                                            Transfer bancar
                                        </label>

                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="payment"
                                                checked={payment === 'card'}
                                                onChange={() => setPayment('card')}
                                            />
                                            Card online
                                        </label>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Confirmare</h2>

                                    {orderNumber ? (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <p className="font-bold text-green-900">Comanda a fost înregistrată!</p>
                                            <p className="text-sm text-green-800 mt-1">
                                                Număr comandă: <span className="font-bold">{orderNumber}</span>
                                            </p>
                                            <Link to="/magazin"
                                                  className="inline-block mt-3 font-bold text-slate-900 hover:underline">
                                                Înapoi la magazin →
                                            </Link>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-gray-50 border rounded-lg p-4">
                                                <p className="font-bold text-gray-900">Total: {total} RON</p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Apasă „Plasează comanda” pentru a o salva în sistem.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                disabled={placing}
                                                className={`mt-6 w-full px-6 py-3 rounded-lg text-white font-bold ${
                                                    placing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                                                }`}
                                                onClick={placeOrder}
                                            >
                                                {placing ? 'Se trimite...' : 'Plasează comanda'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Step controls */}
                            <div className="mt-8 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={back}
                                    disabled={step === 0}
                                    className={`px-4 py-2 rounded-lg font-bold border ${
                                        step === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    ← Înapoi
                                </button>

                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={next}
                                        disabled={!canNext()}
                                        className={`px-6 py-2 rounded-lg font-bold ${
                                            canNext()
                                                ? 'bg-slate-900 text-white hover:opacity-95'
                                                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                        }`}
                                    >
                                        Continuă →
                                    </button>
                                ) : null}
                            </div>
                        </div>

                        {/* Right: order summary */}
                        <aside className="border rounded-xl p-6 h-fit">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Sumar</h3>

                            <div className="space-y-3">
                                {items.map((it) => (
                                    <div key={it.productId} className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">{it.title}</p>
                                            <p className="text-xs text-gray-600">
                                                {it.quantity} × {it.price} RON
                                            </p>
                                        </div>
                                        <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
                                            {it.quantity * it.price} RON
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t mt-4 pt-4 flex items-center justify-between">
                                <span className="text-sm text-gray-600">Total</span>
                                <span className="text-lg font-bold text-gray-900">{total} RON</span>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CheckoutPage;