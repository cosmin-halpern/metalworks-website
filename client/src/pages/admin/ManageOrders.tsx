import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../../services/env';
import { apiFetch } from '../../services/authService';

type Order = {
    id: number;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    total: number;
    shipping: { fullName: string; phone: string; email: string; city: string; address: string };
    createdAt: string;
};

const orderStatusBadge: Record<string, string> = {
    new:        'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    shipped:    'bg-purple-100 text-purple-800',
    completed:  'bg-green-100 text-green-800',
    cancelled:  'bg-red-100 text-red-800',
};

const orderStatusLabel: Record<string, string> = {
    new:        'Nouă',
    processing: 'În procesare',
    shipped:    'Expediată',
    completed:  'Finalizată',
    cancelled:  'Anulată',
};

const paymentStatusBadge: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    paid:    'bg-green-100 text-green-800',
    failed:  'bg-red-100 text-red-800',
};

const paymentStatusLabel: Record<string, string> = {
    pending: 'În așteptare',
    paid:    'Plătit',
    failed:  'Eșuat',
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

    const updateStatus = async (id: number, status: string) => {
        const res = await apiFetch(`${API_URL}/orders/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (!res.ok) { alert('Eroare la actualizare status'); return; }
        await fetchOrders();
    };

    const updatePaymentStatus = async (id: number, paymentStatus: string) => {
        const res = await apiFetch(`${API_URL}/orders/${id}/payment-status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentStatus }),
        });
        if (!res.ok) { alert('Eroare la actualizare status plată'); return; }
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
                            <div key={o.id} className="bg-white border rounded-lg p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-bold text-slate-900">{o.orderNumber}</p>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${orderStatusBadge[o.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                                {orderStatusLabel[o.status] ?? o.status}
                                            </span>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${paymentStatusBadge[o.paymentStatus] ?? 'bg-gray-100 text-gray-700'}`}>
                                                {paymentStatusLabel[o.paymentStatus] ?? o.paymentStatus}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 mt-1">
                                            {new Date(o.createdAt).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-slate-700 mt-2">
                                            {o.shipping.fullName} • {o.shipping.phone} • {o.shipping.city}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">{o.shipping.address}</p>
                                    </div>

                                    <div className="text-right shrink-0 flex flex-col items-end gap-2">
                                        <p className="font-bold text-slate-900">{o.total} RON</p>

                                        <select
                                            className={`border rounded p-2 text-sm font-medium ${orderStatusBadge[o.status] ?? ''}`}
                                            value={o.status}
                                            onChange={(e) => updateStatus(o.id, e.target.value)}
                                        >
                                            <option value="new">Nouă</option>
                                            <option value="processing">În procesare</option>
                                            <option value="shipped">Expediată</option>
                                            <option value="completed">Finalizată</option>
                                            <option value="cancelled">Anulată</option>
                                        </select>

                                        <select
                                            className={`border rounded p-2 text-sm font-medium ${paymentStatusBadge[o.paymentStatus] ?? ''}`}
                                            value={o.paymentStatus}
                                            onChange={(e) => updatePaymentStatus(o.id, e.target.value)}
                                        >
                                            <option value="pending">În așteptare</option>
                                            <option value="paid">Plătit</option>
                                            <option value="failed">Eșuat</option>
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