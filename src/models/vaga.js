const mongoose = require("mongoose");

// Vaga Schema
const VagaSchema = new mongoose.Schema({
  entidade: {
    id: { type: mongoose.Types.ObjectId, ref: "Entidade" },
    nome: { type: String },
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
    uf: { type: String },
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

  inscricoes: {
    estudante: { type: mongoose.Types.ObjectId, ref: "Estudante" },
    statusAprovacao: {
      type: String,
      enum: ["Inscrito", "Aprovado", "Recusado", "Cancelado"],
    },
    candidatoVaga: { type: mongoose.Types.ObjectId, ref: "CandidatoVaga" },
  },

  dataAprovacaoVaga: {
    type: Date,
  },
});

module.exports = mongoose.model("Vaga", VagaSchema);
