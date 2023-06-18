const mongoose = require("mongoose");

//Instituicao Schema
const IntituicaoSchema = new mongoose.Schema({
  cnpj: {
    type: String,
    unique: true,
  },

  nome: {
    type: String,
  },

  sigla: {
    type: String,
  },

  endereco: {
    cep: { type: String },
    logradouro: { type: String },
    numero: { type: String },
    bairro: { type: String },
    complemento: { type: String },
    cidade: { type: String },
    estado: { type: String },
  },

  email: {
    type: String,
  },

  telefone: {
    type: String,
  },
 
});

module.exports = mongoose.model("Instituicao", IntituicaoSchema);
