import { useEffect, useState } from "react";
import PublicacionCard from "./PublicacionCard";




const PublicacionList = () => {

    const [publicaciones, setPublicaciones] = useState([]);
    const URL = "http://localhost:4002/api/publicaciones";
    
    useEffect(()=>
        {fetch(URL)
            .then((response)=> response.json())
            .then((data)=> { setPublicaciones(data) })
            .catch((error)=>console.error("Error al obtener datos",error))
        },[]);
    
    return(
        <div className="text-center">
            Publicaciones
            <ul className="grid grid-cols-3 bg-paleta1-blue-light gap-5">
                {publicaciones.map(
                    (publicacion)=>(<PublicacionCard key={publicacion.idPublicacion}
                    idPublicacion={publicacion.idPublicacion}
                    idUsuario={publicacion.idUsuario}
                    idAuto={publicacion.idAuto}
                    titulo={publicacion.titulo}
                    ubicacion={publicacion.ubicacion}
                    precio={publicacion.precio}
                    estado={publicacion.estado}
                    marcaAuto={publicacion.marcaAuto}
                    modeloAuto={publicacion.modeloAuto}
                    imagenPrincipal={publicacion.imagenPrincipal}
                    />)
                    
                    
                    )}
            </ul>
        </div>
    );
};
export default PublicacionList;