const mongoose = require("mongoose");

// Vaga Schema
const VagaSchema = new mongoose.Schema({
  titulo: {
    type: String,
  },

  descricao: {
    type: String,
  },

  requisitos: {
    type: String,
  },

  auxilio: {
    type: String,
  },

  quantidadeVagas: {
    type: String,
  },

  dataInicio: {
    type: Date,
  },

  horaInicio: {
    type: Date,
  },

  horaFim: {
    type: Date,
  },

  cargaHoraria: {
    type: Number,
  },

  instituicao: {
    id: { type: mongoose.Types.ObjectId, ref: "Instituicao" },
    nome: { type: String },
  },

  endereco: {
    cep: { type: String },
    logradouro: { type: String },
    complemento: { type: String },
    numero: { type: String },
    bairro: { type: String },
    cidade: { type: String },
    uf: { type: String },
  },

  statusAprovacao: {
    type: String,
    enum: ["Ativa", "Pendente"],
    default: "Pendente",
  },

  statusVaga: {
    type: String,
    enum: ["Ativa", "Andamento", "Finalizada", "Pendente"],
    default: "Pendente",
  },

  dataPublicacao: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Vaga", VagaSchema);
