
import { useState, useEffect } from "react";

const PublicacionCard = ({idPublicacion,idUsuario,idAuto,titulo,ubicacion,precio,estado,marcaAuto,modeloAuto}) => {

    const [image, setImage] = useState("https://via.placeholder.com/300x200?text=Loading...");

    useEffect(() => {
        fetch(`http://localhost:4002/api/publicaciones/${idPublicacion}/fotos-contenido`)
        .then(response => {
            if (!response.ok) { 
                throw new Error('No se encontraron imágenes')
            }
            return response.json() })
        .then(data => { setImage(`data:image/jpeg;base64,${data[0].file}`) })
        .catch(error => { console.error('Error cargando imagen:', error) });
    }, [idPublicacion]);

    return(
        <div>
            <h1>Publicacion Nro {idPublicacion}</h1>
            <h1>{titulo}</h1>
            <img src={image} alt={titulo} />
            <p>{marcaAuto} - {modeloAuto}</p>
            <p>{estado},{ubicacion},${precio} ARS</p>
        </div>
    );

};
export default PublicacionCard;