import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UsuarioPerfil from '../components/usuario/UsuarioPerfil';
import UsuarioActualizacion from '../components/usuario/UsuarioActualizacion';
import CambioContraseña from '../components/usuario/CambioContraseña';
import UsuarioPublicaciones from '../components/usuario/UsuarioPublicaciones';
import UsuarioTransacciones from '../components/usuario/UsuarioTransacciones';

const PerfilView = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    // Redireccionar si no esta loggeado
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <Routes>
            {/* Perfil */}
            <Route path="/" element={<UsuarioPerfil />} />
            
            <Route path="/actualizar" element={<UsuarioActualizacion />} />
            
            <Route path="/cambiar-contraseña" element={<CambioContraseña />} />
            
            <Route path="/publicaciones" element={<UsuarioPublicaciones />} />
            
            <Route path="/transacciones" element={<UsuarioTransacciones />} />
        </Routes>
    );
};

export default PerfilView;
