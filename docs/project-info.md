# Información del proyecto

## Qué es
Una aplicación web de recomendación instantánea de películas con un único botón central. Al pulsarlo, muestra al azar una sola película (póster, título y sinopsis) para evitar la fatiga de decisión; si no te convence, vuelves a pulsar para ver otra diferente.

## Para quién
Personas que quieren ver algo en la tele pero tienen pereza o indecisión para buscar en catálogos extensos y quieren una recomendación directa en un solo clic.

## Funciones
- Mostrar una pantalla inicial limpia con un único botón principal destacado.
- Al pulsar el botón, solicitar al backend una película al azar.
- Presentar claramente la foto (póster), el título y la sinopsis/descripción de la película recomendada.
- Permitir pulsar de nuevo el botón para recibir otra opción aleatoria distinta de la actual.

## Fuera de alcance
- Cuentas de usuario, autenticación o perfiles.
- Búsqueda manual, filtros por género/año o listas de favoritos.
- Enlaces de reproducción directa, streaming integrado o valoración de usuarios.

## Tecnología
- **Frontend:** React (con Vite).
- **Backend:** FastAPI (Python).
- **Base de datos:** PostgreSQL.
- **Contenedores y orquestación:** Docker y Docker Compose (servicios: `db`, `backend`, `frontend`).
- **Pruebas:**
  - Backend: `pytest` / `httpx` (para endpoints y lógica de selección aleatoria).
  - Frontend: Vitest / React Testing Library.
  - Extremo a extremo: Playwright en `e2e/`.

## Datos y claves
- Tabla `movies`: id, title, synopsis, poster_url.
- Claves y variables de entorno en `.env` (con plantilla en `.env.example`):
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DB`
  - `POSTGRES_HOST`
  - `POSTGRES_PORT`
  - `DATABASE_URL`
  - `VITE_API_URL`

## Cómo se prueba
- **Carga inicial:** La página abre y muestra el botón principal sin ninguna película seleccionada.
- **Acción:** Al pulsar el botón, se llama al endpoint `GET /api/movies/random` y se renderiza la película (título visible, sinopsis y póster).
- **Aleatoriedad/Cambio:** Al volver a pulsar el botón (`GET /api/movies/random?exclude_id=X`), se devuelve y muestra otra película diferente a la actual.
