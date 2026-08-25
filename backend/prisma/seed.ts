import "dotenv/config";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Iniciando seed...");

  // Limpiamos primero los datos existentes.
  // El orden es importante debido a las relaciones.
  await prisma.reserva.deleteMany();
  await prisma.funcion.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.sala.deleteMany();
  await prisma.pelicula.deleteMany();

  // -------------------------
  // PELÍCULAS
  // -------------------------

  const interstellar = await prisma.pelicula.create({
    data: {
      titulo: "Interstellar",
      genero: "Ciencia ficción",
      duracion: 169,
      clasificacion: "PG-13",
      estado: "ACTIVA",
    },
  });

  const insideOut = await prisma.pelicula.create({
    data: {
      titulo: "Inside Out 2",
      genero: "Animación",
      duracion: 96,
      clasificacion: "PG",
      estado: "ACTIVA",
    },
  });

  const batman = await prisma.pelicula.create({
    data: {
      titulo: "The Batman",
      genero: "Acción",
      duracion: 176,
      clasificacion: "PG-13",
      estado: "ACTIVA",
    },
  });

  // -------------------------
  // SALAS
  // -------------------------

  const sala1 = await prisma.sala.create({
    data: {
      nombre: "Sala 1",
      capacidad: 40,
      estado: "ACTIVA",
    },
  });

  const sala2 = await prisma.sala.create({
    data: {
      nombre: "Sala 2",
      capacidad: 60,
      estado: "ACTIVA",
    },
  });

  // -------------------------
  // FUNCIONES
  // -------------------------

  await prisma.funcion.create({
    data: {
      peliculaId: interstellar.id,
      salaId: sala1.id,
      fechaHora: new Date("2026-08-28T18:30:00-05:00"),
      precio: 5.5,
      estado: "PROGRAMADA",
    },
  });

  await prisma.funcion.create({
    data: {
      peliculaId: interstellar.id,
      salaId: sala2.id,
      fechaHora: new Date("2026-08-29T20:00:00-05:00"),
      precio: 6,
      estado: "PROGRAMADA",
    },
  });

  await prisma.funcion.create({
    data: {
      peliculaId: insideOut.id,
      salaId: sala1.id,
      fechaHora: new Date("2026-08-30T16:00:00-05:00"),
      precio: 4.5,
      estado: "PROGRAMADA",
    },
  });

  await prisma.funcion.create({
    data: {
      peliculaId: batman.id,
      salaId: sala2.id,
      fechaHora: new Date("2026-08-31T19:30:00-05:00"),
      precio: 6.5,
      estado: "PROGRAMADA",
    },
  });

  console.log("Seed completado correctamente.");
  console.log("3 películas creadas.");
  console.log("2 salas creadas.");
  console.log("4 funciones creadas.");
}

main()
  .catch((error) => {
    console.error("Error ejecutando seed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });