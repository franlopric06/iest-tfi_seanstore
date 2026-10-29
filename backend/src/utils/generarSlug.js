const LIMITE_SLUG = 140;

export const generarSlug = (nombre, slugsExistentes = []) => {
  const base = String(nombre ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, LIMITE_SLUG);

  if (!slugsExistentes.includes(base)) {
    return base;
  }

  let numero = 2;
  while (slugsExistentes.includes(`${base}-${numero}`)) {
    numero += 1;
  }

  return `${base}-${numero}`;
};
