import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import ListaDesplegable from "../src/components/comunes/ListaDesplegable.jsx";

const opciones = [
  { valor: "todos", texto: "Todos" },
  { valor: "activos", texto: "Solo activos" },
  { valor: "ocultos", texto: "Solo ocultos" },
];

const Prueba = ({ alCambiar = () => {}, inicial = "todos", textoVacio }) => {
  const [valor, setValor] = useState(inicial);
  return (
    <>
      <label htmlFor="estado">Estado</label>
      <ListaDesplegable
        id="estado"
        opciones={opciones}
        valor={valor}
        textoVacio={textoVacio}
        alCambiar={(nuevo) => {
          setValor(nuevo);
          alCambiar(nuevo);
        }}
      />
      <p>afuera</p>
    </>
  );
};

afterEach(cleanup);

describe("ListaDesplegable", () => {
  it("se anuncia como combobox con su etiqueta y muestra la opción elegida", () => {
    render(<Prueba />);

    const lista = screen.getByRole("combobox", { name: "Estado" });
    expect(lista).toHaveTextContent("Todos");
    expect(lista).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("muestra el texto vacío si no hay nada elegido", () => {
    render(<Prueba inicial="" textoVacio="Elegí un estado" />);

    expect(screen.getByRole("combobox")).toHaveTextContent("Elegí un estado");
  });

  it("se abre con un clic, marca la elegida y elige otra", async () => {
    const alCambiar = vi.fn();
    const usuario = userEvent.setup();
    render(<Prueba alCambiar={alCambiar} />);

    await usuario.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "Todos" })).toHaveAttribute("aria-selected", "true");
    await usuario.click(screen.getByRole("option", { name: "Solo ocultos" }));

    expect(alCambiar).toHaveBeenCalledWith("ocultos");
    expect(screen.getByRole("combobox")).toHaveTextContent("Solo ocultos");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("se maneja con el teclado: flechas para moverse, Enter para elegir", async () => {
    const alCambiar = vi.fn();
    const usuario = userEvent.setup();
    render(<Prueba alCambiar={alCambiar} />);

    screen.getByRole("combobox").focus();
    await usuario.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await usuario.keyboard("{ArrowDown}{ArrowDown}");
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: "Solo ocultos" }).id,
    );
    await usuario.keyboard("{Enter}");

    expect(alCambiar).toHaveBeenCalledWith("ocultos");
    expect(screen.getByRole("combobox")).toHaveFocus();
  });

  it("se cierra con Escape y al tocar afuera sin cambiar el valor", async () => {
    const alCambiar = vi.fn();
    const usuario = userEvent.setup();
    render(<Prueba alCambiar={alCambiar} />);

    await usuario.click(screen.getByRole("combobox"));
    await usuario.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await usuario.click(screen.getByRole("combobox"));
    await usuario.click(screen.getByText("afuera"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(alCambiar).not.toHaveBeenCalled();
  });
});
