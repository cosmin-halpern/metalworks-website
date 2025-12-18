import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const AdminDashboard = () => {
    const user = authService.getUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold tracking-tighter">CORSICAN ADMIN</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className="block p-3 rounded bg-slate-800">Dashboard</Link>
                    <Link to="/admin/projects" className="block p-3 rounded hover:bg-slate-800 transition">Proiecte</Link>
                    <Link to="/admin/clients" className="block p-3 rounded hover:bg-slate-800 transition">Clienți</Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin/users" className="block p-3 rounded text-blue-400 hover:bg-slate-800 transition font-medium">Gestionare Staff</Link>
                    )}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full text-left p-3 text-red-400 hover:bg-slate-800 rounded transition">
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Bine ai venit, {user?.username}!</h1>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium uppercase">
                        {user?.role}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">Proiecte</h3>
                        <p className="text-gray-600 mb-4">Adaugă sau modifică galeriile de proiecte metalice.</p>
                        <Link to="/admin/projects" className="text-blue-600 font-medium hover:underline">Gestionare Proiecte →</Link>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">Clienți</h3>
                        <p className="text-gray-600 mb-4">Actualizează logo-urile partenerilor afișate pe site.</p>
                        <Link to="/admin/clients" className="text-blue-600 font-medium hover:underline">Gestionare Clienți →</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;