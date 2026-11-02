import { screen, waitFor } from "@testing-library/react";
import { expect } from "vitest";

// Abre la lista desplegable de la etiqueta indicada y elige la opción por su texto.
export const elegirOpcion = async (usuario, etiqueta, texto, contenedor = screen) => {
  await usuario.click(contenedor.getByLabelText(etiqueta));
  await usuario.click(contenedor.getByRole("option", { name: texto }));
};

// Espera a que la lista de categorías termine de cargar (deja de estar deshabilitada).
export const esperarCategorias = (contenedor = screen) =>
  waitFor(() => expect(contenedor.getByLabelText("Categoría")).toBeEnabled());
