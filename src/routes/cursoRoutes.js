const express = require("express");
const router = express.Router();

const cursoController = require("../controllers/cursoController");

router.post("/ies", cursoController.cadastrarIes);
router.get("/ies", cursoController.listarIes);
router.get("/ies/:id", cursoController.buscarIes);
router.delete("/ies/:id", cursoController.excluirIes);
router.put("/ies/:id", cursoController.cadastrarCurso);
router.get("/ies/:id/cursos", cursoController.listarCursos);
router.post("/curso", cursoController.addCurso);

module.exports = router;
