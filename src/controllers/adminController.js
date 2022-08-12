const Usuario = require("../models/usuario").Usuario;
const Entidade = require("../models/usuario").Entidade;
const Estudante = require("../models/usuario").Estudante;
const Admin = require("../models/usuario").Admin;
const Vaga = require("../models/vaga");

//TO-DO - /deletar entidade  /arrumar exclusao

//RETORNAR TODAS AS VAGAS - OK
exports.listarVagas = async (req, res) => {
  try {
    const vagas = await Vaga.find().sort("-statusAprovacao");
    res.status(200).send({ vagas });
  } catch (error) {
    res.status(500).send({ message: "Vagas não localizadas" + error });
  }
};

//APROVAR VAGA - OK
exports.aprovarVaga = async (req, res) => {
  const vaga = req.body;
  try {
    await Vaga.updateOne({ _id: req.params.id }, vaga);
    return res
      .status(200)
      .send({ message: "Status da vaga: " + vaga.statusAprovacao });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

//RETORNAR TODOS OS USUARIOS - OK
exports.listarUsuarios = async (req, res) => {
  try {
    //retornar sem a senha
    const usuarios = await Usuario.find({}, { senha: 0 });
    res.status(200).send({ usuarios });
  } catch (error) {
    res.status(500).send({ message: "Usuários não localizados" + error });
  }
};

//RETORNAR TODOS AS ENTIDADES - OK
exports.listarEntidades = async (req, res) => {
  try {
    //ordena por cadastro pe1ndente
    const entidades = await Entidade.find({}, { senha: 0 }).sort(
      "-situacaoCadastro"
    );
    res.status(200).send({ entidades });
  } catch (error) {
    res.status(500).send({ message: "Entidades não localizadas" + error });
  }
};

//RETORNAR TODOS OS ESTUDANTES - OK
exports.listarEstudantes = async (req, res) => {
  try {
    const estudantes = await Estudante.find({}, { senha: 0 }).sort(
      "-situacaoCadastro"
    );
    res.status(200).send({ estudantes });
  } catch (error) {
    res.status(500).send({ message: "Estudantes não localizados" + error });
  }
};

//RETORNAR TODOS OS ADMINS - OK
exports.listarAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, { senha: 0 });
    res.status(200).send({ admins });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Administradores não localizados" + error });
  }
};

//CADASTRAR ADMIN - OK
exports.cadastrar = async (req, res) => {
  //Confere se o cpf ou cnpj ja esta cadastrado
  const { documento, email, senha, acesso } = req.body;

  try {
    //  if (await Usuario.findOne({ documento }))
    //    return res.status(400).send({ error: "Documento já cadastrado" });
    const usuario = await Usuario.create({ documento, email, senha, acesso });
    usuario.senha = undefined;
    const userid = usuario.id;

    const cadastro = new Admin(req.body);
    cadastro.userid = userid;
    await cadastro.save();

    return res.status(201).send({ usuario, cadastro });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Erro ao realizar o cadastro " + error });
  }
};

//ADMIN POR ID - OK
exports.admin = async (req, res) => {
  try {
    //Retorna o usuario sem a informacao da senha
    const admin = await Admin.findOne({ _id: req.params.id });
    res.status(200).send({ admin });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//EDITAR ADMIN - OK
exports.editar = async (req, res) => {
  const admin = req.body;
  try {
    await Admin.updateOne({ _id: req.params.id }, admin);
    return res.status(200).send({ message: "Perfil alterado com sucesso!" });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

//EXCLUIR ADMIN
exports.excluir = async (req, res) => {
  try {
    await Admin.findByIdAndRemove({ _id: req.params.id });
    res.status(200).send({ message: "Cadastro excluído com sucesso." });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível excluir o Administrador " + error });
  }
};

//VER DETALHES ENTIDADE - OK
exports.entidade = async (req, res) => {
  try {
    //Retorna o usuario sem a informacao da senha
    const entidade = await Entidade.findOne({ _id: req.params.id });
    res.status(200).send({ entidade });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//APROVAR ENTIDADE - OK
exports.aprovarEntidade = async (req, res) => {
  const entidade = req.body;
  try {
    await Entidade.updateOne({ _id: req.params.id }, entidade);
    return res
      .status(200)
      .send({ message: "Status do cadastro: " + entidade. situacaoCadastro });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

//VER DETALHES ESTUDANTE - OK
exports.estudante = async (req, res) => {
  try {
    //Retorna o usuario sem a informacao da senha
    const estudante = await Estudante.findOne({ _id: req.params.id });
    res.status(200).send({ estudante });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//APROVAR ESTUDANTE - OK
exports.aprovarEstudante = async (req, res) => {
  const estudante = req.body;
  try {
    await Estudante.updateOne({ _id: req.params.id }, estudante);
    return res
      .status(200)
      .send({ message: "Status do cadastro: " + estudante. situacaoCadastro });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};