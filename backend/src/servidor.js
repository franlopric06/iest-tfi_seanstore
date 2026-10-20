import "dotenv/config";
import app from "./app.js";

const puerto = process.env.PORT || 3000;

app.listen(puerto, () => {
  console.log(`API de Sean's Store escuchando en http://localhost:${puerto}`);
});
