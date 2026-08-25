function ReservasLista({
    reservas,
    onCancelar,
    cancelandoId,
  }) {
    if (reservas.length === 0) {
      return (
        <section className="reservas-seccion">
          <h2>Reservas realizadas</h2>
  
          <p>No hay reservas registradas.</p>
        </section>
      );
    }
  
    return (
      <section className="reservas-seccion">
        <h2>Reservas realizadas</h2>
  
        <div className="reservas-lista">
          {reservas.map((reserva) => (
            <article
              className="reserva-card"
              key={reserva.id}
            >
              <h3>
                {reserva.funcion.pelicula.titulo}
              </h3>
  
              <p>
                <strong>Cliente:</strong>{" "}
                {reserva.cliente.nombre}
              </p>
  
              <p>
                <strong>Correo:</strong>{" "}
                {reserva.cliente.email}
              </p>
  
              <p>
                <strong>Sala:</strong>{" "}
                {reserva.funcion.sala.nombre}
              </p>
  
              <p>
                <strong>Cantidad:</strong>{" "}
                {reserva.cantidad}
              </p>
  
              <p>
                <strong>Total:</strong> $
                {reserva.total.toFixed(2)}
              </p>
  
              <p>
                <strong>Estado:</strong>{" "}
                {reserva.estado}
              </p>
  
              <p>
                <strong>Fecha de reserva:</strong>{" "}
                {new Date(
                  reserva.createdAt
                ).toLocaleString()}
              </p>
  
              {reserva.estado === "ACTIVA" && (
                <button
                  type="button"
                  onClick={() =>
                    onCancelar(reserva.id)
                  }
                  disabled={
                    cancelandoId === reserva.id
                  }
                >
                  {cancelandoId === reserva.id
                    ? "Cancelando..."
                    : "Cancelar reserva"}
                </button>
              )}
            </article>
          ))}
        </div>
      </section>
    );
  }
  
  export default ReservasLista;