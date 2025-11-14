import { Routes, Route } from 'react-router-dom';
import PublicacionList from '../components/publicaciones/PublicacionList';
import Publicacion from '../components/publicaciones/Publicacion';
import PublicacionForm from '../components/publicaciones/PublicacionForm';
import PublicacionEditar from '../components/publicaciones/PublicacionEditar';
import FAQ from '../components/common/FAQ';

const HomeView = () => {
    return (
        <Routes>
            
            {/* Lista de publicaciones y Home */}
            <Route path="/" element={<PublicacionList />} />
            <Route path="/publicaciones" element={<PublicacionList />} />
            
            {/* Detalle de publicacion */}
            <Route path="/publicacion/:id" element={<Publicacion />} />
            
            {/* Crear publi */}
            <Route path="/crear-publicacion" element={<PublicacionForm />} />
            
            {/* Editar publi */}
            <Route path="/editar-publicacion/:id" element={<PublicacionEditar />} />
            
            {/* FAQ */}
            <Route path="/faq" element={<FAQ />} />
        </Routes>
    );
};

export default HomeView;
