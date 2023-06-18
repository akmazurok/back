const mongoose = require("mongoose");

// Termo Adesão Schema
const TermoAdesaoSchema = new mongoose.Schema({
  idEstudante: {
    type: mongoose.Types.ObjectId,
    ref: "Estudante",
  },

  idEntidade: {
    type: mongoose.Types.ObjectId,
    ref: "Entidade",
  },

  idVaga: {
    type: mongoose.Types.ObjectId,
    ref: "Vaga",
  },

  idInscricao: {
    type: mongoose.Types.ObjectId,
    ref: "Inscricao",
  },

  aceiteTermo: {
    type: Date,
  },

  rescisaoTermo: {
    type: Date,
  },
});

module.exports = mongoose.model("TermoAdesao", TermoAdesaoSchema);
