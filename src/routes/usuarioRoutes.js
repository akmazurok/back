const express = require("express");
const multer = require("multer");
const router = express.Router();
const multerConfig = require("../config/multer");

const usuarioController = require("../controllers/usuarioController");
const imagemController = require("../controllers/imagemController");

router.post("/imagem", multer(multerConfig).single("file"), imagemController.uploadImagem);
router.get("/imagens", multer(multerConfig).single("file"), imagemController.imagens);

router.post("/cadastro", usuarioController.cadastrar);
router.post("/login", usuarioController.login);

router.delete("/imagem/:id", multer(multerConfig).single("file"), imagemController.excluirImagem);

router.get("/:id", usuarioController.usuario);
router.patch("/:id", usuarioController.editar);

module.exports = router;
