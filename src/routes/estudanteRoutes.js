const express = require("express");
const router = express.Router();
const estudanteController = require("../controllers/estudanteController");
const usuarioContoller = require("../controllers/usuarioController");

router.all('*', usuarioContoller.verificarToken);

router.get("/vagas/:pagina/:id", estudanteController.listarVagas);
router.get("/detalheVaga/:vagaid", estudanteController.detalhesVaga);
router.get("/:id", estudanteController.getPerfilEstudante);
router.patch("/:id", estudanteController.setPerfilEstudante);
router.get("/:id/inscricoes", estudanteController.listarInscricoes); 
router.get("/:id/certificados", estudanteController.listarCertificados);
router.patch("/:inscricaoid/cancelar", estudanteController.cancelarInscricao);  
router.patch("/:inscricaoid/aceitar", estudanteController.aceitarTermo);
router.patch("/:inscricaoid/rescindir", estudanteController.rescindirTermo);
router.patch("/:id/:vagaid", estudanteController.inscricaoVaga);

module.exports = router;