import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.use(express.json());

const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensaje: "API del cine funcionando correctamente",
    });
});

app.get("/api/peliculas", async (req, res) => {
    try {
        const peliculas = await prisma.pelicula.findMany({
            orderBy: {
                titulo: "asc",
            },
        });

        res.json(peliculas);
    } catch (error) {
        console.error("Error al obtener películas:", error);

        res.status(500).json({
            error: "No se pudieron obtener las películas",
        });
    }
});

app.post("/api/peliculas", async (req, res) => {
    try {
        const {
            titulo,
            genero,
            duracion,
            clasificacion,
            imagenUrl,
        } = req.body;

        // Validar campos obligatorios
        if (
            !titulo?.trim() ||
            !genero?.trim() ||
            duracion === undefined ||
            !clasificacion?.trim()
        ) {
            return res.status(400).json({
                error: "Título, género, duración y clasificación son obligatorios",
            });
        }

        // Convertir y validar duración
        const duracionNumero = Number(duracion);

        if (
            !Number.isInteger(duracionNumero) ||
            duracionNumero <= 0
        ) {
            return res.status(400).json({
                error: "La duración debe ser un número entero mayor que cero",
            });
        }

        // Crear película
        const pelicula = await prisma.pelicula.create({
            data: {
                titulo: titulo.trim(),
                genero: genero.trim(),
                duracion: duracionNumero,
                clasificacion: clasificacion.trim(),
                imagenUrl: imagenUrl?.trim() || null,
            },
        });

        res.status(201).json(pelicula);
    } catch (error) {
        console.error("Error al registrar película:", error);

        res.status(500).json({
            error: "No se pudo registrar la película",
        });
    }
});

app.get("/api/salas", async (req, res) => {
    try {
        const salas = await prisma.sala.findMany({
            orderBy: {
                nombre: "asc",
            },
        });

        res.json(salas);
    } catch (error) {
        console.error("Error al obtener salas:", error);

        res.status(500).json({
            error: "No se pudieron obtener las salas",
        });
    }
});

app.post("/api/salas", async (req, res) => {
    try {
        const { nombre, capacidad } = req.body;

        // Validar nombre
        if (!nombre?.trim()) {
            return res.status(400).json({
                error: "El nombre de la sala es obligatorio",
            });
        }

        // Convertir capacidad a número
        const capacidadNumero = Number(capacidad);

        // Validar capacidad
        if (
            !Number.isInteger(capacidadNumero) ||
            capacidadNumero <= 0
        ) {
            return res.status(400).json({
                error: "La capacidad debe ser un número entero mayor que cero",
            });
        }

        // Crear sala
        const sala = await prisma.sala.create({
            data: {
                nombre: nombre.trim(),
                capacidad: capacidadNumero,
            },
        });

        res.status(201).json(sala);
    } catch (error) {
        console.error("Error al registrar sala:", error);

        res.status(500).json({
            error: "No se pudo registrar la sala",
        });
    }
});

app.get("/api/funciones", async (req, res) => {
    try {
        const funciones = await prisma.funcion.findMany({
            include: {
                pelicula: true,
                sala: true,
            },
            orderBy: {
                fechaHora: "asc",
            },
        });

        const funcionesConDisponibilidad =
            await Promise.all(
                funciones.map(async (funcion) => {
                    const resultadoEntradas =
                        await prisma.reserva.aggregate({
                            where: {
                                funcionId: funcion.id,
                                estado: "ACTIVA",
                            },
                            _sum: {
                                cantidad: true,
                            },
                        });

                    const ocupadas =
                        resultadoEntradas._sum.cantidad ?? 0;

                    const disponibles =
                        funcion.sala.capacidad - ocupadas;

                    return {
                        ...funcion,
                        entradasDisponibles: disponibles,
                    };
                })
            );

        res.json(funcionesConDisponibilidad);
    } catch (error) {
        console.error("Error al obtener funciones:", error);

        res.status(500).json({
            error: "No se pudieron obtener las funciones",
        });
    }
});

app.post("/api/funciones", async (req, res) => {
    try {
        const {
            peliculaId,
            salaId,
            fechaHora,
            precio,
        } = req.body;

        // Convertimos los valores numéricos
        const peliculaIdNumero = Number(peliculaId);
        const salaIdNumero = Number(salaId);
        const precioNumero = Number(precio);

        // Validar IDs
        if (
            !Number.isInteger(peliculaIdNumero) ||
            peliculaIdNumero <= 0
        ) {
            return res.status(400).json({
                error: "La película seleccionada no es válida",
            });
        }

        if (
            !Number.isInteger(salaIdNumero) ||
            salaIdNumero <= 0
        ) {
            return res.status(400).json({
                error: "La sala seleccionada no es válida",
            });
        }

        // Validar fecha
        if (!fechaHora) {
            return res.status(400).json({
                error: "La fecha y hora son obligatorias",
            });
        }

        const fecha = new Date(fechaHora);

        if (Number.isNaN(fecha.getTime())) {
            return res.status(400).json({
                error: "La fecha y hora no son válidas",
            });
        }

        if (fecha <= new Date()) {
            return res.status(400).json({
                error: "La función debe programarse para una fecha futura",
            });
        }

        // Validar precio
        if (
            !Number.isFinite(precioNumero) ||
            precioNumero <= 0
        ) {
            return res.status(400).json({
                error: "El precio debe ser mayor que cero",
            });
        }

        // Buscar película
        const pelicula = await prisma.pelicula.findUnique({
            where: {
                id: peliculaIdNumero,
            },
        });

        if (!pelicula) {
            return res.status(404).json({
                error: "La película no existe",
            });
        }

        if (pelicula.estado !== "ACTIVA") {
            return res.status(400).json({
                error: "La película no está activa",
            });
        }

        // Buscar sala
        const sala = await prisma.sala.findUnique({
            where: {
                id: salaIdNumero,
            },
        });

        if (!sala) {
            return res.status(404).json({
                error: "La sala no existe",
            });
        }

        if (sala.estado !== "ACTIVA") {
            return res.status(400).json({
                error: "La sala no está activa",
            });
        }

        // Crear función
        const funcion = await prisma.funcion.create({
            data: {
                peliculaId: peliculaIdNumero,
                salaId: salaIdNumero,
                fechaHora: fecha,
                precio: precioNumero,
            },

            include: {
                pelicula: true,
                sala: true,
            },
        });

        res.status(201).json(funcion);
    } catch (error) {
        console.error("Error al programar función:", error);

        res.status(500).json({
            error: "No se pudo programar la función",
        });
    }
});

