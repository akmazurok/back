const express = require("express");
const router = express.Router();
const cursoController = require("../controllers/cursoController");
const usuarioContoller = require("../controllers/usuarioController");

router.post("/", usuarioContoller.verificarToken, cursoController.cadastrarIes);
router.get("/", cursoController.listarIes);
router.get("/:iesid", usuarioContoller.verificarToken, cursoController.visualizarIes);
router.patch("/:iesid", usuarioContoller.verificarToken, cursoController.editarIes);
router.delete("/:iesid", usuarioContoller.verificarToken, cursoController.excluirIes);
router.get("/:iesid/cursos", cursoController.listarCursos);
router.post("/:iesid/cadastrarcurso", usuarioContoller.verificarToken, cursoController.cadastrarCurso);
router.delete("/curso/:cursoid", usuarioContoller.verificarToken, cursoController.excluirCurso);

module.exports = router;
