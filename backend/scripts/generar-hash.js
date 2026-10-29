import { pathToFileURL } from "node:url";
import { hashearContrasena } from "../src/utils/contrasena.js";

function leerContrasena(entrada, aviso) {
  return new Promise((resolve, reject) => {
    if (!entrada.isTTY || typeof entrada.setRawMode !== "function") {
      reject(new Error("Ejecutá este script en una terminal interactiva."));
      return;
    }

    let contrasena = "";
    const terminar = (resolver, valor) => {
      entrada.off("data", alDato);
      entrada.off("error", alError);
      entrada.setRawMode(false);
      entrada.pause();
      aviso.write("\n");
      resolver(valor);
    };
    const alError = (error) => terminar(reject, error);
    const alDato = (dato) => {
      const caracteres = Buffer.isBuffer(dato) ? dato.toString("utf8") : dato;

      for (const caracter of caracteres) {
        if (caracter === "\u0003") {
          terminar(reject, new Error("Ingreso cancelado."));
          return;
        }

        if (caracter === "\r" || caracter === "\n") {
          terminar(resolve, contrasena);
          return;
        }

        if (caracter === "\u007f" || caracter === "\b") {
          contrasena = Array.from(contrasena).slice(0, -1).join("");
          continue;
        }

        contrasena += caracter;
      }
    };

    aviso.write("Contraseña del administrador: ");
    entrada.setRawMode(true);
    entrada.setEncoding("utf8");
    entrada.on("data", alDato);
    entrada.on("error", alError);
    entrada.resume();
  });
}

export async function generarHash({
  entrada = process.stdin,
  salida = process.stdout,
  aviso = process.stderr,
} = {}) {
  const contrasena = await leerContrasena(entrada, aviso);
  const hash = await hashearContrasena(contrasena);

  salida.write(`${hash}\n`);
  return hash;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  generarHash().catch((error) => {
    process.stderr.write(`Error: ${error.message}\n`);
    process.exitCode = 1;
  });
}
