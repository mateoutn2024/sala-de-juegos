# 🕹️ Sala de Juegos - Trabajo Práctico Individual

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.8.

Este repositorio contiene el desarrollo de la **Sala de Juegos** para la materia **Programación IV** de la Tecnicatura Universitaria en Programación (**UTN Avellaneda**). La aplicación cuenta con una estructura modular, un sistema de autenticación completo, comunicación en tiempo real y persistencia de datos.

---

## 👤 Información del Alumno
* **Nombre:** Mateo
* **Institución:** UTN Regional Avellaneda
* **Materia:** Programación IV
* **Año:** 2026

---

## 🚀 Despliegue (Deploy Activo)
La aplicación se encuentra compilada y distribuida en producción a través de la plataforma Vercel de forma automatizada mediante Integración Continua (CI/CD):

🔗 **Link del Proyecto:** [https://sala-de-juegos-psi.vercel.app](https://sala-de-juegos-psi.vercel.app)

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** Angular (Estructura basada en Standalone Components)
* **Backend como Servicio (BaaS):** Supabase (Autenticación, Base de Datos y Realtime)
* **Diseño y UX/UI:** Bootstrap v5.3 (Estilos globales e interfaz responsive adaptada a Gaming)
* **Control de Versiones:** Git & GitHub (Metodología basada en ramas funcionales y Pull Requests)

---

## 📋 Descripción de los Sprints

### 🔹 Sprint #1: Estructura Inicial y "Quién Soy"
* **Objetivo:** Configuración inicial del esqueleto de la aplicación y puesta en marcha del hosting.
* **Entregables:** Creación de las vistas principales de ruteo (`Login`, `Registro`, `Home`). Implementación de la sección "Quién Soy" consumiendo de forma dinámica la API pública de GitHub para renderizar los datos del desarrollador, acompañada de un juego interactivo integrado en la misma vista.

### 🔹 Sprint #2: Autenticación, Seguridad y Logs
* **Objetivo:** Integración del motor de base de datos y protección del ecosistema de la app.
* **Entregables:** Sistema de inicio de sesión y registro de usuarios interactuando directamente con los servicios de **Supabase Auth**. Creación de un Navbar reactivo que altera sus componentes visuales según el estado asíncrono del usuario. Implementación de **Rutas Protegidas (AuthGuards)** para restringir el acceso a usuarios anónimos, y un sistema automatizado de **Logs de Ingreso** que almacena en la base de datos la fecha y hora exacta de cada login.

### 🔹 Sprint #3: Motores de Juego y Persistencia de Resultados
* **Objetivo:** Desarrollo de las lógicas de entretenimiento y almacenamiento estadístico.
* **Entregables:** Creación del clásico juego **Ahorcado** con ingreso restrictivo de caracteres mediante una botonera interactiva en pantalla (sin teclado físico). Desarrollo del juego de cartas **Mayor o Menor** utilizando el mazo tradicional de la baraja española. Conexión de un servicio centralizado de juegos encargado de reportar y persistir cada victoria o derrota en la base de datos relacional para su futuro análisis de puntuaciones.

### 🔹 Sprint #4: Chat Interactivo y Juegos Adicionales *(En Desarrollo)*
* **Objetivo:** Comunicación social interna e incremento del catálogo lúdico.
* **Entregables:** Implementación de un **Chat en Tiempo Real** utilizando las capacidades de canales web de Supabase Realtime para la interacción inmediata de los usuarios logueados. Incorporación de los dos juegos matemáticos y de destreza restantes solicitados por la cátedra para completar el TP.

---

## 📐 Metodología de Trabajo en Git
Para este proyecto se implementó un flujo basado en la segmentación de ramas independientes para garantizar la estabilidad del código en producción:
1. El código de cada fase se empaqueta localmente (`sprint-1`, `sprint-2`, etc).
2. Se sube a GitHub para abrir un **Pull Request (PR)** formal hacia la rama principal.
3. Tras verificar que no existen conflictos, se procesa el **Merge** para activar la compilación automática en Vercel, etiquetando los hitos mediante versiones estables (`v1.0`, `v2.0`).

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
