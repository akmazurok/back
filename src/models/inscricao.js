const mongoose = require("mongoose");

// Inscrição Schema
const InscricaoSchema = new mongoose.Schema({
  vagaId: {
    type: mongoose.Types.ObjectId,
    ref: "Vaga",
  },
 
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
  
  dataEncerramentoTrabalho: {
    type: Date,
  },
  
  horarioInicioTrabalho: {
    type: Date,
  },
  
  horarioEncerramentoTrabalho: {
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
