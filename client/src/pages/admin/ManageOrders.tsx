import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../../services/env';
import { apiFetch } from '../../services/authService';

type Order = {
    _id: string;
    orderNumber: string;
    status: string;
    total: number;
    shipping: { fullName: string; phone: string; email: string; city: string; address: string };
    createdAt: string;
};

const ManageOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const API_URL = getApiUrl();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await apiFetch(`${API_URL}/orders?limit=100`);
            const data = await res.json();
            setOrders(Array.isArray(data.data) ? data.data : []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateStatus = async (id: string, status: string) => {
        const res = await apiFetch(`${API_URL}/orders/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });

        if (!res.ok) {
            alert('Eroare la actualizare status');
            return;
        }

        await fetchOrders();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Comenzi</h1>
                    <Link to="/admin" className="text-slate-600 hover:underline">← Dashboard</Link>
                </div>

                {loading ? (
                    <div className="text-slate-600">Se încarcă...</div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((o) => (
                            <div key={o._id} className="bg-white border rounded-lg p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-bold text-slate-900">{o.orderNumber}</p>
                                        <p className="text-sm text-slate-600">
                                            {new Date(o.createdAt).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-slate-700 mt-2">
                                            {o.shipping.fullName} • {o.shipping.phone} • {o.shipping.city}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">{o.shipping.address}</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">{o.total} RON</p>

                                        <select
                                            className="mt-2 border rounded p-2 text-sm"
                                            value={o.status}
                                            onChange={(e) => updateStatus(o._id, e.target.value)}
                                        >
                                            <option value="new">Nouă</option>
                                            <option value="processing">În procesare</option>
                                            <option value="shipped">Expediată</option>
                                            <option value="completed">Finalizată</option>
                                            <option value="cancelled">Anulată</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {orders.length === 0 ? (
                            <div className="text-slate-600 bg-white border rounded-lg p-6">
                                Nu există comenzi încă.
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageOrders;