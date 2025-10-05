//Sant
import { useState, useMemo } from 'react';
import Filter from './Filter';

const mensajes = [
    "Buscar: Toyota Corolla Usado 2018...",
    "Buscar: Ford Fiesta en buen estado...",
    "Buscar: Peugeot 208, el que salió ahora...",
    "Buscar: Honda Civic...",
    "Buscar: Nissan Frontier 0km..."
];

const SearchBar = () => {
    const [searchValue, setSearchValue] = useState('');
    
    // Random placeholder que se genera una vez cuando se monta el componente
    const randomPlaceholder = useMemo(() => {
        return mensajes[Math.floor(Math.random() * mensajes.length)];
    }, []);

    const handleChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSubmit = (e) => {
        // El prevent default hace que no se congele la pag. Cada vez q ingresaba un texto, se actualizaba la pag automaticamente
        e.preventDefault();
        console.log('Buscando:', searchValue);
    };

    return (
    <form onSubmit={handleSubmit} className="bg-paleta1-cream rounded-b-full flex justify-center items-center h-14
    transition-all duration-300 ease-in-out
    hover:h-20
    ">

        {/** Componente Filter */}
        <div className="ml-2">
            <Filter />
        </div>

        <input 
            type="text" 
            value={searchValue}
            onChange={handleChange}
            placeholder={randomPlaceholder}
            className="w-1/5 h-max bg-paleta1-cream-light outline-none rounded-3xl 
                   text-center

                   transition-all duration-300 ease-in-out

                   hover:w-1/3 
                   focus:w-1/3 px-4 py-2" 
        />
        <button type="submit" className="ml-2 p-2 hover:scale-110 transition-transform duration-200 text-gray-700
        hover:cursor-pointer">
            
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
        </button>
    </form>
);
};

export default SearchBar