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

  telefone: {
    type: String,
  },

  cursos: [
    {
      id: { type: mongoose.Types.ObjectId, ref: "Curso" },
      grau: { type: String },
      nomeCurso: { type: String },
      campus: { type: String },
    },
  ],
});

module.exports = mongoose.model("Instituicao", IntituicaoSchema);
