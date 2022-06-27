const express = require("express");
const Usuario = require("../models/usuario");
const connectToDatabase = require("../database/config");

const router = express.Router();

router.post("/cadastro", async (req, res) => {
  const { documento } = req.body;

  try {
    connectToDatabase();

    if (await Usuario.findOne({ documento }))
      return res.status(400).send({ error: "Documento já cadastrado" });

    const usuario = await Usuario.create(req.body);
    usuario.senha = undefined;

    return res.send({ usuario });
  } catch (error) {
    return res.status(400).send({ error: "Erro ao realizar o cadastro" });
  }
});

module.exports = (app) => app.use("/auth", router);
