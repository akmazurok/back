const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Usuario Schema
const UsuarioSchema = new mongoose.Schema({
  documento: {
    type: String,
    unique: true,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  senha: {
    type: String,
    required: true,
    select: false,
  },

  telefone: {
    type: String,
    required: true,
  },

  /*   fotoPerfil: Object,

  situacaoCadastro: {
    type: String,
    required: true,
    enum: ["Ativo", "Pendente"],
    default: "Pendente",
  },

  observacaoUsuario: String,

  endereco: {
    cep: String,
    logradouro: String,
    complemento: String,
    numero: String,
    bairro: String,
    cidade: String,
    uf: String,
  },

  dataRegistro: {
    type: Date,
    default: Date.now,
  },
 */
});

//usando bcrypt para a senha
UsuarioSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.senha, 10);
  this.senha = hash;
  next();
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
