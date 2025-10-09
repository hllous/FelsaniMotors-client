

const PublicacionCard = ({idPublicacion,idUsuario,idAuto,titulo,ubicacion,precio,estado,marcaAuto,modeloAuto,imagenPrincipal}) => {
    return(
        <div>
            <h1>Publicacion Nro {idPublicacion}</h1>
            <h1>{titulo}</h1>
            <p>{imagenPrincipal}</p>
            <p>{marcaAuto} - {modeloAuto}</p>
            <p>{estado},{ubicacion},{precio}</p>
        </div>
    );

};
export default PublicacionCard;