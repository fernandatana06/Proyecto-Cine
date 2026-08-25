import { useState } from "react";
import { crearReserva } from "../services/api";

function ReservaForm({
  funcion,
  onReservaCreada,
  onCancelar,
}) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    cantidad: 1,
  });

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const totalEstimado =
    Number(form.cantidad || 0) * funcion.precio;

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function manejarSubmit(evento) {
    evento.preventDefault();

    setError("");
    setMensaje("");
    setEnviando(true);

    try {
      const resultado = await crearReserva({
        nombre: form.nombre,
        email: form.email,
        funcionId: funcion.id,
        cantidad: Number(form.cantidad),
      });

      setMensaje(resultado.mensaje);

      setForm({
        nombre: "",
        email: "",
        cantidad: 1,
      });

      onReservaCreada();
    } catch (error) {
      setError(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="reserva-formulario">
      <h3>Reservar entradas</h3>

      <p>
        <strong>Película:</strong>{" "}
        {funcion.pelicula.titulo}
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

      <form onSubmit={manejarSubmit}>
        <label>
          Nombre
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={manejarCambio}
            required
          />
        </label>

        <label>
          Correo electrónico
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={manejarCambio}
            required
          />
        </label>

        <label>
          Cantidad
          <input
            type="number"
            name="cantidad"
            min="1"
            max={funcion.entradasDisponibles}
            value={form.cantidad}
            onChange={manejarCambio}
            required
          />
        </label>

        <p>
          <strong>Total estimado:</strong> $
          {totalEstimado.toFixed(2)}
        </p>

        {error && (
          <p className="mensaje-error">
            {error}
          </p>
        )}

        {mensaje && (
          <p className="mensaje-exito">
            {mensaje}
          </p>
        )}

        <div className="acciones-reserva">
          <button
            type="submit"
            disabled={enviando}
          >
            {enviando
              ? "Procesando..."
              : "Confirmar reserva"}
          </button>

          <button
            type="button"
            onClick={onCancelar}
          >
            Cerrar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservaForm;