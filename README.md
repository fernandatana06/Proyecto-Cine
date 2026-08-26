# Sistema Web de Reservas para Cine

Aplicación web full stack desarrollada como prueba técnica.

El sistema permite administrar películas, salas y funciones, consultar la cartelera, realizar reservas, controlar la disponibilidad de entradas y cancelar reservas sin eliminar su historial.

---

## Descripción

La aplicación simula el funcionamiento básico de un sistema de reservas para un cine.

Cuenta con una interfaz pública para consultar la cartelera y realizar reservas, además de un panel básico de administración para registrar películas, salas y nuevas funciones.

La disponibilidad de entradas se calcula utilizando la capacidad máxima de cada sala y las reservas activas asociadas a cada función.

---

## Tecnologías utilizadas

### Frontend

- React
- Vite
- JavaScript
- JSX
- CSS
- Fetch API
- Async / Await

### Backend

- Node.js
- Express
- JavaScript
- CORS

### Base de datos

- Prisma ORM
- SQLite

### Control de versiones

- Git
- GitHub

---

## Arquitectura general

El flujo principal de la aplicación es:

```text
React
   ↓
Fetch API
   ↓
Express
   ↓
Prisma ORM
   ↓
SQLite
```

El frontend realiza solicitudes HTTP al backend.

Express procesa las solicitudes y aplica las reglas de negocio.

Prisma se encarga de consultar y modificar la base de datos SQLite.

Finalmente, el backend devuelve respuestas JSON que React utiliza para actualizar la interfaz.

---

## Estructura del proyecto

```text
cine/
│
├── backend/
│   ├── lib/
│   │   └── prisma.js
│   │
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   ├── .env.example
│   ├── index.js
│   ├── package.json
│   └── prisma.config.ts
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── PanelAdministracion.jsx
│   │   │   ├── PeliculaCard.jsx
│   │   │   ├── ReservaForm.jsx
│   │   │   └── ReservasLista.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# Funcionalidades

## Cartelera

La aplicación permite:

- visualizar películas activas;
- mostrar imágenes de las películas;
- consultar género, duración y clasificación;
- consultar las funciones futuras;
- visualizar sala, fecha, hora y precio;
- consultar la cantidad de entradas disponibles;
- filtrar por película;
- filtrar por fecha.

La interfaz utiliza tarjetas visuales y una ventana de detalle para consultar las funciones disponibles de cada película.

---

## Reservas

El usuario puede:

- seleccionar una función;
- ingresar su nombre;
- ingresar su correo electrónico;
- seleccionar la cantidad de entradas;
- visualizar el total estimado;
- confirmar la reserva;
- consultar las reservas realizadas;
- cancelar una reserva.

Las reservas canceladas permanecen almacenadas en el historial.

---

## Administración

El panel de administración permite:

- registrar nuevas películas;
- registrar nuevas salas;
- definir la capacidad de una sala;
- programar nuevas funciones;
- seleccionar película y sala;
- establecer fecha y hora;
- establecer el precio de la función.

Después de registrar información, la interfaz se actualiza automáticamente.

---

# Reglas de negocio

## Cantidad de entradas

La cantidad debe ser un número entero mayor que cero.

La validación se realiza también en el backend y no depende únicamente del formulario de React.

---

## Funciones disponibles

Solo es posible reservar una función cuyo estado sea:

```text
PROGRAMADA
```

Además, la fecha y hora de la función deben ser futuras.

---

## Control de capacidad

La aplicación evita que las reservas activas superen la capacidad máxima de la sala.

La disponibilidad se calcula mediante:

```text
Entradas disponibles =
Capacidad de la sala
-
Entradas pertenecientes a reservas activas
```

Por ejemplo:

```text
Capacidad de sala: 40
Entradas activas: 34

Disponibles: 6
```

Si un usuario intenta reservar 7 entradas, la API rechaza la solicitud.

---

## Cálculo del total

El cálculo final se realiza en el backend:

```text
Total = cantidad de entradas × precio de la función
```

El frontend muestra un total estimado, pero el valor almacenado en la base de datos siempre es calculado por el servidor.

---

## Cancelación

Cancelar una reserva no elimina el registro.

El estado cambia:

```text
ACTIVA
↓
CANCELADA
```

Las entradas de una reserva cancelada dejan de contar dentro de la ocupación de la sala.

Por esta razón, los cupos vuelven a estar disponibles automáticamente.

---

## Clientes

Los clientes se identifican mediante su correo electrónico.

El correo se normaliza a minúsculas antes de almacenarlo.

Prisma utiliza `upsert` para reutilizar un cliente existente cuando ya existe un registro con el mismo correo electrónico.

---

# Endpoints principales

## Películas

### Obtener películas

```http
GET /api/peliculas
```

### Registrar película

```http
POST /api/peliculas
```

Ejemplo:

```json
{
  "titulo": "Interstellar",
  "genero": "Ciencia ficción",
  "duracion": 169,
  "clasificacion": "PG-13",
  "imagenUrl": "https://ejemplo.com/poster.jpg"
}
```

---

## Salas

### Obtener salas

```http
GET /api/salas
```

### Registrar sala

```http
POST /api/salas
```

Ejemplo:

```json
{
  "nombre": "Sala 1",
  "capacidad": 40
}
```

---

## Funciones

### Obtener funciones

```http
GET /api/funciones
```

La respuesta incluye la disponibilidad actual de entradas.

### Programar función

```http
POST /api/funciones
```

Ejemplo:

```json
{
  "peliculaId": 1,
  "salaId": 1,
  "fechaHora": "2026-08-30T18:00:00.000Z",
  "precio": 6.5
}
```

---

## Reservas

### Obtener reservas

```http
GET /api/reservas
```

### Crear reserva

```http
POST /api/reservas
```

Ejemplo:

```json
{
  "nombre": "Cliente Prueba",
  "email": "cliente@ejemplo.com",
  "funcionId": 1,
  "cantidad": 2
}
```

### Cancelar reserva

```http
PATCH /api/reservas/:id/cancelar
```

Ejemplo:

```http
PATCH /api/reservas/1/cancelar
```

---

# Instalación

## Requisitos previos

Es necesario tener instalado:

- Node.js
- npm
- Git

No es necesario instalar un servidor de base de datos externo porque el proyecto utiliza SQLite.

---

# 1. Clonar el proyecto

```bash
git clone <URL-DEL-REPOSITORIO>
```

Ingresar al proyecto:

```bash
cd cine
```

---

# 2. Configurar el backend

Ingresar a:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo `.env` utilizando como referencia:

```text
backend/.env.example
```

Contenido:

```env
DATABASE_URL="file:./dev.db"
```

---

## Generar Prisma Client

```bash
npx prisma generate
```

---

## Aplicar migraciones

```bash
npx prisma migrate dev
```

---

## Cargar datos iniciales

```bash
npx prisma db seed
```

El seed genera datos de demostración con películas, salas y funciones.

---

## Ejecutar backend

```bash
npm run dev
```

El servidor estará disponible en:

```text
http://localhost:3000
```

La API utiliza:

```text
http://localhost:3000/api
```

---

# 3. Configurar el frontend

Abrir otra terminal y entrar en:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

El archivo:

```text
frontend/.env.example
```

contiene:

```env
VITE_API_URL=http://localhost:3000/api
```

La aplicación también utiliza esa URL como valor predeterminado durante el desarrollo local.

---

## Ejecutar frontend

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:5173
```

---

# Uso en Windows

Si PowerShell bloquea la ejecución de los scripts `npm.ps1` o `npx.ps1`, se pueden ejecutar las versiones `.cmd`.

Ejemplos:

```powershell
npm.cmd install
npm.cmd run dev
npx.cmd prisma generate
npx.cmd prisma migrate dev
npx.cmd prisma db seed
```

---

# Build de producción

Para comprobar que el frontend puede compilarse correctamente:

```bash
cd frontend
npm run build
```

Vite generará:

```text
frontend/dist/
```

La carpeta `dist` no se almacena en Git porque puede generarse nuevamente mediante el comando de build.

---

# Datos iniciales

El proyecto incluye un archivo:

```text
backend/prisma/seed.ts
```

con datos iniciales para realizar una demostración del sistema.

Incluye como mínimo:

```text
3 películas
2 salas
4 funciones
```

Esto permite probar el sistema inmediatamente después de instalarlo.

---

# Migraciones

Las migraciones de Prisma se encuentran en:

```text
backend/prisma/migrations/
```

Estas forman parte del repositorio para permitir reconstruir la estructura de la base de datos.

---

# Manejo de errores

La API utiliza códigos HTTP según el tipo de resultado.

Ejemplos:

```text
200 OK
201 Created
400 Bad Request
404 Not Found
409 Conflict
500 Internal Server Error
```

Algunos casos controlados son:

- datos obligatorios faltantes;
- cantidad de entradas inválida;
- correo electrónico inválido;
- película inexistente;
- sala inexistente;
- sala duplicada;
- función pasada;
- función no disponible;
- cantidad superior a los cupos disponibles;
- reserva inexistente;
- reserva previamente cancelada.

---

# Decisiones técnicas

## SQLite

Se eligió SQLite porque permite ejecutar el proyecto localmente sin instalar o configurar un servidor externo de base de datos.

---

## Prisma ORM

Prisma permite definir claramente las entidades y relaciones:

```text
Película
Sala
Función
Cliente
Reserva
```

Además permite manejar migraciones, seed y consultas desde JavaScript.

---

## Validaciones en backend

Las reglas importantes se validan en Express incluso cuando también existen controles en React.

Esto evita depender del frontend para proteger las reglas de negocio.

---

## Disponibilidad calculada

La disponibilidad no se almacena directamente como un campo independiente.

Se calcula utilizando:

```text
capacidad de sala - reservas activas
```

Esto reduce el riesgo de mantener datos inconsistentes.

---

## Reservas canceladas

Las reservas no se eliminan físicamente.

Se utiliza el estado:

```text
CANCELADA
```

para conservar el historial y excluir sus entradas del cálculo de ocupación.

---

## Imágenes mediante URL

Las películas almacenan opcionalmente:

```text
imagenUrl
```

Esto permite mostrar posters sin implementar un sistema de carga y almacenamiento de archivos.

---

## Navegación del frontend

La aplicación utiliza navegación interna mediante estado de React para separar:

```text
Cartelera
Reservas
Administración
```

No se agregó una dependencia de routing porque el alcance del sistema puede resolverse correctamente como una aplicación de una sola página.

---

## Fechas

Para el filtro por fecha se utiliza la fecha local del navegador en lugar de convertir directamente el valor mediante `toISOString()`.

Esto evita posibles cambios de día ocasionados por diferencias de zona horaria.

---

# Diseño de interfaz

La aplicación incluye:

- diseño responsive;
- navegación entre secciones;
- tarjetas de películas;
- imágenes de cartelera;
- filtros;
- estados de carga;
- mensajes de éxito;
- mensajes de error;
- estados vacíos;
- modales para consultar funciones;
- formulario de reserva;
- panel administrativo.

El CSS fue desarrollado sin utilizar Bootstrap, Tailwind ni una librería externa de componentes.

---

# Flujo recomendado para demostrar el sistema

Durante la demostración se puede realizar el siguiente flujo:

```text
1. Registrar una película.

2. Registrar una sala.

3. Programar una función futura.

4. Ver la función en la cartelera.

5. Consultar las entradas disponibles.

6. Realizar una reserva válida.

7. Comprobar que la disponibilidad disminuye.

8. Intentar reservar más entradas de las disponibles.

9. Comprobar que la API rechaza la operación.

10. Cancelar una reserva activa.

11. Comprobar que permanece en el historial.

12. Verificar que los cupos vuelven a estar disponibles.
```

---

# Funcionalidades fuera del alcance

No se implementaron funcionalidades que no eran necesarias para la prueba, como:

- inicio de sesión;
- contraseñas;
- roles o permisos;
- pagos en línea;
- envío real de correos;
- selección individual de asientos;
- carga de archivos;
- despliegue en un servidor.

---

# Variables de entorno

Los archivos reales `.env` no se incluyen en el repositorio.

Se incluyen archivos:

```text
.env.example
```

como referencia para configurar el proyecto.

No se deben almacenar contraseñas, tokens ni información sensible en Git.

---

# Herramientas de apoyo utilizadas

Durante el desarrollo se utilizó ChatGPT como herramienta de apoyo para:

- explicación de conceptos técnicos;
- revisión de errores;
- depuración;
- revisión de validaciones;
- organización de componentes;
- revisión de comandos de Git;
- mejoras de interfaz;
- documentación del proyecto.

El código fue integrado, revisado y probado durante el desarrollo del proyecto.

También se utilizaron herramientas como:

- Visual Studio Code;
- Postman para probar endpoints;
- Prisma Studio para inspeccionar datos;
- Git y GitHub para control de versiones.

---

# Estado del proyecto

El sistema permite completar el flujo principal esperado:

```text
Administrar películas y salas
          ↓
Programar funciones
          ↓
Consultar cartelera
          ↓
Ver disponibilidad
          ↓
Realizar reserva
          ↓
Actualizar cupos
          ↓
Consultar historial
          ↓
Cancelar reserva
          ↓
Liberar cupos
```

---

## Autor

Proyecto desarrollado como parte de una prueba técnica de desarrollo Full Stack.