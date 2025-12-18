import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../services/authService.ts';

const ProtectedRoute = () => {
    const isAuthenticated = !!authService.getToken();

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;