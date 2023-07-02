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
const notificacao = require("./src/routes/notificacaoRoutes");
const termo = require("./src/routes/termoAdesaoRoutes");
const certificado = require("./src/routes/certificadoRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
connectToDatabase();

app.use(cors());
app.use(bodyParser.json({limit: "10mb", extended: true}));
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 100000,limit: "10mb" }));
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/auth", usuario);
app.use("/admin", admin);
app.use("/entidade", entidade);
app.use("/ies", cursos);
app.use("/estudante", estudante);
app.use("/notificacao", notificacao);
app.use("/termo", termo);
app.use("/certificado", certificado);

app.get("/", (req, res) => {
  res.send("API Estudante Voluntário");
});

app.listen(port, () => {
  console.log(`API EstudanteVoluntario rodando em http://localhost:${port}`);
});
