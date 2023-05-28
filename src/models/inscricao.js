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

  dataInscricao: {
    type: Date,
    default: Date.now,
  },

  statusInscricao: {
    type: String,
    enum: [
      "INSCRITO",
      "APROVADO",
      "ANDAMENTO",
      "REPROVADO",
      "CANCELADO",
      "ENCERRADO",
    ],
    default: "INSCRITO",
  },

  cargaHoraria: {
    type: Number,
  },

  termoAdesao: {
    type: Boolean,
    default: false,
  },

  dataInicioTrabalho: {
    type: Date,
  },
  dataFinalTrabalho: {
    type: Date,
  },

  horasDiarias: {
    type: Number,
  },

  horasTotais: {
    type: Number,
  },
});

module.exports = mongoose.model("Inscricao", InscricaoSchema);
