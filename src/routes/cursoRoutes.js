const express = require("express");
const router = express.Router();

const cursoController = require("../controllers/cursoController");

router.post("/", cursoController.cadastrarIes);
router.get("/", cursoController.listarIes);
router.get("/:id", cursoController.buscarIes);
router.delete("/:id", cursoController.excluirIes);
//router.put("/ies/:id", cursoController.cadastrarCurso);
router.get("/:id/cursos", cursoController.listarCursos);
router.post("/:id/cadastrarcurso", cursoController.addCurso);
router.get("/curso/:id", cursoController.buscarCurso);
router.delete("curso/:id", cursoController.excluirCurso);

module.exports = router;
