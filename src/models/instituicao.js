const mongoose = require("mongoose");

//Instituicao Schema
const IntituicaoSchema = new mongoose.Schema({
  nome: {
    type: String,
  },
  sigla: {
    type: String,
  },

  cnpj: {
    type: String,
    unique: true,
  },

  dataRegistro: {
    type: Date,
    default: Date.now,
  },
  cursos: [
    {
      id: { type: mongoose.Types.ObjectId, ref: "Curso" },
      grauAcademico: { type: String },
      nome: { type: String },
      campus: { type: String },
    },
  ],
});

module.exports = mongoose.model("Instituicao", IntituicaoSchema);