app.get("/api/reservas", async (req, res) => {
    try {
        const reservas = await prisma.reserva.findMany({
            include: {
                cliente: true,
                funcion: {
                    include: {
                        pelicula: true,
                        sala: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json(reservas);
    } catch (error) {
        console.error("Error al obtener reservas:", error);

        res.status(500).json({
            error: "No se pudieron obtener las reservas",
        });
    }
});

app.post("/api/reservas", async (req, res) => {
    try {
        const {
            nombre,
            email,
            funcionId,
            cantidad,
        } = req.body;

        // -------------------------
        // 1. Validar cliente
        // -------------------------

        if (!nombre?.trim()) {
            return res.status(400).json({
                error: "El nombre del cliente es obligatorio",
            });
        }

        if (!email?.trim()) {
            return res.status(400).json({
                error: "El correo electrónico es obligatorio",
            });
        }

        // -------------------------
        // 2. Validar función
        // -------------------------

        const funcionIdNumero = Number(funcionId);

        if (
            !Number.isInteger(funcionIdNumero) ||
            funcionIdNumero <= 0
        ) {
            return res.status(400).json({
                error: "La función seleccionada no es válida",
            });
        }

        // -------------------------
        // 3. Validar cantidad
        // -------------------------

        const cantidadNumero = Number(cantidad);

        if (
            !Number.isInteger(cantidadNumero) ||
            cantidadNumero <= 0
        ) {
            return res.status(400).json({
                error: "La cantidad debe ser un número entero mayor que cero",
            });
        }

        // -------------------------
        // 4. Buscar función
        // -------------------------

        const funcion = await prisma.funcion.findUnique({
            where: {
                id: funcionIdNumero,
            },
            include: {
                pelicula: true,
                sala: true,
            },
        });

        if (!funcion) {
            return res.status(404).json({
                error: "La función no existe",
            });
        }

        // -------------------------
        // 5. Verificar estado
        // -------------------------

        if (funcion.estado === "CANCELADA") {
            return res.status(400).json({
                error: "No se puede reservar una función cancelada",
            });
        }

        // -------------------------
        // 6. Verificar fecha
        // -------------------------

        if (funcion.fechaHora <= new Date()) {
            return res.status(400).json({
                error: "No se puede reservar una función que ya pasó",
            });
        }

        // -------------------------
        // 7. Calcular entradas ocupadas
        // -------------------------

        const resultadoEntradas = await prisma.reserva.aggregate({
            where: {
                funcionId: funcionIdNumero,
                estado: "ACTIVA",
            },
            _sum: {
                cantidad: true,
            },
        });

        const entradasOcupadas =
            resultadoEntradas._sum.cantidad ?? 0;

        const disponibles =
            funcion.sala.capacidad - entradasOcupadas;

        // -------------------------
        // 8. Controlar capacidad
        // -------------------------

        if (cantidadNumero > disponibles) {
            return res.status(409).json({
                error: `Solo quedan ${disponibles} entradas disponibles`,
                disponibles,
            });
        }

        // -------------------------
        // 9. Buscar o crear cliente
        // -------------------------

        const cliente = await prisma.cliente.upsert({
            where: {
                email: email.trim().toLowerCase(),
            },

            update: {
                nombre: nombre.trim(),
            },

            create: {
                nombre: nombre.trim(),
                email: email.trim().toLowerCase(),
            },
        });

        // -------------------------
        // 10. Calcular total
        // -------------------------

        const total =
            Math.round(
                cantidadNumero * funcion.precio * 100
            ) / 100;

        // -------------------------
        // 11. Crear reserva
        // -------------------------

        const reserva = await prisma.reserva.create({
            data: {
                clienteId: cliente.id,
                funcionId: funcion.id,
                cantidad: cantidadNumero,
                total,
            },

            include: {
                cliente: true,
                funcion: {
                    include: {
                        pelicula: true,
                        sala: true,
                    },
                },
            },
        });

        // -------------------------
        // 12. Responder
        // -------------------------

        res.status(201).json({
            mensaje: "Reserva creada correctamente",
            reserva,
            disponibles:
                disponibles - cantidadNumero,
        });
    } catch (error) {
        console.error("Error al registrar reserva:", error);

        res.status(500).json({
            error: "No se pudo registrar la reserva",
        });
    }
});

app.patch("/api/reservas/:id/cancelar", async (req, res) => {
    try {
        const reservaId = Number(req.params.id);

        if (
            !Number.isInteger(reservaId) ||
            reservaId <= 0
        ) {
            return res.status(400).json({
                error: "El ID de la reserva no es válido",
            });
        }

        const reserva = await prisma.reserva.findUnique({
            where: {
                id: reservaId,
            },
            include: {
                funcion: {
                    include: {
                        sala: true,
                    },
                },
            },
        });

        if (!reserva) {
            return res.status(404).json({
                error: "La reserva no existe",
            });
        }

        if (reserva.estado === "CANCELADA") {
            return res.status(400).json({
                error: "La reserva ya está cancelada",
            });
        }

        const reservaCancelada =
            await prisma.reserva.update({
                where: {
                    id: reservaId,
                },
                data: {
                    estado: "CANCELADA",
                },
            });

        const resultadoEntradas =
            await prisma.reserva.aggregate({
                where: {
                    funcionId: reserva.funcionId,
                    estado: "ACTIVA",
                },
                _sum: {
                    cantidad: true,
                },
            });

        const ocupadas =
            resultadoEntradas._sum.cantidad ?? 0;

        const disponibles =
            reserva.funcion.sala.capacidad - ocupadas;

        res.json({
            mensaje: "Reserva cancelada correctamente",
            reserva: reservaCancelada,
            disponibles,
        });
    } catch (error) {
        console.error("Error al cancelar reserva:", error);

        res.status(500).json({
            error: "No se pudo cancelar la reserva",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});