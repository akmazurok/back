const { Router } = require("express");
const express = require("express");
const router = express.Router();
const entidadeController = require("../controllers/entidadeController");

router.get("/:id", entidadeController.entidade);
router.patch("/:id", entidadeController.editarEntidade);

router.post("/:id/cadastrarvaga", entidadeController.cadastrarVaga);
router.get("/:id/vagas", entidadeController.listarVagas);
router.get("/:id/vagas-abertas", entidadeController.listarVagasAbertas);
router.get("/:id/vagas-andamento", entidadeController.listarVagasAndamento);
router.get("/:id/:vagaid", entidadeController.vaga);
router.patch("/:id/:vagaid/cancelar", entidadeController.cancelarVaga);

router.get("/:id/:vagaid/:inscritoid", entidadeController.visualizarInscrito);
router.patch("/:id/:vagaid/:inscritoid", entidadeController.aprovarInscrito);

module.exports = router;
