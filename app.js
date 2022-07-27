const express = require("express");
const dotenv = require("dotenv");
const { restart } = require("nodemon");
const bodyParser = require("body-parser");
const connectToDatabase = require("./src/database/config");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
connectToDatabase();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const usuario = require("./src/routes/usuarioRoutes");
const admin = require("./src/routes/adminRoutes");
const cursos = require("./src/routes/cursoRoutes");

app.use("/auth", usuario);
app.use("/admin", admin);
app.use("/curso", cursos);


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
