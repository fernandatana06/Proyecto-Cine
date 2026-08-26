import { useEffect, useState } from "react";

import {
  cancelarReserva,
  obtenerFunciones,
  obtenerPeliculas,
  obtenerReservas,
  obtenerSalas,
} from "./services/api";

import PeliculaCard from "./components/PeliculaCard";
import ReservaForm from "./components/ReservaForm";
import ReservasLista from "./components/ReservasLista";
import PanelAdministracion from "./components/PanelAdministracion";

import "./App.css";

function App() {
  // ==========================================
  // DATOS
  // ==========================================

  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [funciones, setFunciones] = useState([]);
  const [reservas, setReservas] = useState([]);

  // ==========================================
  // NAVEGACIÓN
  // ==========================================

  const [seccionActiva, setSeccionActiva] =
    useState("cartelera");

  // ==========================================
  // MODAL DE PELÍCULA
  // ==========================================

  const [
    peliculaSeleccionada,
    setPeliculaSeleccionada,
  ] = useState(null);

  const [
    funcionesSeleccionadas,
    setFuncionesSeleccionadas,
  ] = useState([]);

  // ==========================================
  // MODAL DE RESERVA
  // ==========================================

  const [
    funcionSeleccionada,
    setFuncionSeleccionada,
  ] = useState(null);

  const [cancelandoId, setCancelandoId] =
    useState(null);

  // ==========================================
  // ESTADOS GENERALES
  // ==========================================

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    mensajeExito,
    setMensajeExito,
  ] = useState("");

  // ==========================================
  // FILTROS
  // ==========================================

  const [
    filtroPelicula,
    setFiltroPelicula,
  ] = useState("");

  const [
    filtroFecha,
    setFiltroFecha,
  ] = useState("");

  // ==========================================
  // CARGAR DATOS
  // ==========================================

  async function cargarCartelera() {
    try {
      setCargando(true);
      setError("");

      const [
        datosPeliculas,
        datosSalas,
        datosFunciones,
        datosReservas,
      ] = await Promise.all([
        obtenerPeliculas(),
        obtenerSalas(),
        obtenerFunciones(),
        obtenerReservas(),
      ]);

      setPeliculas(datosPeliculas);
      setSalas(datosSalas);
      setFunciones(datosFunciones);
      setReservas(datosReservas);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarCartelera();
  }, []);

  // ==========================================
  // NAVEGACIÓN
  // ==========================================

  function cambiarSeccion(seccion) {
    setSeccionActiva(seccion);

    setMensajeExito("");
    setError("");

    setPeliculaSeleccionada(null);
    setFuncionSeleccionada(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ==========================================
  // ABRIR PELÍCULA
  // ==========================================

  function manejarVerFunciones(
    pelicula,
    funcionesPelicula
  ) {
    setPeliculaSeleccionada(pelicula);

    setFuncionesSeleccionadas(
      funcionesPelicula
    );
  }

  function cerrarPelicula() {
    setPeliculaSeleccionada(null);
    setFuncionesSeleccionadas([]);
  }

  // ==========================================
  // RESERVAR
  // ==========================================

  function manejarReservar(funcion) {
    // Cerramos primero el modal
    // de detalles de película.

    setPeliculaSeleccionada(null);

    setFuncionSeleccionada(funcion);

    setMensajeExito("");
    setError("");
  }

  async function manejarReservaCreada() {
    await cargarCartelera();

    setFuncionSeleccionada(null);

    setMensajeExito(
      "Reserva realizada correctamente."
    );
  }

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
  // ADMINISTRACIÓN
  // ==========================================

  async function manejarDatosActualizados() {
    await cargarCartelera();
  }

  // ==========================================
  // FILTROS
  // ==========================================

  function limpiarFiltros() {
    setFiltroPelicula("");
    setFiltroFecha("");
  }

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
  // CARGANDO
  // ==========================================

  if (cargando) {
    return (
      <div className="pantalla-carga">
        <div className="spinner"></div>

        <p>
          Cargando cartelera...
        </p>
      </div>
    );
  }

  // ==========================================
  // PELÍCULAS ACTIVAS
  // ==========================================

  const peliculasActivas =
    peliculas.filter(
      (pelicula) =>
        pelicula.estado === "ACTIVA"
    );

  // ==========================================
  // FUNCIONES FILTRADAS
  // ==========================================

  const funcionesFiltradas =
    funciones.filter(
      (funcion) => {
        if (
          funcion.estado !== "PROGRAMADA"
        ) {
          return false;
        }

        if (
          new Date(funcion.fechaHora) <=
          new Date()
        ) {
          return false;
        }

        if (
          filtroPelicula &&
          funcion.peliculaId !==
            Number(filtroPelicula)
        ) {
          return false;
        }

        if (filtroFecha) {
          const fechaFuncion =
            obtenerFechaLocal(
              funcion.fechaHora
            );

          if (
            fechaFuncion !== filtroFecha
          ) {
            return false;
          }
        }

        return true;
      }
    );

  // ==========================================
  // PELÍCULAS FILTRADAS
  // ==========================================

  const peliculasFiltradas =
    peliculasActivas.filter(
      (pelicula) => {
        if (
          filtroPelicula &&
          pelicula.id !==
            Number(filtroPelicula)
        ) {
          return false;
        }

        if (filtroFecha) {
          return funcionesFiltradas.some(
            (funcion) =>
              funcion.peliculaId ===
              pelicula.id
          );
        }

        return true;
      }
    );

  // ==========================================
  // CONTADORES
  // ==========================================

  const reservasActivas =
    reservas.filter(
      (reserva) =>
        reserva.estado === "ACTIVA"
    ).length;

  const funcionesFuturas =
    funciones.filter(
      (funcion) =>
        funcion.estado ===
          "PROGRAMADA" &&
        new Date(funcion.fechaHora) >
          new Date()
    ).length;

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <>
      {/* CABECERA */}

      <header className="cabecera-app">
        <div className="cabecera-contenido">
          <div className="marca">
            <div className="marca-icono">
              CIN
            </div>

            <div>
              <h1>Cine</h1>
              <p>
                Sistema de reservas
              </p>
            </div>
          </div>

          <nav className="nav-principal">
            <button
              type="button"
              className={
                seccionActiva ===
                "cartelera"
                  ? "nav-boton activo"
                  : "nav-boton"
              }
              onClick={() =>
                cambiarSeccion(
                  "cartelera"
                )
              }
            >
              Cartelera
            </button>

            <button
              type="button"
              className={
                seccionActiva ===
                "reservas"
                  ? "nav-boton activo"
                  : "nav-boton"
              }
              onClick={() =>
                cambiarSeccion(
                  "reservas"
                )
              }
            >
              Reservas

              {reservasActivas > 0 && (
                <span className="nav-contador">
                  {reservasActivas}
                </span>
              )}
            </button>

            <button
              type="button"
              className={
                seccionActiva ===
                "administracion"
                  ? "nav-boton activo"
                  : "nav-boton"
              }
              onClick={() =>
                cambiarSeccion(
                  "administracion"
                )
              }
            >
              Administración
            </button>
          </nav>
        </div>
      </header>

      <main className="contenedor">
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

        {/* ==================================
            CARTELERA
        ================================== */}

        {seccionActiva ===
          "cartelera" && (
          <section className="vista-seccion">
            <div className="encabezado">
              <div>
                <span className="sobrelinea">
                  EN CARTELERA
                </span>

                <h2>
                  Tu próxima película
                  comienza aquí
                </h2>

                <p>
                  Descubre nuestra cartelera,
                  consulta horarios y reserva
                  tus entradas.
                </p>
              </div>
            </div>

            {/* RESUMEN */}

            <div className="resumen-cartelera">
              <article>
                <span>Películas</span>

                <strong>
                  {
                    peliculasActivas.length
                  }
                </strong>
              </article>

              <article>
                <span>
                  Funciones próximas
                </span>

                <strong>
                  {funcionesFuturas}
                </strong>
              </article>

              <article>
                <span>
                  Reservas activas
                </span>

                <strong>
                  {reservasActivas}
                </strong>
              </article>
            </div>

            {/* FILTROS */}

            <section className="filtros">
              <div className="filtros-titulo">
                <h3>
                  Buscar funciones
                </h3>
              </div>

              <div className="filtros-contenido">
                <label>
                  Película

                  <select
                    value={
                      filtroPelicula
                    }
                    onChange={(evento) =>
                      setFiltroPelicula(
                        evento.target
                          .value
                      )
                    }
                  >
                    <option value="">
                      Todas las películas
                    </option>

                    {peliculasActivas.map(
                      (pelicula) => (
                        <option
                          key={
                            pelicula.id
                          }
                          value={
                            pelicula.id
                          }
                        >
                          {
                            pelicula.titulo
                          }
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label>
                  Fecha

                  <input
                    type="date"
                    value={filtroFecha}
                    onChange={(evento) =>
                      setFiltroFecha(
                        evento.target
                          .value
                      )
                    }
                  />
                </label>

                <button
                  type="button"
                  onClick={
                    limpiarFiltros
                  }
                >
                  Limpiar filtros
                </button>
              </div>
            </section>

            {/* TÍTULO */}

            <div className="titulo-seccion">
              <div>
                <h2>Películas</h2>

                <p>
                  Explora las películas
                  disponibles.
                </p>
              </div>

              <span>
                {
                  peliculasFiltradas.length
                }{" "}
                resultados
              </span>
            </div>

            {/* CARTELERA */}

            {peliculasFiltradas.length ===
            0 ? (
              <div className="estado-vacio">
                <h3>
                  No encontramos funciones
                </h3>

                <p>
                  Prueba cambiando los
                  filtros seleccionados.
                </p>

                <button
                  type="button"
                  onClick={
                    limpiarFiltros
                  }
                >
                  Mostrar cartelera
                </button>
              </div>
            ) : (
              <section className="peliculas-grid">
                {peliculasFiltradas.map(
                  (pelicula) => {
                    const
                      funcionesPelicula =
                        funcionesFiltradas.filter(
                          (funcion) =>
                            funcion.peliculaId ===
                            pelicula.id
                        );

                    return (
                      <PeliculaCard
                        key={
                          pelicula.id
                        }
                        pelicula={
                          pelicula
                        }
                        funciones={
                          funcionesPelicula
                        }
                        onVerFunciones={
                          manejarVerFunciones
                        }
                      />
                    );
                  }
                )}
              </section>
            )}
          </section>
        )}

        {/* ==================================
            RESERVAS
        ================================== */}

        {seccionActiva ===
          "reservas" && (
          <section className="vista-seccion">
            <div className="titulo-pagina">
              <div>
                <span className="sobrelinea">
                  HISTORIAL
                </span>

                <h2>
                  Mis reservas
                </h2>

                <p>
                  Consulta reservas
                  activas y canceladas.
                </p>
              </div>

              <button
                type="button"
                className="boton-secundario"
                onClick={() =>
                  cambiarSeccion(
                    "cartelera"
                  )
                }
              >
                Nueva reserva
              </button>
            </div>

            <ReservasLista
              reservas={reservas}
              onCancelar={
                manejarCancelarReserva
              }
              cancelandoId={
                cancelandoId
              }
            />
          </section>
        )}

        {/* ==================================
            ADMINISTRACIÓN
        ================================== */}

        {seccionActiva ===
          "administracion" && (
          <section className="vista-seccion">
            <div className="titulo-pagina">
              <div>
                <span className="sobrelinea">
                  GESTIÓN
                </span>

                <h2>
                  Administración
                </h2>

                <p>
                  Gestiona películas,
                  salas y funciones.
                </p>
              </div>
            </div>

            <PanelAdministracion
              peliculas={peliculas}
              salas={salas}
              onDatosActualizados={
                manejarDatosActualizados
              }
            />
          </section>
        )}
      </main>

      {/* ====================================
          MODAL DETALLE PELÍCULA
      ==================================== */}

      {peliculaSeleccionada && (
        <div
          className="modal-overlay"
          onMouseDown={(evento) => {
            if (
              evento.target ===
              evento.currentTarget
            ) {
              cerrarPelicula();
            }
          }}
        >
          <div className="modal-pelicula">
            <button
              type="button"
              className="modal-cerrar"
              onClick={cerrarPelicula}
              aria-label="Cerrar"
            >
              ×
            </button>

            <div className="modal-pelicula-grid">
              {/* POSTER */}

              <div className="modal-poster">
                {peliculaSeleccionada.imagenUrl ? (
                  <img
                    src={
                      peliculaSeleccionada.imagenUrl
                    }
                    alt={
                      peliculaSeleccionada.titulo
                    }
                  />
                ) : (
                  <div className="pelicula-sin-imagen">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* INFORMACIÓN */}

              <div className="modal-pelicula-info">
                <span className="sobrelinea">
                  {
                    peliculaSeleccionada.genero
                  }
                </span>

                <h2>
                  {
                    peliculaSeleccionada.titulo
                  }
                </h2>

                <div className="modal-meta">
                  <span>
                    {
                      peliculaSeleccionada.duracion
                    }{" "}
                    minutos
                  </span>

                  <span>
                    {
                      peliculaSeleccionada.clasificacion
                    }
                  </span>
                </div>

                <h3>
                  Funciones disponibles
                </h3>

                <div className="modal-funciones">
                  {funcionesSeleccionadas.map(
                    (funcion) => (
                      <article
                        key={funcion.id}
                        className="modal-funcion"
                      >
                        <div>
                          <strong>
                            {new Date(
                              funcion.fechaHora
                            ).toLocaleDateString()}
                          </strong>

                          <span>
                            {new Date(
                              funcion.fechaHora
                            ).toLocaleTimeString(
                              [],
                              {
                                hour:
                                  "2-digit",
                                minute:
                                  "2-digit",
                              }
                            )}
                          </span>
                        </div>

                        <div>
                          <span>
                            {
                              funcion.sala
                                .nombre
                            }
                          </span>

                          <span>
                            $
                            {funcion.precio.toFixed(
                              2
                            )}
                          </span>
                        </div>

                        <div>
                          <span className="entradas-disponibles">
                            {
                              funcion.entradasDisponibles
                            }{" "}
                            disponibles
                          </span>

                          <button
                            type="button"
                            disabled={
                              funcion.entradasDisponibles <=
                              0
                            }
                            onClick={() =>
                              manejarReservar(
                                funcion
                              )
                            }
                          >
                            {funcion.entradasDisponibles >
                            0
                              ? "Reservar"
                              : "Agotado"}
                          </button>
                        </div>
                      </article>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================
          MODAL RESERVA
      ==================================== */}

      {funcionSeleccionada && (
        <div
          className="modal-overlay"
          onMouseDown={(evento) => {
            if (
              evento.target ===
              evento.currentTarget
            ) {
              cerrarFormulario();
            }
          }}
        >
          <div className="modal-contenido">
            <button
              type="button"
              className="modal-cerrar"
              onClick={
                cerrarFormulario
              }
              aria-label="Cerrar"
            >
              ×
            </button>

            <ReservaForm
              funcion={
                funcionSeleccionada
              }
              onReservaCreada={
                manejarReservaCreada
              }
              onCancelar={
                cerrarFormulario
              }
            />
          </div>
        </div>
      )}
    </>
  );
}

export default App;