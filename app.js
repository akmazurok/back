const express = require("express");
const dotenv = require("dotenv");
const { restart } = require("nodemon");

dotenv.config();

const app = express();

//rotas
const rotaUsuarios = require("./routes/usuarios");

app.use("/usuarios", rotaUsuarios);

//Tratamento de erro - rota não encontrada
app.use((req, res, next) => {
  const err = new Error("Não encontrado");
  err.status = 404;
  next(err);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    erro: {
      message: error.message,
    },
  });
});

module.exports = app;
