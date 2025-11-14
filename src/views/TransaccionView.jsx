import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TransaccionForm from '../components/transacciones/TransaccionForm';
import TransaccionList from '../components/transacciones/TransaccionList';

const TransaccionView = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    // Redireccionar si no esta loggeado
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <Routes>
            {/* Form de compra desde carrito */}
            <Route path="/" element={<TransaccionForm />} />
            
            <Route path="/mis-transacciones" element={<TransaccionList />} />
        </Routes>
    );
};

export default TransaccionView;
