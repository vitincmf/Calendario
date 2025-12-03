const express = require("express");
const bodyParser = require("body-parser");
const { connection } = require("./models");

const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");

const app = express();

app.use(bodyParser.json());

// Rotas
app.use("/autent", authRoutes);
app.use("/eventos", eventRoutes);

// Conectar no banco
connection
  .sync()
  .then(() => console.log("Banco sincronizado"))
  .catch((err) => console.error("Erro ao sincronizar banco:", err));

// Iniciar servidor
app.listen(3000, () => console.log("Servidor rodando na porta 3000"));