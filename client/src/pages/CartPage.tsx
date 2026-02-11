import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../lib/cart';

const CartPage = () => {
    const navigate = useNavigate();
    const { items, increase, decrease, removeItem, clear } = useCart();

    const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

    return (
        <div className="min-h-screen bg-white">
            <section className="py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Coșul tău</h1>
                            <p className="text-gray-600 mt-1">Verifică produsele și continuă către finalizare.</p>
                        </div>

                        {items.length > 0 ? (
                            <button
                                type="button"
                                onClick={clear}
                                className="text-sm font-bold text-red-600 hover:underline"
                            >
                                Golește coșul
                            </button>
                        ) : null}
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-600 font-medium">Coșul este gol.</p>
                            <Link to="/magazin" className="inline-block mt-4 font-bold text-slate-900 hover:underline">
                                Mergi la magazin →
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {items.map((it) => (
                                <div key={it.productId} className="border rounded-xl p-4 flex gap-4">
                                    <div className="w-28 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                        <img
                                            src={it.imageUrl}
                                            alt={it.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="font-bold text-gray-900 truncate">{it.title}</p>
                                                <p className="text-sm text-gray-600">
                                                    {it.price} RON / buc
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeItem(it.productId)}
                                                className="text-sm font-bold text-red-600 hover:underline"
                                            >
                                                Șterge
                                            </button>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => decrease(it.productId)}
                                                    className="w-9 h-9 rounded-lg border font-bold hover:bg-gray-50"
                                                >
                                                    −
                                                </button>
                                                <div className="w-12 text-center font-bold">{it.quantity}</div>
                                                <button
                                                    type="button"
                                                    onClick={() => increase(it.productId)}
                                                    className="w-9 h-9 rounded-lg border font-bold hover:bg-gray-50"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="font-bold text-gray-900">
                                                {it.price * it.quantity} RON
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="border rounded-xl p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total</p>
                                    <p className="text-2xl font-bold text-gray-900">{total} RON</p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate('/checkout')}
                                    className="px-6 py-3 rounded-lg bg-slate-900 text-white font-bold hover:opacity-95"
                                >
                                    Continuă către finalizare →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default CartPage;