const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Usuario Schema
const UsuarioSchema = new mongoose.Schema({
  login: {
    type: String,
    unique: true,
    required: true,
  },

  senha: {
    type: String,
    // select: false,
  },

  nome: {
    type: String,
  },

  perfil: {
    type: String,
    enum: ["ESTUDANTE", "ENTIDADE", "ADMINISTRADOR", "ADMINISTRADORGERAL"],
  },

  imgPerfil: {
    id: { type: mongoose.Types.ObjectId, ref: "Arquivo" },
    key: { type: String },
    url: { type: String },
  },

  dataCadastro: {
    type: Date,
    default: Date.now,
  },

  statusPerfil: {
    type: String,
    enum: ["APROVADO", "REPROVADO", "PENDENTE", "DESATIVADO"],
    default: "PENDENTE",
  },
});

// Estudante Schema
const EstudanteSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Types.ObjectId,
    ref: "Usuario",
  },

  nomeCompleto: {
    type: String,
  },

  confirmaNomeSocial: {
    type: Boolean,
  },

  nomeSocial: {
    type: String,
  },

  identificacaoGenero: {
    type: String,
  },

  estadoCivil: {
    type: String,
  },

  dataNascimento: {
    type: Date,
  },

  rg: {
    type: String,
  },

  rgEmissor: {
    type: String,
  },

  email: {
    type: String,
  },

  telefone: {
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

  areasInteresse: {
    type: String,
  },

  experienciasAnteriores: {
    type: String,
  },

  curso: {
    instituicao: { type: String },
    grau: { type: String },
    nomeCurso: { type: String },
    campus: { type: String },
    anoInicio: { type: Date },
    anoConclusao: { type: Date },
  },

  comprovanteMatricula: {
    id: { type: mongoose.Types.ObjectId, ref: "Arquivo" },
    key: { type: String },
    url: { type: String },
  },

  termoDeUso: {
    type: Boolean,
  },

  dataAprovacao: {
    type: Date,
  },

  idAdmin: {
    type: mongoose.Types.ObjectId,
    ref: "Usuario",
  },

  comentario: {
    type: String,
  },
});

// Admin Schema
const AdministradorSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Types.ObjectId,
    ref: "Usuario",
  },

  nomeCompleto: {
    type: String,
  },

  confirmaNomeSocial: {
    type: Boolean,
  },

  nomeSocial: {
    type: String,
  },

  identificacaoGenero: {
    type: String,
  },

  dataNascimento: {
    type: Date,
  },

  email: {
    type: String,
  },

  telefone: {
    type: String,
  },
});

// Entidade Schema
const EntidadeSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Types.ObjectId,
    ref: "Usuario",
  },

  razaoSocial: {
    type: String,
  },

  nomeFantasia: {
    type: String,
  },

  nomeResponsavelCadastro: {
    type: String,
  },

  email: {
    type: String,
  },

  telefone: {
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

  termoDeUso: {
    type: Boolean,
  },

  missao: {
    type: String,
  },

  perfilVoluntario: {
    type: String,
  },

  dataAprovacao: {
    type: Date,
  },

  idAdmin: {
    type: mongoose.Types.ObjectId,
    ref: "Usuario",
  },

  comentario: {
    type: String,
  },
});

//usando bcrypt para a senha
UsuarioSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.senha, 10);
  this.senha = hash;
  next();
});

var Usuario = mongoose.model("Usuario", UsuarioSchema);
var Estudante = mongoose.model("Estudante", EstudanteSchema);
var Administrador = mongoose.model("Administrador", AdministradorSchema);
var Entidade = mongoose.model("Entidade", EntidadeSchema);

module.exports = {
  Usuario: Usuario,
  Entidade: Entidade,
  Estudante: Estudante,
  Administrador: Administrador,
};
