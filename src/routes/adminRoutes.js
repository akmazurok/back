const express = require("express");
const router = express.Router();

const adminController = require('../controllers/adminController');

router.get("/usuarios", adminController.listarUsuarios);		
router.get("/entidades", adminController.listarEntidades);
router.get("/estudantes", adminController.listarEstudantes);
router.get("/admins", adminController.listarAdmins);

router.get("/vagas", adminController.listarVagas);
router.patch("/vagas/:id", adminController.aprovarVaga);

router.post("/cadastro", adminController.cadastrar);
router.get("/:id", adminController.admin);
router.patch("/:id", adminController.editar);
router.delete("/:id", adminController.excluir);

router.get("/entidades/:id", adminController.entidade);
router.patch("/entidades/:id", adminController.aprovarEntidade);
router.get("/estudantes/:id", adminController.estudante);
router.patch("/estudantes/:id", adminController.aprovarEstudante);

module.exports = router;