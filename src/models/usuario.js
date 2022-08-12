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

  acesso: {
    type: String,
    enum: ["Administrador", "Estudante", "Entidade"],
  },

  dataRegistro: {
    type: Date,
    default: Date.now,
  },
});

// Estudante Schema
const EstudanteSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Types.ObjectId,
    ref: "Usuario",
  },

  telefone: {
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

  situacaoCadastro: {
    type: String,
    enum: ["Ativo", "Pendente"],
    default: "Pendente",
  },

  //fotoPerfil: Object,
  
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

  curso: {
    nome: { type: String },
    instituicao: { type: String },
  },

  areasInteresse: {
    type: String,
  },

  experienciasAnteriores: {
    type: String,
  },
});

// Admin Schema
const AdminSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Types.ObjectId,
    ref: "Usuario",
  },

 nome: {
    type: String,
  },

  nomeSocial: {
    type: String,
  },

dataNascimento: {
    type: Date,
  },

 });

// Entidade Schema
const EntidadeSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Types.ObjectId,
    ref: "Usuario",
  },

  telefone: {
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

  situacaoCadastro: {
    type: String,
    enum: ["Ativo", "Pendente"],
    default: "Pendente",
  },

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
  //fotoPerfil: Object,  
});

//usando bcrypt para a senha
UsuarioSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.senha, 10);
  this.senha = hash;
  next();
});

var Usuario = mongoose.model("Usuario", UsuarioSchema);
var Estudante = mongoose.model("Estudante", EstudanteSchema);
var Admin = mongoose.model("Admin", AdminSchema);
var Entidade = mongoose.model("Entidade", EntidadeSchema);

module.exports = {
  Usuario: Usuario,
  Entidade: Entidade,
  Estudante: Estudante,
  Admin: Admin,
};
