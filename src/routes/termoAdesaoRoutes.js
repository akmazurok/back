const express = require("express");
const router = express.Router();
const termoAdesaoController = require("../controllers/termoAdesaoController");
const usuarioContoller = require("../controllers/usuarioController");

router.all('*', usuarioContoller.verificarToken);

router.post("/:idUserEnt/:inscricaoid", termoAdesaoController.gerarTermo);
router.get("/:idUserEst/:termoid", termoAdesaoController.visualizarTermo);
router.patch("/:idUserEst/:termoid/aceitar", termoAdesaoController.aceitarTermo);
router.patch("/:idUserEst/:termoid/rescindir", termoAdesaoController.rescindirTermo);

module.exports = router;