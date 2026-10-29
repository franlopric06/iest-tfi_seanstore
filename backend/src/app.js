import express from "express";
import helmet from "helmet";
import cors from "cors";
import rutas from "./routes/index.js";

const app = express();

app.use(helmet());

app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origen, callback) => {
      const origenFrontend = process.env.FRONTEND_URL || "http://localhost:5173";
      callback(null, origen === origenFrontend);
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);

app.use(express.json());

app.use("/api", rutas);

app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: "Algo salió mal, probá de nuevo" });
});

export default app;
