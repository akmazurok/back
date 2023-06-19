const mongoose = require("mongoose");

// Certificado Schema
const CertificadoSchema = new mongoose.Schema({
  idEstudante: {
    type: mongoose.Types.ObjectId,
    ref: "Usuario",
  },

  idInscricao: {
    type: mongoose.Types.ObjectId,
    ref: "Inscricao",
  },

  nomeVaga: {
    type: String,
  },

  nomeEstudante: {
    type: String,
  },  

  dataInicio: {
    type: Date,
  },

  dataFim: {
    type: Date,
  },

  cargaHoraria: {
    type: Number,
  },

  codigoVerificacao: {
    type: String,
  },
});

module.exports = mongoose.model("Certificado", CertificadoSchema);
