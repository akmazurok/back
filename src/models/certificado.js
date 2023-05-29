const mongoose = require("mongoose");

// Certificado Schema
const CertificadoSchema = new mongoose.Schema({
  nomeVaga: {
    type: String,
  },

  nomeEntidade: {
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
});

module.exports = mongoose.model("Certificado", CertificadoSchema);
