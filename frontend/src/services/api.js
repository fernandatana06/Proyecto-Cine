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