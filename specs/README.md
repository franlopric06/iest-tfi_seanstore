# Specs

Una carpeta por funcionalidad, con los archivos de cada fase del ciclo SDD:

| Archivo | Fase | Comando |
| --- | --- | --- |
| `spec.md` | 1 · Spec (notación EARS) | `/spec` |
| `clarificacion.md` | 2 · Clarificación | `/clarificar` |
| `plan.md` | 3 · Plan | `/plan` |
| `tasks.md` | 4 · Tareas | `/tareas` |
| `verificacion.md` | 6 · Validación | `/verificar` |

La fase 5 (implementación) queda en el código, los tests y los commits; la fase 7 (cambio), en el "Historial de cambios" de cada `spec.md`.

Funcionalidades de la versión 1:

- `001-catalogo/`: inicio, catálogo y detalle (RF01, RF02, RF04)
- `002-pedido-whatsapp/`: pedido por WhatsApp y botón flotante (RF07, RF24)
- `003-asistente/`: asistente de preguntas frecuentes (RF25)
