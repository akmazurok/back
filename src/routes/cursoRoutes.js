const express = require("express");
const router = express.Router();

const cursoController = require("../controllers/cursoController");

router.post("/", cursoController.cadastrarIes);
router.get("/", cursoController.listarIes);
//editar ies router.patch("/:iesid", cursoController.editarIes);
router.get("/:iesid", cursoController.visualizarIes);
router.delete("/:iesid", cursoController.excluirIes);
router.get("/:iesid/cursos", cursoController.listarCursos);
router.post("/:iesid/cadastrarcurso", cursoController.cadastrarCurso);
router.get("/curso/:cursoid", cursoController.visualizarCurso);
//fazer funcao router.patch("/curso/:cursoid", cursoController.editarCurso);
router.delete("/curso/:cursoid", cursoController.excluirCurso);

module.exports = router;
