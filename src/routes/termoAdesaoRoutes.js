const express = require("express");
const router = express.Router();
const termoAdesaoController = require("../controllers/termoAdesaoController");


router.post("/:idUserEnt/:inscricaoid", termoAdesaoController.gerarTermo);
router.get("/:idUserEst/:termoid", termoAdesaoController.visualizarTermo);


module.exports = router;