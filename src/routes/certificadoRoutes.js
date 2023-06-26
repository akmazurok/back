const express = require("express");
const router = express.Router();

const certificadoController = require("../controllers/certificadoController");

router.get("/", certificadoController.gerarCertificado);

module.exports = router;