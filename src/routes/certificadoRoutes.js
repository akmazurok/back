const express = require("express");
const router = express.Router();

const certificadoController = require("../controllers/certificadoController");

router.get("/gerarCertificado", certificadoController.gerarCertificado);

module.exports = router;