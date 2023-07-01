const express = require("express");
const multer = require("multer");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

router.post("/cadastro", usuarioController.cadastrar);
router.post("/login", usuarioController.login);
router.post("/verificarLogin", usuarioController.verificarLogin);
router.patch("/reativar", usuarioController.reativar);
router.post("/logout", usuarioController.verificarToken, usuarioController.logout);
router.post("/refresh", usuarioController.refreshToken);
router.post("/esqueciSenha", usuarioController.esqueciSenha);
router.patch("/:id/desativar", usuarioController.desativar);

module.exports = router;
