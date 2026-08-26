import { useState } from "react";

import {
  crearFuncion,
  crearPelicula,
  crearSala,
} from "../services/api";

function PanelAdministracion({
  peliculas,
  salas,
  onDatosActualizados,
}) {
  // ==========================================
  // ESTADOS GENERALES
  // ==========================================

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [procesando, setProcesando] =
    useState(false);

  // ==========================================
  // FORMULARIO PELÍCULA
  // ==========================================

  const [formPelicula, setFormPelicula] =
    useState({
      titulo: "",
      genero: "",
      duracion: "",
      clasificacion: "",
      imagenUrl: "",
    });

  // ==========================================
  // FORMULARIO SALA
  // ==========================================

  const [formSala, setFormSala] = useState({
    nombre: "",
    capacidad: "",
  });

  // ==========================================
  // FORMULARIO FUNCIÓN
  // ==========================================

  const [formFuncion, setFormFuncion] =
    useState({
      peliculaId: "",
      salaId: "",
      fechaHora: "",
      precio: "",
    });

  // ==========================================
  // CAMBIOS PELÍCULA
  // ==========================================

  function manejarCambioPelicula(evento) {
    const { name, value } = evento.target;

    setFormPelicula({
      ...formPelicula,
      [name]: value,
    });
  }

  // ==========================================
  // CAMBIOS SALA
  // ==========================================

  function manejarCambioSala(evento) {
    const { name, value } = evento.target;

    setFormSala({
      ...formSala,
      [name]: value,
    });
  }

  // ==========================================
  // CAMBIOS FUNCIÓN
  // ==========================================

  function manejarCambioFuncion(evento) {
    const { name, value } = evento.target;

    setFormFuncion({
      ...formFuncion,
      [name]: value,
    });
  }

  // ==========================================
  // REGISTRAR PELÍCULA
  // ==========================================

  async function manejarSubmitPelicula(evento) {
    evento.preventDefault();

    try {
      setProcesando(true);
      setError("");
      setMensaje("");

      await crearPelicula({
        titulo: formPelicula.titulo.trim(),
        genero: formPelicula.genero.trim(),
        duracion: Number(
          formPelicula.duracion
        ),
        clasificacion:
          formPelicula.clasificacion.trim(),
        imagenUrl:
          formPelicula.imagenUrl.trim() ||
          null,
      });

      setFormPelicula({
        titulo: "",
        genero: "",
        duracion: "",
        clasificacion: "",
        imagenUrl: "",
      });

      setMensaje(
        "Película registrada correctamente."
      );

      await onDatosActualizados();
    } catch (error) {
      setError(error.message);
    } finally {
      setProcesando(false);
    }
  }

  // ==========================================
  // REGISTRAR SALA
  // ==========================================

  async function manejarSubmitSala(evento) {
    evento.preventDefault();

    try {
      setProcesando(true);
      setError("");
      setMensaje("");

      await crearSala({
        nombre: formSala.nombre.trim(),
        capacidad: Number(
          formSala.capacidad
        ),
      });

      setFormSala({
        nombre: "",
        capacidad: "",
      });

      setMensaje(
        "Sala registrada correctamente."
      );

      await onDatosActualizados();
    } catch (error) {
      setError(error.message);
    } finally {
      setProcesando(false);
    }
  }

  // ==========================================
  // PROGRAMAR FUNCIÓN
  // ==========================================

  async function manejarSubmitFuncion(evento) {
    evento.preventDefault();

    try {
      setProcesando(true);
      setError("");
      setMensaje("");

      const fechaSeleccionada = new Date(
        formFuncion.fechaHora
      );

      await crearFuncion({
        peliculaId: Number(
          formFuncion.peliculaId
        ),
        salaId: Number(
          formFuncion.salaId
        ),
        fechaHora:
          fechaSeleccionada.toISOString(),
        precio: Number(formFuncion.precio),
      });

      setFormFuncion({
        peliculaId: "",
        salaId: "",
        fechaHora: "",
        precio: "",
      });

      setMensaje(
        "Función programada correctamente."
      );

      await onDatosActualizados();
    } catch (error) {
      setError(error.message);
    } finally {
      setProcesando(false);
    }
  }

  // ==========================================
  // ELEMENTOS ACTIVOS
  // ==========================================

  const peliculasActivas = peliculas.filter(
    (pelicula) =>
      pelicula.estado === "ACTIVA"
  );

  const salasActivas = salas.filter(
    (sala) => sala.estado === "ACTIVA"
  );

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <section className="panel-administracion">
      <h2>Administración</h2>

      <p>
        Registra películas, salas y programa
        nuevas funciones.
      </p>

      {/* MENSAJES */}

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

      <div className="administracion-grid">
        {/* ====================================
            PELÍCULA
        ==================================== */}

        <article className="admin-card">
          <h3>Nueva película</h3>

          <form
            onSubmit={
              manejarSubmitPelicula
            }
          >
            <label>
              Título

              <input
                type="text"
                name="titulo"
                value={
                  formPelicula.titulo
                }
                onChange={
                  manejarCambioPelicula
                }
                required
              />
            </label>

            <label>
              Género

              <input
                type="text"
                name="genero"
                value={
                  formPelicula.genero
                }
                onChange={
                  manejarCambioPelicula
                }
                required
              />
            </label>

            <label>
              Duración en minutos

              <input
                type="number"
                name="duracion"
                min="1"
                value={
                  formPelicula.duracion
                }
                onChange={
                  manejarCambioPelicula
                }
                required
              />
            </label>

            <label>
              Clasificación

              <input
                type="text"
                name="clasificacion"
                value={
                  formPelicula.clasificacion
                }
                onChange={
                  manejarCambioPelicula
                }
                placeholder="Ej. PG-13"
                required
              />
            </label>

            <label>
              URL de imagen (opcional)

              <input
                type="url"
                name="imagenUrl"
                value={
                  formPelicula.imagenUrl
                }
                onChange={
                  manejarCambioPelicula
                }
                placeholder="https://..."
              />
            </label>

            <button
              type="submit"
              disabled={procesando}
            >
              Registrar película
            </button>
          </form>
        </article>

        {/* ====================================
            SALA
        ==================================== */}

        <article className="admin-card">
          <h3>Nueva sala</h3>

          <form
            onSubmit={manejarSubmitSala}
          >
            <label>
              Nombre

              <input
                type="text"
                name="nombre"
                value={formSala.nombre}
                onChange={
                  manejarCambioSala
                }
                placeholder="Ej. Sala 3"
                required
              />
            </label>

            <label>
              Capacidad máxima

              <input
                type="number"
                name="capacidad"
                min="1"
                value={
                  formSala.capacidad
                }
                onChange={
                  manejarCambioSala
                }
                required
              />
            </label>

            <button
              type="submit"
              disabled={procesando}
            >
              Registrar sala
            </button>
          </form>
        </article>

        {/* ====================================
            FUNCIÓN
        ==================================== */}

        <article className="admin-card">
          <h3>Nueva función</h3>

          <form
            onSubmit={
              manejarSubmitFuncion
            }
          >
            <label>
              Película

              <select
                name="peliculaId"
                value={
                  formFuncion.peliculaId
                }
                onChange={
                  manejarCambioFuncion
                }
                required
              >
                <option value="">
                  Seleccione una película
                </option>

                {peliculasActivas.map(
                  (pelicula) => (
                    <option
                      key={pelicula.id}
                      value={pelicula.id}
                    >
                      {pelicula.titulo}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              Sala

              <select
                name="salaId"
                value={
                  formFuncion.salaId
                }
                onChange={
                  manejarCambioFuncion
                }
                required
              >
                <option value="">
                  Seleccione una sala
                </option>

                {salasActivas.map(
                  (sala) => (
                    <option
                      key={sala.id}
                      value={sala.id}
                    >
                      {sala.nombre} -{" "}
                      {sala.capacidad} personas
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              Fecha y hora

              <input
                type="datetime-local"
                name="fechaHora"
                value={
                  formFuncion.fechaHora
                }
                onChange={
                  manejarCambioFuncion
                }
                required
              />
            </label>

            <label>
              Precio

              <input
                type="number"
                name="precio"
                min="0.01"
                step="0.01"
                value={
                  formFuncion.precio
                }
                onChange={
                  manejarCambioFuncion
                }
                required
              />
            </label>

            <button
              type="submit"
              disabled={procesando}
            >
              Programar función
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}

export default PanelAdministracion;