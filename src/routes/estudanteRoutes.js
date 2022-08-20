const express = require("express");
const router = express.Router();

const estudanteController = require("../controllers/estudanteController");

router.get("/vagas", estudanteController.listarVagas);

router.get("/:id", estudanteController.estudante);
router.patch("/:id", estudanteController.editarEstudante);

router.get("/vagas/:vagaid", estudanteController.detalhesVaga);
router.patch("/:id/:vagaid", estudanteController.inscricaoVaga);
router.patch("/:id/:vagaid/cancelar", estudanteController.cancelarInscricao);

module.exports = router;