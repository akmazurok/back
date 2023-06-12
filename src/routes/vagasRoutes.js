const express = require("express");
const router = express.Router();

const vagasController = require("../controllers/vagasController");

router.post("/cadastrarVaga", vagasController.cadastrarVaga);

module.exports = router;