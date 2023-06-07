const mongoose = require("mongoose");

// Curso Schema
const CursoSchema = new mongoose.Schema({
  instituicao: {
    type: mongoose.Types.ObjectId,
    ref: "Instituicao",
  },

  grau: {
    type: String,
  },

  nomeCurso: {
    type: String,
  },
});

module.exports = mongoose.model("Curso", CursoSchema);