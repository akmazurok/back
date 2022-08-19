const mongoose = require("mongoose");

// CandidatoCaga Schema
const CandidatoVaga = new mongoose.Schema({
  vaga: {
    type: mongoose.Types.ObjectId,
    ref: "Vaga",
  },

  estudante: {
    type: mongoose.Types.ObjectId,
    ref: "Estudante",
  },

  entidade: {
    type: mongoose.Types.ObjectId,
    ref: "Entidade",
  },

  statusAprovacao: {
    type: String,
  },

  frequencia: {
    type: String,
  },

  avaliacaoEstudante: {
    type: String,
  },

  avaliacaoEntidade: {
    type: String,
  },
});

module.exports = mongoose.model("CandidatoVaga", CandidatoVagaSchema);
