const CLAVE_SESION = "seanstore_admin_token";
const EVENTO_SESION = "sesion-cambiada";

export function guardarSesion(token) {
  try {
    sessionStorage.setItem(CLAVE_SESION, token);
  } catch {
    return false;
  }

  window.dispatchEvent(new Event(EVENTO_SESION));
  return true;
}

export function obtenerSesion() {
  let token;
  try {
    token = sessionStorage.getItem(CLAVE_SESION);
  } catch {
    return null;
  }

  if (!token) return null;

  try {
    const segmento = token.split(".")[1];
    if (!segmento) return token;

    const base64 = segmento.replace(/-/g, "+").replace(/_/g, "/");
    const cargaCodificada = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const bytes = Uint8Array.from(atob(cargaCodificada), (caracter) => caracter.charCodeAt(0));
    const carga = JSON.parse(new TextDecoder().decode(bytes));

    if (typeof carga.exp === "number" && Date.now() >= carga.exp * 1000) {
      borrarSesion();
      return null;
    }
  } catch {
    return token;
  }

  return token;
}

export function borrarSesion() {
  try {
    sessionStorage.removeItem(CLAVE_SESION);
  } catch {
    return false;
  }

  window.dispatchEvent(new Event(EVENTO_SESION));
  return true;
}
