const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//TO-DO - schema para armazenar imagens

// Usuario Schema
const UsuarioSchema = new mongoose.Schema({
  documento: {
    type: String,
//    unique: true,
//    required: true,
  },

  email: {
    type: String,
//    unique: true,
//    required: true,
  },

  senha: {
    type: String,
//    required: true,
//    select: false,
  },

  telefone: {
//    type: String,
//    required: true,
  },

  acesso: {
    type: String,
    enum: ["Administrador", "Estudante", "Entidade"],
  },

  situacaoCadastro: {
    type: String,
    enum: ["Ativo", "Pendente"],
    default: "Pendente",
  },

  //fotoPerfil: Object,

  endereco: {
    cep: { type: String },
    logradouro: { type: String },
    complemento: { type: String },
    numero: { type: String },
    bairro: { type: String },
    cidade: { type: String },
    uf: { type: String },
  },

  dataRegistro: {
    type: Date,
    default: Date.now,
  },

  //ADMIN E ESTUDANTE
  nome: {
    type: String,
  },

  nomeSocial: {
    type: String,
  },

  dataNascimento: {
    type: Date,
  },

  genero: {
    type: String,
  },

  //ESTUDANTE
  areasInteresse: {
    type: String,
  },

  experienciasAnteriores: {
    type: String,
  },

  //ENTIDADE
  razaoSocial: {
    type: String,
  },

  nomeFantasia: {
    type: String,
  },

  nomeResponsavel: {
    type: String,
  },

  cpfResponsavel: {
    type: String,
  },
});

//usando bcrypt para a senha
UsuarioSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.senha, 10);
  this.senha = hash;
  next();
});


module.exports = mongoose.model("Usuario", UsuarioSchema);
