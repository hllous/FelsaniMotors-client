import { useState } from "react";
import PublicacionCard from "./PublicacionCard";

const [publicaciones, setPublicaciones] = useState([]);
const URL = "http://localhost:4002/api/publicaciones";

const PublicacionList = () => {
    return(
        <div>
            Publicaciones
            <ul>
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