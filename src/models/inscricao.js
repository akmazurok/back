const mongoose = require("mongoose");

// CandidatoVaga Schema
const InscricaoSchema = new mongoose.Schema({
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
    enum: ["Aberta", "Andamento", "Finalizada"],
    default: "Aberta",
  },

  termoAdesao: {
    type: Boolean,
    default: false,
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

module.exports = mongoose.model("Inscricao", InscricaoSchema);
