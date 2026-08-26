function PeliculaCard({
    pelicula,
    funciones,
    onVerFunciones,
  }) {
    const cantidadFunciones = funciones.length;
  
    return (
      <article className="pelicula-card">
        {/* IMAGEN */}
  
        <div className="pelicula-imagen-contenedor">
          {pelicula.imagenUrl ? (
            <img
              src={pelicula.imagenUrl}
              alt={`Portada de ${pelicula.titulo}`}
              className="pelicula-imagen"
            />
          ) : (
            <div className="pelicula-sin-imagen">
              Sin imagen
            </div>
          )}
  
          {/* CLASIFICACIÓN */}
  
          <span className="pelicula-clasificacion">
            {pelicula.clasificacion}
          </span>
        </div>
  
        {/* INFORMACIÓN */}
  
        <div className="pelicula-contenido">
          <div className="pelicula-info-principal">
            <h2>{pelicula.titulo}</h2>
  
            <p className="pelicula-genero">
              {pelicula.genero}
            </p>
          </div>
  
          <div className="pelicula-datos">
            <span>
              {pelicula.duracion} min
            </span>
  
            <span>•</span>
  
            <span>
              {pelicula.clasificacion}
            </span>
          </div>
  
          {/* FUNCIONES */}
  
          <div className="pelicula-disponibilidad">
            {cantidadFunciones > 0 ? (
              <span>
                {cantidadFunciones}{" "}
                {cantidadFunciones === 1
                  ? "función disponible"
                  : "funciones disponibles"}
              </span>
            ) : (
              <span className="sin-funciones">
                Sin funciones próximas
              </span>
            )}
          </div>
  
          {/* BOTÓN */}
  
          <button
            type="button"
            className="boton-ver-funciones"
            onClick={() =>
              onVerFunciones(
                pelicula,
                funciones
              )
            }
            disabled={cantidadFunciones === 0}
          >
            {cantidadFunciones > 0
              ? "Ver funciones"
              : "Sin funciones"}
          </button>
        </div>
      </article>
    );
  }
  
  export default PeliculaCard;