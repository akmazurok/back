const express = require("express");
const router = express.Router();

const adminController = require('../controllers/adminController');
const usuarioController = require('../controllers/usuarioController');

router.get("/usuarios", adminController.listarUsuarios);
router.post("/cadastro", usuarioController.cadastrar);


module.exports = router;