const dotenv = require("dotenv");

const express = require("express");
const cors = require("cors");
const { restart } = require("nodemon");
const bodyParser = require("body-parser");
const connectToDatabase = require("./src/database/config");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
const path = require("path");
const usuario = require("./src/routes/usuarioRoutes");
const admin = require("./src/routes/adminRoutes");
const entidade = require("./src/routes/entidadeRoutes");
const cursos = require("./src/routes/cursoRoutes");
const estudante = require("./src/routes/estudanteRoutes")
const vagas = require("./src/routes/vagasRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
connectToDatabase();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/files", express.static(__dirname + "/tmp/uploads")
);

app.use("/auth", usuario);
app.use("/admin", admin);
app.use("/entidade", entidade);
app.use("/ies", cursos);
app.use("/estudante", estudante);
app.use("/vagas", vagas);

app.get("/", (req, res) => {
  res.send("API Estudante Voluntário");
});

app.listen(port, () => {
  console.log(`API EstudanteVoluntario rodando em http://localhost:${port}`);
});
