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
  // ==========================================
  // ESTADOS PRINCIPALES
  // ==========================================

  const [peliculas, setPeliculas] = useState([]);
  const [funciones, setFunciones] = useState([]);
  const [reservas, setReservas] = useState([]);

  const [funcionSeleccionada, setFuncionSeleccionada] =
    useState(null);

  const [cancelandoId, setCancelandoId] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  // ==========================================
  // ESTADOS DE LOS FILTROS
  // ==========================================

  const [filtroPelicula, setFiltroPelicula] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  // ==========================================
  // CARGAR DATOS
  // ==========================================

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

  // ==========================================
  // CARGAR INFORMACIÓN AL ABRIR LA APP
  // ==========================================

  useEffect(() => {
    cargarCartelera();
  }, []);

  // ==========================================
  // SELECCIONAR FUNCIÓN PARA RESERVAR
  // ==========================================

  function manejarReservar(funcion) {
    setMensajeExito("");
    setError("");
    setFuncionSeleccionada(funcion);
  }

  // ==========================================
  // CUANDO SE CREA UNA RESERVA
  // ==========================================

  async function manejarReservaCreada() {
    await cargarCartelera();

    setFuncionSeleccionada(null);

    setMensajeExito(
      "Reserva realizada correctamente."
    );
  }

  // ==========================================
  // CERRAR FORMULARIO DE RESERVA
  // ==========================================

  function cerrarFormulario() {
    setFuncionSeleccionada(null);
  }

  // ==========================================
  // CANCELAR RESERVA
  // ==========================================

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

      // Actualizamos:
      // - historial de reservas
      // - disponibilidad de entradas
      // - cartelera
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

  // ==========================================
  // LIMPIAR FILTROS
  // ==========================================

  function limpiarFiltros() {
    setFiltroPelicula("");
    setFiltroFecha("");
  }

  // ==========================================
  // CONVERTIR FECHA A FORMATO LOCAL YYYY-MM-DD
  // ==========================================

  function obtenerFechaLocal(fechaHora) {
    const fecha = new Date(fechaHora);

    const anio = fecha.getFullYear();

    const mes = String(
      fecha.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
      fecha.getDate()
    ).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
  }

  // ==========================================
  // ESTADO DE CARGA
  // ==========================================

  if (cargando) {
    return (
      <main className="contenedor">
        <p>Cargando información...</p>
      </main>
    );
  }

  // ==========================================
  // PELÍCULAS ACTIVAS
  // ==========================================

  const peliculasActivas = peliculas.filter(
    (pelicula) => pelicula.estado === "ACTIVA"
  );

  // ==========================================
  // FUNCIONES FILTRADAS
  // ==========================================

  const funcionesFiltradas = funciones.filter(
    (funcion) => {
      // Solo mostramos funciones programadas
      if (funcion.estado !== "PROGRAMADA") {
        return false;
      }

      // Solo mostramos funciones futuras
      const fechaFuncionCompleta = new Date(
        funcion.fechaHora
      );

      const ahora = new Date();

      if (fechaFuncionCompleta <= ahora) {
        return false;
      }

      // --------------------------------------
      // FILTRO POR PELÍCULA
      // --------------------------------------

      if (
        filtroPelicula &&
        funcion.peliculaId !== Number(filtroPelicula)
      ) {
        return false;
      }

      // --------------------------------------
      // FILTRO POR FECHA
      // --------------------------------------

      if (filtroFecha) {
        const fechaFuncion = obtenerFechaLocal(
          funcion.fechaHora
        );

        if (fechaFuncion !== filtroFecha) {
          return false;
        }
      }

      return true;
    }
  );

  // ==========================================
  // PELÍCULAS QUE DEBEN MOSTRARSE
  // ==========================================

  const peliculasFiltradas = peliculasActivas.filter(
    (pelicula) => {
      // Si seleccionamos una película específica,
      // ocultamos las demás.

      if (
        filtroPelicula &&
        pelicula.id !== Number(filtroPelicula)
      ) {
        return false;
      }

      // La película debe tener al menos una
      // función disponible después de aplicar
      // los filtros.

      return funcionesFiltradas.some(
        (funcion) =>
          funcion.peliculaId === pelicula.id
      );
    }
  );

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <main className="contenedor">
      {/* ======================================
          ENCABEZADO
      ====================================== */}

      <header className="encabezado">
        <h1>Cartelera</h1>

        <p>
          Consulta nuestras películas y funciones
          disponibles.
        </p>
      </header>

      {/* ======================================
          MENSAJES
      ====================================== */}

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

      {/* ======================================
          FILTROS
      ====================================== */}

      <section className="filtros">
        <h2>Buscar funciones</h2>

        <div className="filtros-contenido">
          {/* FILTRO POR PELÍCULA */}

          <label>
            Película

            <select
              value={filtroPelicula}
              onChange={(evento) =>
                setFiltroPelicula(
                  evento.target.value
                )
              }
            >
              <option value="">
                Todas las películas
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

          {/* FILTRO POR FECHA */}

          <label>
            Fecha

            <input
              type="date"
              value={filtroFecha}
              onChange={(evento) =>
                setFiltroFecha(
                  evento.target.value
                )
              }
            />
          </label>

          {/* BOTÓN LIMPIAR */}

          <button
            type="button"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      {/* ======================================
          CARTELERA
      ====================================== */}

      {peliculasFiltradas.length === 0 ? (
        <p>
          No hay funciones disponibles con los
          filtros seleccionados.
        </p>
      ) : (
        <section className="peliculas-grid">
          {peliculasFiltradas.map(
            (pelicula) => {
              // Obtenemos únicamente las
              // funciones correspondientes
              // a esta película.

              const funcionesPelicula =
                funcionesFiltradas.filter(
                  (funcion) =>
                    funcion.peliculaId ===
                    pelicula.id
                );

              return (
                <PeliculaCard
                  key={pelicula.id}
                  pelicula={pelicula}
                  funciones={
                    funcionesPelicula
                  }
                  onReservar={
                    manejarReservar
                  }
                />
              );
            }
          )}
        </section>
      )}

      {/* ======================================
          FORMULARIO DE RESERVA
      ====================================== */}

      {funcionSeleccionada && (
        <ReservaForm
          funcion={funcionSeleccionada}
          onReservaCreada={
            manejarReservaCreada
          }
          onCancelar={cerrarFormulario}
        />
      )}

      {/* ======================================
          HISTORIAL DE RESERVAS
      ====================================== */}

      <ReservasLista
        reservas={reservas}
        onCancelar={
          manejarCancelarReserva
        }
        cancelandoId={cancelandoId}
      />
    </main>
  );
}

export default App;