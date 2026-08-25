import { useEffect, useState } from "react";
import {
  obtenerFunciones,
  obtenerPeliculas,
} from "./services/api";

import PeliculaCard from "./components/PeliculaCard";

import "./App.css";

function App() {
  const [peliculas, setPeliculas] = useState([]);
  const [funciones, setFunciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarCartelera() {
      try {
        const [datosPeliculas, datosFunciones] =
          await Promise.all([
            obtenerPeliculas(),
            obtenerFunciones(),
          ]);

        setPeliculas(datosPeliculas);
        setFunciones(datosFunciones);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarCartelera();
  }, []);

  if (cargando) {
    return <p>Cargando cartelera...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const peliculasActivas = peliculas.filter(
    (pelicula) => pelicula.estado === "ACTIVA"
  );

  return (
    <main className="contenedor">
      <header className="encabezado">
        <h1>Cartelera</h1>
        <p>Consulta nuestras películas y funciones disponibles.</p>
      </header>

      {peliculasActivas.length === 0 ? (
        <p>No hay películas activas.</p>
      ) : (
        <section className="peliculas-grid">
          {peliculasActivas.map((pelicula) => {
            const funcionesPelicula = funciones.filter(
              (funcion) =>
                funcion.peliculaId === pelicula.id &&
                funcion.estado === "PROGRAMADA" &&
                new Date(funcion.fechaHora) > new Date()
            );

            return (
              <PeliculaCard
                key={pelicula.id}
                pelicula={pelicula}
                funciones={funcionesPelicula}
              />
            );
          })}
        </section>
      )}
    </main>
  );
}

export default App;