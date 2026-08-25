import { useEffect, useState } from "react";

import {
  cancelarReserva,
  obtenerFunciones,
  obtenerPeliculas,
  obtenerReservas,
} from "./services/api";

import PeliculaCard from "./components/PeliculaCard";
import ReservaForm from "./components/ReservaForm";
import ReservasLista from "./components/ReservasLista";

import "./App.css";

function App() {
  // -------------------------
  // ESTADOS PRINCIPALES
  // -------------------------

  const [peliculas, setPeliculas] = useState([]);
  const [funciones, setFunciones] = useState([]);
  const [reservas, setReservas] = useState([]);

  // Función seleccionada cuando el usuario pulsa "Reservar"
  const [funcionSeleccionada, setFuncionSeleccionada] =
    useState(null);

  // ID de la reserva que se está cancelando
  const [cancelandoId, setCancelandoId] =
    useState(null);

  // Estados visuales
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] =
    useState("");

  // -------------------------
  // CARGAR DATOS DEL SISTEMA
  // -------------------------

  async function cargarCartelera() {
    try {
      setCargando(true);
      setError("");

      const [
        datosPeliculas,
        datosFunciones,
        datosReservas,
      ] = await Promise.all([
        obtenerPeliculas(),
        obtenerFunciones(),
        obtenerReservas(),
      ]);

      setPeliculas(datosPeliculas);
      setFunciones(datosFunciones);
      setReservas(datosReservas);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  // Se ejecuta cuando abre la aplicación
  useEffect(() => {
    cargarCartelera();
  }, []);

  // -------------------------
  // SELECCIONAR UNA FUNCIÓN
  // -------------------------

  function manejarReservar(funcion) {
    setMensajeExito("");
    setError("");
    setFuncionSeleccionada(funcion);
  }

  // -------------------------
  // RESERVA CREADA
  // -------------------------

  async function manejarReservaCreada() {
    await cargarCartelera();

    setFuncionSeleccionada(null);

    setMensajeExito(
      "Reserva realizada correctamente."
    );
  }

  // -------------------------
  // CERRAR FORMULARIO
  // -------------------------

  function cerrarFormulario() {
    setFuncionSeleccionada(null);
  }

  // -------------------------
  // CANCELAR RESERVA
  // -------------------------

  async function manejarCancelarReserva(id) {
    const confirmar = window.confirm(
      "¿Está seguro de cancelar esta reserva?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setCancelandoId(id);
      setError("");
      setMensajeExito("");

      await cancelarReserva(id);

      // Volvemos a consultar todo para actualizar:
      // - historial
      // - estado de reserva
      // - entradas disponibles
      await cargarCartelera();

      setMensajeExito(
        "Reserva cancelada correctamente."
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setCancelandoId(null);
    }
  }

  // -------------------------
  // ESTADO DE CARGA
  // -------------------------

  if (cargando) {
    return (
      <main className="contenedor">
        <p>Cargando información...</p>
      </main>
    );
  }

  // -------------------------
  // FILTRAR PELÍCULAS ACTIVAS
  // -------------------------

  const peliculasActivas = peliculas.filter(
    (pelicula) => pelicula.estado === "ACTIVA"
  );

  return (
    <main className="contenedor">
      {/* ENCABEZADO */}

      <header className="encabezado">
        <h1>Cartelera</h1>

        <p>
          Consulta nuestras películas y funciones
          disponibles.
        </p>
      </header>

      {/* MENSAJES */}

      {error && (
        <p className="mensaje-error">
          {error}
        </p>
      )}

      {mensajeExito && (
        <p className="mensaje-exito">
          {mensajeExito}
        </p>
      )}

      {/* CARTELERA */}

      {peliculasActivas.length === 0 ? (
        <p>No hay películas activas.</p>
      ) : (
        <section className="peliculas-grid">
          {peliculasActivas.map((pelicula) => {
            // Seleccionamos únicamente las funciones
            // correspondientes a esta película.
            const funcionesPelicula =
              funciones.filter(
                (funcion) =>
                  funcion.peliculaId ===
                    pelicula.id &&
                  funcion.estado ===
                    "PROGRAMADA" &&
                  new Date(funcion.fechaHora) >
                    new Date()
              );

            return (
              <PeliculaCard
                key={pelicula.id}
                pelicula={pelicula}
                funciones={funcionesPelicula}
                onReservar={manejarReservar}
              />
            );
          })}
        </section>
      )}

      {/* FORMULARIO DE RESERVA */}

      {funcionSeleccionada && (
        <ReservaForm
          funcion={funcionSeleccionada}
          onReservaCreada={
            manejarReservaCreada
          }
          onCancelar={cerrarFormulario}
        />
      )}

      {/* HISTORIAL DE RESERVAS */}

      <ReservasLista
        reservas={reservas}
        onCancelar={manejarCancelarReserva}
        cancelandoId={cancelandoId}
      />
    </main>
  );
}

export default App;