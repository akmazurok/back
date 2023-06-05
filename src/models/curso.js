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

  campus: {
    type: String,
  },

  endereco: {
    cep: { type: String },
    logradouro: { type: String },
    complemento: { type: String },
    numero: { type: String },
    bairro: { type: String },
    cidade: { type: String },
    estado: { type: String },
  },
});

module.exports = mongoose.model("Curso", CursoSchema);
