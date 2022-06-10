const express = require("express");
const router = express.Router();

//RETORNA USUARIOS
router.get("/", (req, res, next) => {
  res.status(200).send({
    message: "usando o get da rota usuarios",
  });
});

//INSERE USUARIO
router.post("/", (req, res, next) => {
  res.status(201).send({
    message: "usuario inserido",
  });
});

//RETORNA USUARIO ESPECIFICO
router.get("/:id_usuario", (req, res, next) => {
  const id = req.params.id_usuario;
  res.status(200).send({
    message: "retorna o usuario por id",
    id_usuario: id,
  });
});

//ALTERA USUARIO
router.patch("/", (req, res, next) => {
  res.status(201).send({
    message: "Usuario alterado com sucesso",
  });
});

//DELETA USUARIO
router.delete("/", (req, res, next) => {
  res.status(201).send({
    message: "usando delete",
  });
});

module.exports = router;
