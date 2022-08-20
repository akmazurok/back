const express = require("express");
const dotenv = require("dotenv");
const { restart } = require("nodemon");
const bodyParser = require("body-parser");
const connectToDatabase = require("./src/database/config");
const usuario = require("./src/routes/usuarioRoutes");
const admin = require("./src/routes/adminRoutes");
const entidade = require("./src/routes/entidadeRoutes");
const cursos = require("./src/routes/cursoRoutes");
const estudante = require("./src/routes/estudanteRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
connectToDatabase();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", usuario);
app.use("/admin", admin);
app.use("/entidade", entidade);
app.use("/ies", cursos);
app.use("/estudante", estudante);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`API EstudanteVoluntario rodando em http://localhost:${port}`);
});
