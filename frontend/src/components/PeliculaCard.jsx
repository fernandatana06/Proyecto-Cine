function PeliculaCard({
    pelicula,
    funciones,
    onReservar,
  }) {
    return (
      <article className="pelicula-card">
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
  
        <div className="pelicula-contenido">
          <h2>{pelicula.titulo}</h2>
  
          <p>
            <strong>Género:</strong> {pelicula.genero}
          </p>
  
          <p>
            <strong>Duración:</strong> {pelicula.duracion} minutos
          </p>
  
          <p>
            <strong>Clasificación:</strong>{" "}
            {pelicula.clasificacion}
          </p>
  
          <h3>Funciones disponibles</h3>
  
          {funciones.length === 0 ? (
            <p>No hay funciones futuras disponibles.</p>
          ) : (
            <div className="funciones-lista">
              {funciones.map((funcion) => (
                <div
                  className="funcion-item"
                  key={funcion.id}
                >
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(
                      funcion.fechaHora
                    ).toLocaleDateString()}
                  </p>
  
                  <p>
                    <strong>Hora:</strong>{" "}
                    {new Date(
                      funcion.fechaHora
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
  
                  <p>
                    <strong>Sala:</strong>{" "}
                    {funcion.sala.nombre}
                  </p>
  
                  <p>
                    <strong>Precio:</strong> $
                    {funcion.precio.toFixed(2)}
                  </p>
  
                  <p>
                    <strong>Disponibles:</strong>{" "}
                    {funcion.entradasDisponibles}
                  </p>
  
                  <button
                    type="button"
                    onClick={() => onReservar(funcion)}
                    disabled={
                      funcion.entradasDisponibles <= 0
                    }
                  >
                    {funcion.entradasDisponibles > 0
                      ? "Reservar"
                      : "Agotado"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
    );
  }
  
  export default PeliculaCard;