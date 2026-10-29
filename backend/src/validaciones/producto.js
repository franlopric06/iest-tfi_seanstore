const CAMPOS_ESPERADOS = new Set([
  "nombre",
  "categoria_id",
  "precio",
  "stock",
  "descripcion",
  "talles",
  "colores",
  "destacado",
  "activo",
]);

const LIMITE_NOMBRE = 120;
const LIMITE_PRECIO = 9999999999.99;
const LIMITE_STOCK = 2147483647;

const esTexto = (valor) => typeof valor === "string" && valor.trim().length > 0;

const validarNombre = (datos) => {
  if (!esTexto(datos.nombre) || datos.nombre.trim().length > LIMITE_NOMBRE) {
    return "El nombre es obligatorio y puede tener hasta 120 caracteres.";
  }
  return null;
};

const validarCategoriaId = (datos) => {
  if (!Number.isInteger(datos.categoria_id) || datos.categoria_id < 1) {
    return "Elegí una categoría válida.";
  }
  return null;
};

const validarPrecio = (datos) => {
  const precio = datos.precio;
  if (
    typeof precio !== "number" ||
    !Number.isFinite(precio) ||
    precio < 0 ||
    precio > LIMITE_PRECIO
  ) {
    return "El precio debe ser un número entre 0 y 9999999999.99.";
  }
  return null;
};

const validarStock = (datos) => {
  if (
    !Number.isInteger(datos.stock) ||
    datos.stock < 0 ||
    datos.stock > LIMITE_STOCK
  ) {
    return "El stock debe ser un número entero sin decimales, desde cero.";
  }
  return null;
};

const validarDescripcion = (datos) => {
  const descripcion = datos.descripcion;
  if (descripcion === undefined || descripcion === null) {
    return null;
  }
  if (typeof descripcion !== "string") {
    return "La descripción debe ser texto (o vacía).";
  }
  return null;
};

const esBooleano = (valor) => typeof valor === "boolean";

const validarDestacado = (datos) =>
  esBooleano(datos.destacado) ? null : "El destacado debe ser sí o no.";

const validarActivo = (datos) =>
  datos.activo === undefined || esBooleano(datos.activo)
    ? null
    : "El estado activo debe ser sí o no.";

const validarListaValores = (nombreLista, minimo = 0) => (datos) => {
  const valor = datos[nombreLista];
  if (
    !Array.isArray(valor) ||
    valor.some((item) => !esTexto(item)) ||
    valor.length < minimo
  ) {
    const conMinimo =
      minimo > 0
        ? `, con al menos ${minimo === 1 ? "uno" : minimo}`
        : "";
    return `Las ${nombreLista} deben ser una lista de textos sin vacíos${conMinimo}.`;
  }
  return null;
};

const validadoresPorCampo = {
  nombre: validarNombre,
  categoria_id: validarCategoriaId,
  precio: validarPrecio,
  stock: validarStock,
  descripcion: validarDescripcion,
  talles: validarListaValores("talles"),
  colores: validarListaValores("colores", 1),
  destacado: validarDestacado,
  activo: validarActivo,
};

export const validarProducto = (datos) => {
  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return { generales: "Los datos del producto no forman un cuerpo válido." };
  }

  const errores = {};

  if (Object.keys(datos).some((campo) => !CAMPOS_ESPERADOS.has(campo))) {
    errores.generales = "El formulario de producto tiene campos que no corresponden.";
  }

  Object.entries(validadoresPorCampo).forEach(([campo, validar]) => {
    const error = validar(datos);
    if (error) {
      errores[campo] = error;
    }
  });

  return errores;
};
