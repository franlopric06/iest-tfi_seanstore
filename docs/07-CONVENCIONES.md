# 07 · Convenciones

## Idioma

- Nombres de variables, funciones y componentes **en español** (`agregarAlCarrito`, `TarjetaProducto`).
- Palabras reservadas y de librerías quedan en inglés (`useState`, `router.get`).
- Comentarios en español, cortos y solo cuando aclaran algo.

## Nombres

| Qué | Formato | Ejemplo |
| --- | --- | --- |
| Componentes y páginas React | PascalCase | `TarjetaProducto.jsx`, `DetalleProducto.jsx` |
| Funciones y variables | camelCase | `calcularTotal()`, `listaProductos` |
| Constantes | MAYÚSCULAS_CON_GUION | `TAMANO_MAXIMO_IMAGEN` |
| Archivos de backend | camelCase + tipo | `pedidos.routes.js`, `validarPedido.js` |
| Tablas y columnas SQL | snake_case en minúscula | `pedido_items`, `costo_envio` |
| Estilos | Clases de Tailwind en el JSX | `className="rounded-marca bg-magenta px-6 py-3 text-white"` |
| Variables de entorno | MAYÚSCULAS | `DATABASE_URL` |

## Reglas de código

- Un componente o función principal **por archivo**.
- Usar `const` y `let`, nunca `var`.
- Funciones flecha para componentes y helpers.
- Archivos de no más de ~150 líneas: si crece, se divide.
- Los componentes se agrupan por tema en `components/` (`layout`, `tienda`, `confianza`, `atencion`, `comunes`).
- Los textos fijos van en `src/data/`, no escritos dentro de los componentes.
- Toda llamada a la API pasa por `services/api.js`.
- Estilos **solo con clases de Tailwind** y los colores del tema (`bg-violeta`, `text-magenta`); nunca valores sueltos como `bg-[#E5007D]` ni colores por defecto (`bg-purple-900`).
- Si una combinación de clases se repite, se convierte en componente (ej. `Boton.jsx` con variantes), no en `@apply`. `@apply` solo en la capa base de `index.css`.
- Las clases se ordenan solas con `prettier-plugin-tailwindcss`.
- Responsive "desde el celular": primero las clases para celular y después `sm:`, `md:`, `lg:`.
- Animaciones solo con Motion, siguiendo el sistema de movimiento de `06-DISENO-UI.md`.

```jsx
// components/tienda/TarjetaProducto.jsx
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import Precio from "./Precio";

const TarjetaProducto = ({ producto }) => (
  <motion.article
    whileHover={{ y: -6 }}
    transition={{ type: "spring", stiffness: 300, damping: 22 }}
    className="group overflow-hidden rounded-marca bg-white shadow-tarjeta hover:shadow-elevada"
  >
    <Link to={`/producto/${producto.slug}`} className="block">
      <img
        src={producto.fotoPrincipal}
        alt={`${producto.nombre} personalizable`}
        loading="lazy"
        className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="space-y-2 p-4">
        <span className="inline-block rounded-full bg-amarillo px-3 py-1 text-xs font-bold text-violeta">
          Personalizable
        </span>
        <h3 className="text-lg text-violeta">{producto.nombre}</h3>
        <Precio actual={producto.precio} anterior={producto.precioAnterior} />
      </div>
    </Link>
  </motion.article>
);

export default TarjetaProducto;
```

## Tests

- Frontend: `frontend/tests/NombreComponente.test.jsx` con Vitest y Testing Library. Se prueba lo que ve y hace el cliente (texto en pantalla, clics), no detalles internos.
- Backend: `backend/tests/recurso.test.js` con Vitest y Supertest. Se prueba cada ruta: respuesta correcta, datos inválidos y errores. La base se reemplaza por datos de prueba (no se usa la base real en los tests).
- El nombre del test dice el requisito que prueba: `it("R2 · filtra los productos por categoría", …)`.

## Commits

Un commit por tarea, en español, en presente y empezando con un verbo, con el código de la tarea entre paréntesis:

```text
agrega filtro por categoría en el catálogo (001-T03)
crea ruta POST /api/consultas con validación (002-T02)
corrige el mensaje de WhatsApp cuando no hay talle (002-T05)
```

Los commits de documentación o arnés no llevan código de tarea: `agrega comando /verificar`.

## Ramas

| Rama | Para qué |
| --- | --- |
| `main` | Versión publicada |
| `feature/nombre` | Funcionalidad nueva (ej. `feature/subir-diseno`) |
| `fix/nombre` | Corrección de un error |

Cada rama se une a `main` con un Pull Request; Vercel genera una vista previa para revisarla antes.
