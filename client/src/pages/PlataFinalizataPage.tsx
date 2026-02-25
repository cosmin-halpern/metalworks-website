import { useSearchParams, Link } from 'react-router-dom';

const PlataFinalizataPage = () => {
    const [searchParams] = useSearchParams();
    const orderNumber = searchParams.get('order');

    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="max-w-md mx-auto px-4 py-16 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-3">Plata a fost procesată</h1>
                <p className="text-gray-600 mb-2">
                    Vei primi un email de confirmare în scurt timp.
                </p>
                {orderNumber && (
                    <p className="text-sm text-gray-500 mb-6">
                        Număr comandă: <span className="font-bold text-gray-700">{orderNumber}</span>
                    </p>
                )}

                <Link
                    to="/magazin"
                    className="inline-block mt-4 font-bold text-slate-900 hover:underline"
                >
                    Înapoi la magazin →
                </Link>
            </div>
        </div>
    );
};

export default PlataFinalizataPage;
