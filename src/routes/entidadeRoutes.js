const { Router } = require("express");
const express = require("express");
const router = express.Router();
const entidadeController = require("../controllers/entidadeController");

router.get("/:id", entidadeController.getPerfilEntidade);
router.patch("/:id", entidadeController.setPerfilEntidade);

router.post("/:id/cadastrarvaga", entidadeController.cadastrarVaga);
router.get("/:id/vagas", entidadeController.listarVagas);
router.get("/:id/vagas-abertas", entidadeController.listarVagasAbertas);
router.get("/:id/vagas-andamento", entidadeController.listarVagasAndamento);
router.get("/:id/vagas-aprovacao", entidadeController.listarVagasAprovacao);
router.get("/:id/:vagaid", entidadeController.detalheVaga);
router.patch("/:id/:vagaid/cancelar", entidadeController.cancelarVaga);
router.patch("/:id/:vagaid/finalizar", entidadeController.finalizarInscricaoVaga);
router.patch("/:id/:inscricaoid/aprovar", entidadeController.aprovarInscrito);
router.patch("/:id/:inscricaoid/reprovar", entidadeController.reprovarInscrito);

router.get("/:id/:vagaid/:inscritoid", entidadeController.visualizarInscrito);


module.exports = router;
