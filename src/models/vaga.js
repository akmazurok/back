const mongoose = require("mongoose");
const { Schema } = mongoose;

// Vaga Schema
const VagaSchema = new mongoose.Schema({

  imgVaga: {
    file: { type: String },
  },

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

  descricaoAuxilio:{
    type: String,
  },

  auxilio: {
    type: Boolean,
  },

  requisitos: {
    type: String,
  },

  utilizarEnderecoEntidade: {
    type: Boolean,
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
    type: String,
  },

  horarioInicioTrabalho: {
    type: String,
  },

  horarioEncerramentoTrabalho: {
    type: String,
  },

  numeroVagas: {
    type: Number,
  },

  statusVaga: {
    type: String,
    enum: ["ABERTA", "ANDAMENTO", "CANCELADA", "APROVACAO", "ENCERRADA"],
    default: "APROVACAO",
  },

  inscricoes: [{
    type: Schema.Types.ObjectId, ref: "Inscricao"
  }
 ],

  dataAprovacaoVaga: {
    type: Date,
  },

  dataCadastro: {
    type: Date,
    default: Date.now,
  },

  comentario: {
    type: String,
  },

  termoCondicao: {
    type: Boolean,
  },

  idAdmin: {
    type: mongoose.Types.ObjectId,
    ref: "Usuario",
  },

  inscrito: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Vaga", VagaSchema);
