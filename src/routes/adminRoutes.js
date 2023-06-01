const express = require("express");
const router = express.Router();

const adminController = require('../controllers/adminController');

router.get("/entidades", adminController.listarEntidades);
router.get("/estudantes", adminController.listarEstudantes);
router.get("/admins", adminController.listarAdmins);
router.get("/vagas", adminController.listarVagas);
router.post("/cadastro", adminController.cadastrar);

router.get("/:id", adminController.admin);
router.patch("/:id", adminController.editar);
router.delete("/:id", adminController.excluir);


router.get("/vagas/:vagaid", adminController.detalhesVaga);
router.patch("/vagas/:vagaid", adminController.aprovarVaga);

router.get("/entidades/:entid", adminController.entidade);
router.patch("/entidades/:entid", adminController.aprovarEntidade);
router.get("/estudantes/:estid", adminController.estudante);
router.patch("/estudantes/:estid", adminController.aprovarEstudante);

module.exports = router;