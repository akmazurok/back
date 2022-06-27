const express = require("express");
const dotenv = require("dotenv");
const { restart } = require("nodemon");
const bodyParser = require("body-parser");


dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./src/controllers/usuarioController')(app);

app.listen(3000);

/* app.get("/", (req, res) => {
  res.send("ok");
});

app.listen(3000);
 */
/* //rotas
const rotaUsuarios = require("./src/routes/usuarios");

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
 */
