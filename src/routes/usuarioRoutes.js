const express = require("express");
const multer = require("multer");
const router = express.Router();
const multerConfig = require("../config/multer");
const usuarioController = require("../controllers/usuarioController");
const uploadController = require("../controllers/uploadController");

router.post("/cadastro", usuarioController.cadastrar);
router.post("/login", usuarioController.login);

//upload de imagens e arquivos
router.post("/upload", multer(multerConfig).single("file"), uploadController.uploadArquivo);
router.get("/uploads", multer(multerConfig).single("file"), uploadController.arquivos);
router.delete("/upload/:id", multer(multerConfig).single("file"), uploadController.excluirArquivo);

router.patch("/:id/desativar", usuarioController.desativar);

module.exports = router;
