const express = require("express");
const router = express.Router();

const entidadeController = require("../controllers/entidadeController");

router.get("/:id/vagas", entidadeController.listarVagas);
router.post("/:id/cadastrarvaga", entidadeController.cadastrarVaga);
router.put("/:id/:vagaid", entidadeController.editarVaga);
router.get("/:id/:vagaid", entidadeController.vaga);

router.get("/:id", entidadeController.entidade);
router.put("/:id", entidadeController.editarEntidade);

module.exports = router;
