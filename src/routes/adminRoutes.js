const express = require("express");
const router = express.Router();

const adminController = require('../controllers/adminController');
const usuarioController = require('../controllers/usuarioController');

router.get("/usuarios", adminController.listarUsuarios);
router.get("/entidades", adminController.listarEntidades);
router.get("/estudantes", adminController.listarEstudantes);
router.get("/admins", adminController.listarAdmins);
router.get("/vagas", adminController.listarVagas);
router.put("/vagas/:id", adminController.aprovarVaga);
router.post("/cadastro", adminController.cadastrar);


module.exports = router;