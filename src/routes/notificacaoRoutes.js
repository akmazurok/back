const express = require("express");
const router = express.Router();

const notificacaoController = require("../controllers/notificacaoController");

router.post("/", notificacaoController.gerarNotificacao);

router.get("/:idUsuario", notificacaoController.listarNotificacoes);
router.delete("/:id", notificacaoController.excluirNotificacao);


module.exports = router;