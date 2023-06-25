const { Router } = require("express");
const express = require("express");
const router = express.Router();
const entidadeController = require("../controllers/entidadeController");

router.get("/:id", entidadeController.getPerfilEntidade);
router.patch("/:id", entidadeController.setPerfilEntidade);

router.post("/:id/cadastrarvaga", entidadeController.cadastrarVaga);
router.get("/:id/:pagina/vagas", entidadeController.listarVagas);
router.get("/:filtro/filtrarVagas", entidadeController.filtrarVagas);
router.get("/:id/:pagina/vagas-abertas", entidadeController.listarVagasAbertas);
router.get("/:id/:pagina/vagas-andamento", entidadeController.listarVagasAndamento);
router.get("/:id/:pagina/vagas-aprovacao", entidadeController.listarVagasAprovacao);
router.get("/:id/:vagas-cancelada", entidadeController.listarVagasCanceladas);
router.get("/:id/:vagaid", entidadeController.detalheVaga);
router.patch("/:id/:vagaid/cancelar", entidadeController.cancelarVaga);
router.patch("/:id/:vagaid/finalizar", entidadeController.finalizarInscricaoVaga);
router.patch("/:id/:inscricaoid/aprovar", entidadeController.aprovarInscrito);
router.patch("/:id/:inscricaoid/reprovar", entidadeController.reprovarInscrito);

router.get("/:id/:vagaid/:inscritoid", entidadeController.visualizarInscrito);


module.exports = router;
