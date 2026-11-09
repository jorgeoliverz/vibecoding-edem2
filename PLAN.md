# Plan

El agente trabaja una fase cada vez y marca las casillas al cerrarla.

## Fase 0 · Esqueleto mínimo funcional

**Objetivo:** levantar la estructura básica de Docker (FastAPI, React y PostgreSQL) mostrando la pantalla inicial que se abre en el navegador.

**Tareas:**
- [x] Configurar `.env.example` y los servicios en `docker-compose.yml` (`db`, `backend`, `frontend`).
- [x] Crear el backend mínimo en FastAPI con endpoint `GET /health` que verifique conexión a PostgreSQL.
- [x] Crear el frontend mínimo en React (Vite) que muestre el título de la app y el botón principal inactivo o con texto "¿Qué veo hoy?".
- [x] Configurar arnés de pruebas base (pytest y vitest).

**Pruebas:**
- Prueba en backend que valida el endpoint `/health` (código 200).
- Prueba en frontend que valida que la página carga con su título y el botón visible.

**Cómo comprobarás que funciona:**
- Abres `http://localhost:5173` en el navegador y ves la página con el título de la app y el botón central sin errores en consola.
- Abres `http://localhost:8000/health` y devuelve `{"status": "ok", "db": "connected"}`.

**Hecho cuando:** ambos servicios responden en local sin errores y las pruebas automáticas pasan.

---

## Fase 1 · El primer clic (la fase más pequeña posible)

**Objetivo:** conectar el botón con el backend para que al hacer clic se obtenga y muestre una primera película real desde la base de datos.

**Tareas:**
- [x] Crear tabla `movies` en PostgreSQL con 2-3 películas de prueba precargadas (título, sinopsis, imagen).
- [x] Crear endpoint `GET /api/movies/random` en FastAPI que devuelva una película de la base de datos.
- [x] Conectar el botón de React: al pulsarlo, llama al endpoint y muestra en pantalla el título, la foto y la sinopsis de la película devuelta.
- [x] Escribir prueba unitaria en backend y prueba de componente en frontend.

**Pruebas:**
- Backend: test que comprueba que `GET /api/movies/random` retorna una película con `title`, `synopsis` y `poster_url`.
- Frontend: test que simula el clic en el botón y comprueba que los datos de la película se renderizan en el DOM.

**Cómo comprobarás que funciona:**
- Abres `http://localhost:5173`, pulsas el botón y ves aparecer inmediatamente una película con su título, su imagen y su descripción.

**Hecho cuando:** pulsas el botón en el navegador y ves la película en pantalla sin recargar la página, con las pruebas pasando.

---

## Fase 2 · Recomendación aleatoria sin repetición inmediata y estados de interfaz

**Objetivo:** evitar que la película se repita al volver a pulsar y pulir el diseño del botón y la tarjeta con estados de carga y error.

**Tareas:**
- [x] Modificar el endpoint `GET /api/movies/random?exclude_id={id}` para que no devuelva la misma película que está en pantalla.
- [x] Ampliar el catálogo semilla con más películas variadas.
- [x] Mejorar los estilos visuales: botón grande centrado, tarjeta de película clara y responsiva, y animación/indicador de carga al pedir recomendación.
- [x] Manejar visualmente posibles errores de conexión si el backend no responde.

**Pruebas:**
- Backend: test que comprueba que al enviar `exclude_id` el resultado devuelto tiene un `id` distinto.
- Frontend: test que verifica que al pulsar de nuevo se envía el `exclude_id` y cambia la recomendación en pantalla.

**Cómo comprobarás que funciona:**
- Abres la app, pulsas el botón: ves una película. Vuelves a pulsar: cambia a otra película diferente. Si pulsas varias veces seguidas, nunca te muestra dos veces la misma película consecutiva.

**Hecho cuando:** la experiencia visual es fluida, el cambio entre películas funciona sin repetición inmediata y todas las pruebas pasan.

---

## Fase 3 · Pruebas End-to-End completas y verificación final

**Objetivo:** validar todo el flujo de usuario de punta a punta con Playwright sobre los contenedores en marcha.

**Tareas:**
- [ ] Escribir prueba e2e con Playwright en `e2e/` simulando la interacción completa de un usuario real.
- [ ] Ejecutar suite completa (pytest + vitest + playwright) y validar linters/formatos.
- [ ] Documentar en el README cómo levantar y probar el proyecto con un solo comando.

**Pruebas:**
- Playwright ejecuta en navegador sin cabeza: carga la página -> pulsa el botón -> valida que aparece título/imagen -> pulsa de nuevo -> valida que cambió el título -> pasa en verde.

**Cómo comprobarás que funciona:**
- Ejecutas `npm run test:e2e` y ves cómo el navegador automatizado realiza todo el recorrido con éxito sin fallos.

**Hecho cuando:** todas las pruebas pasan al 100%, no hay errores ni advertencias de linter y el proyecto queda verificado.
