const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");

router.post("/cadastro", usuarioController.cadastrar);
router.get("/", usuarioController.usuario);

module.exports = router;
