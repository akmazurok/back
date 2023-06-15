const mongoose = require("mongoose");

// Certificado Schema
const CertificadoSchema = new mongoose.Schema({
  estudanteId: {
    type: mongoose.Types.ObjectId,
    ref: "Usuario",
  }, 
  
  inscricaoId: {
    type: mongoose.Types.ObjectId,
    ref: "Usuario",
  },
   
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

  codigoVerificacao:{
    type: String
  }
});

module.exports = mongoose.model("Certificado", CertificadoSchema);
