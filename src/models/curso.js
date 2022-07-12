  const mongoose = require("mongoose");

// Curso Schema
const CursoSchema = new mongoose.Schema({
  nome: {
    type: String,
  },

  grauAcademico: {
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
    uf: { type: String },
  },

  dataRegistro: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Curso", CursoSchema);