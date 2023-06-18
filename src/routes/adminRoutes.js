const express = require("express");
const router = express.Router();

const adminController = require('../controllers/adminController');
//const { verificarToken } = require("../controllers/usuarioController");

//TESTAR
//router.all('*', verificarToken);

router.get("/entidades", adminController.listarEntidades);
router.get("/estudantes", adminController.listarEstudantes);
router.get("/admins", adminController.listarAdmins);
router.get("/vagas", adminController.listarVagas);
router.post("/cadastro", adminController.cadastrarAdmin );

//rotas de alteração pelo própio usuário admin
router.get("/:id", adminController.getPerfilAdmin);
router.patch("/:id", adminController.setPerfilAdmin);

//rotas para de gerenciamento de administradores
//router.get("/:adminid", adminController.visualizarAdmin);
//router.patch("/:adminid", adminController.editarAdmin);
//router.delete("/:adminid", adminController.excluirAdmin);
router.patch("/:adminid/rebaixar", adminController.rebaixarAdmin);
router.patch("/:adminid/promover", adminController.promoverAdmin);


router.get("/vagas/:vagaid", adminController.detalhesVaga);
router.patch("/vagas/:vagaid/:id", adminController.validarVaga);
router.get("/entidades/:entid", adminController.entidade);  
router.patch("/entidades/:entid/:id", adminController.validarEntidade);
router.get("/estudantes/:estid", adminController.estudante);
router.patch("/estudantes/:estid/:id", adminController.validarEstudante);

module.exports = router;