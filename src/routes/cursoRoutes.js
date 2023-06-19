const express = require("express");
const router = express.Router();

const cursoController = require("../controllers/cursoController");

router.post("/", cursoController.cadastrarIes);
router.get("/", cursoController.listarIes);
router.get("/:iesid", cursoController.visualizarIes);
router.patch("/:iesid", cursoController.editarIes);
router.delete("/:iesid", cursoController.excluirIes);
router.get("/:iesid/cursos", cursoController.listarCursos);
router.post("/:iesid/cadastrarcurso", cursoController.cadastrarCurso);
router.delete("/curso/:cursoid", cursoController.excluirCurso);

module.exports = router;
