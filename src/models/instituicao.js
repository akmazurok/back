const mongoose = require("mongoose");

//Instituicao Schema
const IntituicaoSchema = new mongoose.Schema({
  nome: {
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
      nome: { type: String },
    },
  ],
});

module.exports = mongoose.model("Instituicao", IntituicaoSchema);
