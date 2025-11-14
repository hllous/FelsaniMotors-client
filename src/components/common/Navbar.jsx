//Nico
import SearchBar from './SearchBar';
import Carrito from './Carrito';
import Modal from './Modal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LogInPopup from '../usuario/LogInPopup';
import SignInPopup from '../usuario/SignInPopup';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {

    const [visibleLogIn, setVisibleLogIn] = useState(false)
    const [visibleSignIn, setVisibleSignIn] = useState(false)
    const [carritoOpen, setCarritoOpen] = useState(false)
    const [modalConfig, setModalConfig] = useState({ isOpen: false });
    
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.carrito);
    const navigate = useNavigate();

    const cartCount = items.length;

    const showModal = (config) => {
        setModalConfig({ ...config, isOpen: true });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false });
    };

    const openSignIn = () => {
        setVisibleLogIn(false)
        setVisibleSignIn(true)
    }

    const openLogIn = () => {
        setVisibleSignIn(false)
        setVisibleLogIn(true)
    }

    const handleLogout = () => {
        dispatch(logout());
    }

    const handleMisPublicaciones = () => {
        if (!isAuthenticated) {
            showModal({
                type: 'warning',
                title: 'Iniciar Sesión',
                message: 'Debes iniciar sesión para ver tus publicaciones.\n\nPor favor, inicia sesión y vuelve a intentarlo.',
                showCancel: false
            });
            return;
        }
        
        if (isAuthenticated && user?.idUsuario) {
            navigate(`/publicaciones?userId=${user.idUsuario}`);
        }
    }

    const handleCrearPublicacion = () => {
        navigate('/crear-publicacion');
    };

    return(
        <header className="bg-paleta1-blue">

            {/** Division de componentes*/}
            <nav className="flex gap-5 px-8">

                {/** Logo */}
                <div 
                    className='hover:cursor-pointer self-center'
                    onClick={() => navigate('/')}
                >
                    <img src='/src/assets/Logo_Felsani_Motors_Page.png' className="h-28"/>
                </div>

                {/** SearchBar */}
                <div className="grow ">
                    <SearchBar />   
                </div>

                <div className='flex items-center gap-3'>

                    {/** CrearPublicacion */}
                    <div className="relative group">
                        <div className="flex items-center justify-center rounded-full size-8 hover:bg-blue-300 transition-all duration-200 ease-in-out">
                            <button 
                                className='text-white hover:cursor-pointer'
                                onClick={handleCrearPublicacion}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </button>
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                            Crear Publicación
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                    </div>

                    {/** Publicaciones del usuario */}
                    <div className="relative group">
                        <div className="flex items-center justify-center rounded-full size-8 hover:bg-blue-300 transition-all duration-200 ease-in-out">
                            <button 
                                className="text-white hover:cursor-pointer"
                                onClick={handleMisPublicaciones}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>

                            </button>
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                            Mis Publicaciones
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                    </div>

                    {/** Carrito */}
                    <div className="relative group">
                        <div className="flex items-center justify-center rounded-full size-8 hover:bg-blue-300 transition-all duration-200 ease-in-out">
                            <button 
                                className="text-white hover:cursor-pointer relative"
                                onClick={() => setCarritoOpen(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                                {/* Badge con contador */}
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                            Carrito {cartCount > 0 && `(${cartCount})`}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                    </div>

                    {/* Componente Carrito */}
                    <Carrito 
                        isOpen={carritoOpen} 
                        onClose={() => setCarritoOpen(false)} 
                    />

                    {/** Panel de Admin (solo visible para administradores) */}
                    {isAuthenticated && user?.rol === 'ADMIN' && (
                        <div className="relative group">
                            <div className="flex items-center justify-center rounded-full size-8 hover:bg-yellow-400 transition-all duration-200 ease-in-out">
                                <button 
                                    className="text-white hover:cursor-pointer"
                                    onClick={() => navigate('/admin')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                Panel Admin
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                            </div>
                        </div>
                    )}

                    {/** Perfil */}
                    {isAuthenticated && (
                        <div className="relative group">
                            <div className="flex items-center justify-center rounded-full size-8 hover:bg-blue-300 transition-all duration-200 ease-in-out">
                                <button 
                                    className="text-white hover:cursor-pointer"
                                    onClick={() => navigate('/perfil')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </button>
                            </div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                Mi Perfil
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                            </div>
                        </div>
                    )}

                    {/** Login/Logout */}
                    {!isAuthenticated ? (
                        // Si NO está autenticado, mostrar botón de login
                        <div className="relative group"
                        onClick={() => {setVisibleLogIn(true)}}
                        >
                            <div className="flex items-center justify-center rounded-full size-8 hover:bg-blue-300 transition-all duration-200 ease-in-out">
                                <button className="text-white hover:cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M18 12l-3-3m0 0 3-3m-3 3h8.25" />
                                    </svg>
                                </button>
                            </div>
                            {visibleLogIn && <LogInPopup 
                                                close={() => {setVisibleLogIn(false)}} 
                                                openSignIn={() => {openSignIn()}}
                                                />
                            }
                            {visibleSignIn && <SignInPopup 
                                                close={() => {setVisibleSignIn(false)}}
                                                openLogIn={() => {openLogIn()}}
                                                />
                            }
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                Iniciar Sesión
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                            </div>
                        </div>
                    ) : (
                        // Si SÍ está autenticado, mostrar nombre y logout
                        <div className="flex items-center gap-3">
                            <span className="text-white text-sm">
                                Hola, {user?.nombre || user?.email}
                            </span>
                            <div className="relative group">
                                <div className="flex items-center justify-center rounded-full size-8 hover:bg-blue-300 transition-all duration-200 ease-in-out">
                                    <button 
                                        className="text-white hover:cursor-pointer"
                                        onClick={handleLogout}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                        </svg>
                                    </button>
                                </div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                    Cerrar Sesión
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </nav>

            {/* Modal */}
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                showCancel={modalConfig.showCancel}
            />
        </header>

    );
}

export default Navbar