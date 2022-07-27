const express = require("express");
const Usuario = require("../models/usuario");
const router = express.Router();

//TO-DO -

//RETORNAR TODOS OS USUARIOS
exports.listarUsuarios = async (req, res) => {
  try {
    const users = await Usuario.find();
    res.status(200).send({ users });
  } catch (error) {
    res.status(500).send({ erro: error });
  }
};

/* //RETORNA USUARIO ESPECIFICO
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
 */
