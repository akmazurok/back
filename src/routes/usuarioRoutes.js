const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");

router.post("/cadastro", usuarioController.cadastrar);
//router.post("/cadastroent", usuarioController.cadastrarent);
router.get("/:id", usuarioController.usuario);
router.post("/login", usuarioController.login);
router.put("/:id", usuarioController.editar);

module.exports = router;