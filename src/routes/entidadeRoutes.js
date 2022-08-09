const express = require("express");
const router = express.Router();

const entidadeController = require("../controllers/entidadeController");

router.get("/:id/vagas", entidadeController.listarVagas);
router.post("/:id/cadastrarvaga", entidadeController.cadastrarVaga);


module.exports = router;
