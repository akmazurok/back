const express = require("express");
const router = express.Router();
const certificadoController = require("../controllers/certificadoController");
const usuarioContoller = require("../controllers/usuarioController");

router.get("/:id/:idCertificado/gerarCertificado", certificadoController.gerarCertificado);
router.get("/:id/listarCertificado", usuarioContoller.verificarToken, certificadoController.listarCertificados);
router.get("/:codigo/validarCertificado", certificadoController.validarCertificado);

module.exports = router;