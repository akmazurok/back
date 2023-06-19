const mongoose = require("mongoose");

// Inscrição Schema
const InscricaoSchema = new mongoose.Schema({
  vagaId: {
    type: mongoose.Types.ObjectId,
    ref: "Vaga",
  },

  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Usuario",
  },

  //passar referencia da coleção estudante pra poder pegar os dados de curso
  estudanteId: {
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

  termoAdesao: {
    type: Boolean,
    default: false,
  },

  dataInicioTrabalho: {
    type: Date,
  },

  dataEncerramentoTrabalho: {
    type: Date,
  },

  diasTrabalho: [{ type: String }],

  horarioInicioTrabalho: {
    type: Date,
  },

  horarioEncerramentoTrabalho: {
    type: Date,
  },

  diasTrabalho: [{ type: String }],

  termoAdesaoId: {
    type: mongoose.Types.ObjectId,
    ref: "TermoAdesao",
  },
});

module.exports = mongoose.model("Inscricao", InscricaoSchema);
