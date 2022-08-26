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

  //carga horaria em minutos
  cargaHoraria: {
    type: Number,
  },

  inscritos: {
    estudante: { type: mongoose.Types.ObjectId, ref: "Estudante" },
    statusAprovacao: {
      type: String,
      enum: ["Inscrito", "Aprovado", "Recusado", "Cancelado"],
    },
    candidatoVaga: { type: mongoose.Types.ObjectId, ref: "CandidatoVaga" }
  },

  entidade: {
    id: { type: mongoose.Types.ObjectId, ref: "Entidade" },
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
    enum: ["Ativa", "Pendente", "Reprovada"],
    default: "Pendente",
  },

  statusVaga: {
    type: String,
    enum: ["Aberta", "Andamento", "Finalizada", "Pendente"],
    default: "Pendente",
  },

  dataPublicacao: {
    type: Date,
    default: Date.now,
  },

  imagem: {
    id: { type: mongoose.Types.ObjectId, ref: "Arquivo" },
    key: { type: String },
    url: { type: String },
  },
  
});

module.exports = mongoose.model("Vaga", VagaSchema);
