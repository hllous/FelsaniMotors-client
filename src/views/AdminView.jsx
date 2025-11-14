import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminDashboard from '../components/admin/AdminDashboard';
import UsuariosAdmin from '../components/admin/UsuariosAdmin';
import PublicacionesAdmin from '../components/admin/PublicacionesAdmin';
import ComentariosAdmin from '../components/admin/ComentariosAdmin';

const AdminView = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Redireccionar si no es admin
    if (user?.rol !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return (
        <Routes>
            {/* Dashboard admin*/}
            <Route path="/" element={<AdminDashboard />} />
            
            <Route path="/usuarios" element={<UsuariosAdmin />} />
            
            <Route path="/publicaciones" element={<PublicacionesAdmin />} />
            
            <Route path="/comentarios" element={<ComentariosAdmin />} />
        </Routes>
    );
};

export default AdminView;
