const normalizarLetras = (nombre) =>
  String(nombre ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

export const prefijoDeNombre = (nombre) => {
  const letras = [];
  let anterior = null;

  for (const letra of normalizarLetras(nombre)) {
    if (letra !== anterior) {
      letras.push(letra);
      anterior = letra;
      if (letras.length === 3) break;
    }
  }

  return (letras.length > 0 ? letras.join("") : "pro").toUpperCase();
};

export const generarCodigo = (nombre, codigosExistentes = []) => {
  const prefijo = prefijoDeNombre(nombre);
  const patron = new RegExp(`^${prefijo}-(\\d+)$`);

  const numerosUsados = new Set();
  codigosExistentes.forEach((codigo) => {
    const coincidencia = patron.exec(String(codigo));
    if (coincidencia) {
      numerosUsados.add(Number(coincidencia[1]));
    }
  });

  let numero = 0;
  numerosUsados.forEach((usado) => {
    if (usado > numero) {
      numero = usado;
    }
  });
  numero += 1;

  return `${prefijo}-${String(numero).padStart(3, "0")}`;
};
