const Usuario = require("../models/usuario").Usuario;
const Entidade = require("../models/usuario").Entidade;
const Estudante = require("../models/usuario").Estudante;
const Administrador = require("../models/usuario").Administrador;
const Vaga = require("../models/vaga");

//TO-DO - /colocar id do admin nas aprovações e a data da aprovação

//RETORNAR TODAS AS VAGAS PARA APROVACAO
exports.listarVagas = async (req, res) => {
  try {
    const vagas = await Vaga.find({ statusVaga: "APROVACAO" }).sort({
      dataCadastro: 1,
    });
    res.status(200).send({ vagas });
  } catch (error) {
    res
      .status(404)
      .send({ message: "Não foram encontradas vagas para aprovação" + error });
  }
};

//RETORNAR VAGA POR ID
exports.detalhesVaga = async (req, res) => {
  try {
    const vaga = await Vaga.find({ _id: req.params.vagaid });
    res.status(200).send({ vaga });
  } catch (error) {
    res.status(404).send({ message: "Vaga não localizada" + error });
  }
};

//APROVAR VAGA
exports.aprovarVaga = async (req, res) => {
  var statusVaga = req.body;  
  try {
    await Vaga.updateOne({ _id: req.params.vagaid }, statusVaga);
    return res.status(200).send({ message: "Vaga aprovada com sucesso!" })
  } catch (error) {
    return res.status(500).send({ message: "Erro ao atualizar" + error });
  }
};

//RETORNAR TODOS AS ENTIDADES PARA APROVAçÃO
exports.listarEntidades = async (req, res) => {
  try {
    const entidades = await Entidade.find(
      { statusCadastro: "PENDENTE" },
      { senha: 0 }
    ).sort({ dataCadastro: 1 });
    res.status(200).send({ entidades });
  } catch (error) {
    res.status(404).send({
      message: "Não foram encontradas Entidades para aprovação" + error,
    });
  }
};

//RETORNAR TODOS OS ESTUDANTES PARA APROVAÇÃO
exports.listarEstudantes = async (req, res) => {
  try {
    const estudantes = await Estudante.find(
      { statusCadastro: "PENDENTE" },
      { senha: 0 }
    ).sort({ dataCadastro: 1 });
    res.status(200).send({ estudantes });
  } catch (error) {
    res.status(404).send({
      message: "Não foram encontrados Estudantes para aprovação" + error,
    });
  }
};

//RETORNAR TODOS OS ADMINS
exports.listarAdmins = async (req, res) => {
  try {
    const admins = await Administrador.find({}, { senha: 0 });
    res.status(200).send({ admins });
  } catch (error) {
    res
      .status(404)
      .send({ message: "Administradores não localizados" + error });
  }
};

//CADASTRAR ADMIN
exports.cadastrar = async (req, res) => {
  //Confere se o cpf ou cnpj ja esta cadastrado
  const { login, senha, perfil } = req.body;

  try {
    if (await Usuario.findOne({ login }))
      return res.status(400).send({ error: "CFP já cadastrado" });
    const usuario = await Usuario.create({ login, senha, perfil });
    usuario.senha = undefined;
    const userid = usuario.id;

    const cadastro = new Administrador(req.body);
    cadastro.userid = userid;
    await cadastro.save();

    return res.status(201).send({ usuario, cadastro });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar o cadastro " + error });
  }
};

//ADMIN POR ID
exports.admin = async (req, res) => {
  try {
    //Retorna o usuario sem a informacao da senha
    const admin = await Administrador.findOne({ _id: req.params.id });
    res.status(200).send({ admin });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//EDITAR ADMIN
exports.editar = async (req, res) => {
  const admin = req.body;
  try {
    await Administrador.updateOne({ _id: req.params.id }, admin);
    return res.status(200).send({ message: "Perfil alterado com sucesso!" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

//EXCLUIR ADMIN
exports.excluir = async (req, res) => {
  try {
    await Administrador.findByIdAndRemove({ _id: req.params.id });
    res.status(200).send({ message: "Cadastro excluído com sucesso." });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível excluir o Administrador " + error });
  }
};

//VER DETALHES ENTIDADE
exports.entidade = async (req, res) => {
  try {
   
    const entidade = await Entidade.findOne({ _id: req.params.entid });
    res.status(200).send({ entidade });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//APROVAR ENTIDADE
exports.aprovarEntidade = async (req, res) => {
  var statusCadastro = req.body;
  try {
    await Entidade.updateOne({ _id: req.params.entid }, statusCadastro);
    return res
      .status(200)
      .send({ message: "Status do cadastro: " + statusCadastro.statusCadastro });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

//VER DETALHES ESTUDANTE
exports.estudante = async (req, res) => {
  try {
   
    const estudante = await Estudante.findOne({ _id: req.params.estid });
    res.status(200).send({ estudante });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//APROVAR ESTUDANTE
exports.aprovarEstudante = async (req, res) => {
  var statusCadastro = req.body;
  try {
    await Estudante.updateOne({ _id: req.params.estid }, statusCadastro);
    return res
      .status(200)
      .send({ message: "Status do cadastro: " + statusCadastro.statusCadastro });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao atualizar" + error });
  }
};
