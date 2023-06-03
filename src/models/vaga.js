const mongoose = require("mongoose");

// Vaga Schema
const VagaSchema = new mongoose.Schema({
  entidadeId: {
    type: mongoose.Types.ObjectId,
    ref: "Usuario",
  },

  nomeVaga: {
    type: String,
  },

  img: {
    id: { type: mongoose.Types.ObjectId, ref: "Arquivo" },
    key: { type: String },
    url: { type: String },
  },

  descricao: {
    type: String,
  },

  auxilio: {
    type: String,
  },

  requisitos: {
    type: String,
  },

  endereco: {
    cep: { type: String },
    logradouro: { type: String },
    complemento: { type: String },
    numero: { type: String },
    bairro: { type: String },
    cidade: { type: String },
    estado: { type: String },
  },

  dataAberturaVaga: {
    type: Date,
  },

  dataFinalizacaoVaga: {
    type: Date,
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

  numeroVagas: {
    type: Number,
  },

  statusVaga: {
    type: String,
    enum: ["ABERTA", "ANDAMENTO", "CANCELADA", "APROVACAO", "ENCERRADA"],
    default: "APROVACAO",
  },

  inscricoes: [
    { inscricao: { type: mongoose.Types.ObjectId, ref: "Inscricao" } },
  ],

  dataAprovacaoVaga: {
    type: Date,
  },

  dataCadastro: {
    type: Date,
    default: Date.now,
  },

  idAdmin: {
    type: mongoose.Types.ObjectId,
    ref: "Usuario",
  },
});

module.exports = mongoose.model("Vaga", VagaSchema);
