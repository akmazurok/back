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
    type: Number,
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

  entidade: {
    id: { type: mongoose.Types.ObjectId, ref: "Usuario" },
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

  //imagem
});

module.exports = mongoose.model("Vaga", VagaSchema);
