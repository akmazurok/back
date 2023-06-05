const express = require("express");
const router = express.Router();

const estudanteController = require("../controllers/estudanteController");

router.get("/vagas", estudanteController.listarVagas);
router.get("/vagas/:vagaid", estudanteController.detalhesVaga);   

router.get("/:id", estudanteController.getPerfilEstudante);
router.patch("/:id", estudanteController.setPerfilEstudante);

router.get("/:id/inscricoes", estudanteController.listarInscricoes);
router.get("/:id/certificados", estudanteController.listarCertificados);

router.patch("/:id/:vagaid", estudanteController.inscricaoVaga);

router.get("/:id/:inscricaoid", estudanteController.detalhesInscricao);
router.patch("/:id/:inscricaoid/cancelar", estudanteController.cancelarInscricao);
router.patch("/:id/:inscricaoid/aceitar", estudanteController.aceitarTermo);
router.patch("/:id/:inscricaoid/rescindir", estudanteController.rescindirTermo);

module.exports = router;