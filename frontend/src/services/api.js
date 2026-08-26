const API_URL = "http://localhost:3000/api";

export async function obtenerPeliculas() {
  const respuesta = await fetch(`${API_URL}/peliculas`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener las películas");
  }

  return respuesta.json();
}

export async function obtenerFunciones() {
    const respuesta = await fetch(`${API_URL}/funciones`);
  
    if (!respuesta.ok) {
      throw new Error("No se pudieron obtener las funciones");
    }
  
    return respuesta.json();
  }

export async function crearReserva(datosReserva) {
  const respuesta = await fetch(`${API_URL}/reservas`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(datosReserva),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.error || "No se pudo crear la reserva"
    );
  }

  return datos;
}

export async function obtenerReservas() {
    const respuesta = await fetch(`${API_URL}/reservas`);
  
    if (!respuesta.ok) {
      throw new Error("No se pudieron obtener las reservas");
    }
  
    return respuesta.json();
  }
  
  export async function cancelarReserva(id) {
    const respuesta = await fetch(
      `${API_URL}/reservas/${id}/cancelar`,
      {
        method: "PATCH",
      }
    );
  
    const datos = await respuesta.json();
  
    if (!respuesta.ok) {
      throw new Error(
        datos.error || "No se pudo cancelar la reserva"
      );
    }
  
    return datos;
  }

  export async function crearPelicula(datosPelicula) {
    const respuesta = await fetch(`${API_URL}/peliculas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosPelicula),
    });
  
    const datos = await respuesta.json();
  
    if (!respuesta.ok) {
      throw new Error(
        datos.error || "No se pudo registrar la película"
      );
    }
  
    return datos;
  }
  
  export async function crearSala(datosSala) {
    const respuesta = await fetch(`${API_URL}/salas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosSala),
    });
  
    const datos = await respuesta.json();
  
    if (!respuesta.ok) {
      throw new Error(
        datos.error || "No se pudo registrar la sala"
      );
    }
  
    return datos;
  }
  
  export async function crearFuncion(datosFuncion) {
    const respuesta = await fetch(`${API_URL}/funciones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosFuncion),
    });
  
    const datos = await respuesta.json();
  
    if (!respuesta.ok) {
      throw new Error(
        datos.error || "No se pudo programar la función"
      );
    }
  
    return datos;
  }

  export async function obtenerSalas() {
    const respuesta = await fetch(`${API_URL}/salas`);
  
    if (!respuesta.ok) {
      throw new Error("No se pudieron obtener las salas");
    }
  
    return respuesta.json();
  }