const mongoose = require("mongoose");

// CandidatoCaga Schema
const CandidatoVaga = new mongoose.Schema({
  vaga: {
    type: mongoose.Types.ObjectId,
    ref: "Vaga",
  },

  entidade: {
    type: mongoose.Types.ObjectId,
    ref: "Entidade",
  },

  estudante: {
    type: mongoose.Types.ObjectId,
    ref: "Estudante",
  },

  statusVaga: {
    type: String,
    enum: ["Aberta", "Andamento", "Finalizada", "Pendente"],
    default: "Pendente",
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
