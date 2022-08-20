const express = require("express");
const router = express.Router();

const entidadeController = require("../controllers/entidadeController");

router.post("/:id/cadastrarvaga", entidadeController.cadastrarVaga);
router.get("/:id/vagas", entidadeController.listarVagas);
router.get("/:id/vagas/:vagaid", entidadeController.vaga);
router.patch("/:id/vagas/:vagaid", entidadeController.editarVaga);

router.get("/:id", entidadeController.entidade);
router.patch("/:id", entidadeController.editarEntidade);

module.exports = router;
