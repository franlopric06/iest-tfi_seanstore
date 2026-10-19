# Constitución de Sean's Store

Son las reglas que no se negocian. El agente las lee **antes de cada spec, plan o tarea**, y cada una se puede comprobar.

| N° | Principio | Cómo se comprueba |
| --- | --- | --- |
| 1 | **Stack fijo.** Tienda en React + Vite + Tailwind CSS v4 + Motion; API en Node.js + Express; base PostgreSQL (Neon); publicación en Vercel. Solo se usan las dependencias de `03-TECNOLOGIAS.md`. | Los `package.json` solo tienen dependencias de esa lista. |
| 2 | **La marca sale de los tokens.** Colores, fuentes, radios y sombras se definen una sola vez como variables CSS en el `@theme` de `styles/index.css` y se usan con sus clases (`bg-violeta`, `font-titulos`). Ningún color escrito a mano. | Buscar `#` seguido de un color o `[#` dentro de `frontend/src` (fuera de `index.css`) da cero resultados. |
| 3 | **Capas separadas.** El navegador solo habla con la API a través de `services/api.js`; la base solo se usa desde `db/conexion.js`; las consultas SQL van siempre con parámetros (`$1`, `$2`). | Ningún componente usa `fetch` directo; ninguna consulta arma SQL concatenando texto. |
| 4 | **Primero la spec, después el código.** Todo código responde a un requisito de `specs/NNN/spec.md`. Si aparece algo nuevo, entra primero en la spec (con `/cambio`) y después en el código. | Cada commit de código nombra su tarea (`001-T03`) y esa tarea está en `tasks.md`. |
| 5 | **Tests en verde.** Cada requisito de prioridad Alta tiene al menos un test automático. Antes de cada commit, `npm test` y `npm run build` terminan sin errores. | Correr `npm test` y `npm run build` en `frontend/` y `backend/`. |
| 6 | **Seguridad y datos.** Ninguna clave en el repositorio ni en el chat con la IA: van en `.env` (ignorado por Git) y en las variables de Vercel. Todo lo que manda un formulario se valida en el servidor. | `.env` está en `.gitignore`; buscar `DATABASE_URL=` en el repositorio no encuentra valores. |
| 7 | **Para todos y en celular primero.** Español rioplatense con el tono de la marca, diseño desde 360 px, texto alternativo en todas las imágenes, navegación con teclado y Lighthouse de 80 o más en las cuatro categorías. | Informe de Lighthouse y prueba con la tecla Tab en celular y PC. |
| 8 | **IA con supervisión humana.** El estudiante lee y entiende cada archivo antes de aceptarlo y de hacer el commit; no se aprueban comandos sin mirarlos; toda pieza generada con IA lleva la leyenda «Generado con IA»; no se usan imágenes, voces ni datos de personas reales sin consentimiento; los errores de la IA se registran en `docs/PROMPTS.md`. | `PROMPTS.md` con al menos 3 errores registrados; leyendas visibles en el sitio; el estudiante explica cualquier archivo en la defensa. |
