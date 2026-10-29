const MAX_FALLOS = 5;
const VENTANA_MS = 15 * 60 * 1000;

export function crearLimiteIngreso({ ahora = () => Date.now() } = {}) {
  // El estado vive en esta instancia de Node/Vercel y no se comparte entre instancias.
  const intentosPorIp = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const registro = intentosPorIp.get(ip);

    if (registro && ahora() - registro.inicio < VENTANA_MS && registro.fallos >= MAX_FALLOS) {
      res.status(429).json({ error: "Demasiados intentos. Probá de nuevo más tarde." });
      return;
    }

    res.once("finish", () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        intentosPorIp.delete(ip);
        return;
      }

      if (res.statusCode !== 401) return;

      const instante = ahora();
      const registroActual = intentosPorIp.get(ip);
      if (!registroActual || instante - registroActual.inicio >= VENTANA_MS) {
        intentosPorIp.set(ip, { fallos: 1, inicio: instante });
        return;
      }

      registroActual.fallos += 1;
    });

    next();
  };
}

const limiteIngreso = crearLimiteIngreso();

export default limiteIngreso;
