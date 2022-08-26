const { Router } = require("express");
const express = require("express");
const router = express.Router();

const entidadeController = require("../controllers/entidadeController");

router.post("/:id/cadastrarvaga", entidadeController.cadastrarVaga);
router.get("/:id/vagas", entidadeController.listarVagas);
router.get("/:id/vagas/:vagaid", entidadeController.vaga);
router.patch("/:id/vagas/:vagaid", entidadeController.editarVaga);

router.get("/:id", entidadeController.entidade);
router.patch("/:id", entidadeController.editarEntidade);

router.get("/:id/vagas/:vagaid/inscritos", entidadeController.visualizarInscritos);
router.get("/:id/vagas/:vagaid/:inscritoid", entidadeController.visualizarInscrito);
router.patch("/:id/vagas/:vagaid/:inscritoid", entidadeController.aprovarInscrito);
router.post("/:id/vagas/:vagaid/:inscritoid", entidadeController.candidatoVaga);


module.exports = router;
