var mongoose = require("mongoose");
const Usuario = require("../models/usuario").Usuario;
const Entidade = require("../models/usuario").Entidade;
const Estudante = require("../models/usuario").Estudante;
const Administrador = require("../models/usuario").Administrador;
const Vaga = require("../models/vaga");

//TO-DO - /promover

//VISUALIZAR PERFIL - passando id de usuario - OK
exports.getPerfilAdmin = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ _id: req.params.id }, "-senha");
    const admin = await Administrador.findOne({ userid: req.params.id });
    res.status(200).send({ admin, usuario });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//EDITAR PERFIL - passando id de usuario - OK
exports.setPerfilAdmin = async (req, res) => {
  const dados = req.body;
  try {
    //altera dados das coleções Usuario e Administrador
    await Usuario.updateOne({ _id: req.params.id }, dados);
    await Administrador.updateOne({ userid: req.params.id }, dados);
    return res.status(200).send({ message: "Dados alterados com sucesso!" });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao atualizar" + error });
  }
};

//RETORNAR TODAS AS VAGAS PARA APROVACAO - OK
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

//RETORNAR VAGA POR ID - OK
exports.detalhesVaga = async (req, res) => {
  try {
    const vaga = await Vaga.find({ _id: req.params.vagaid });
    var entidadeId = mongoose.Types.ObjectId(vaga.entidadeId);
    const entidade = await Entidade.findOne({ entidadeId }).select(
      "razaoSocial nomeFantasia email telefone endereco"
    );
    res.status(200).send({ vaga, entidade });
  } catch (error) {
    res.status(404).send({ message: "Vaga não localizada" + error });
  }
};

//VALIDAR VAGA - ok
exports.validarVaga = async (req, res) => {
  var { statusVaga, comentario } = req.body;
  var idAdmin = req.params.id;
  var dataAprovacaoVaga = Date();

  try {
    await Vaga.updateOne(
      { _id: req.params.vagaid },
      { statusVaga, comentario, idAdmin, dataAprovacaoVaga }
    );
    return res.status(200).send({ message: "Status da vaga: " + statusVaga });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao atualizar" + error });
  }
};

//RETORNAR TODOS AS ENTIDADES PARA APROVAçÃO - OK
exports.listarEntidades = async (req, res) => {
  try {
    const entidades = await Usuario.find(
      { perfil: "ENTIDADE", statusPerfil: "PENDENTE"},
      { senha: 0 }
    ).sort({ dataCadastro: 1 });
    res.status(200).send({ entidades });
  } catch (error) {
    res.status(404).send({
      message: "Não foram encontradas Entidades para aprovação" + error,
    });
  }
};

//VER DETALHES ENTIDADE - OK
exports.entidade = async (req, res) => {
  try {
    const entidade = await Entidade.findOne({ _id: req.params.entid }).populate(
      "userid",
      "login perfil dataCadastro"
    );
    res.status(200).send({ entidade });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//VALIDAR ENTIDADE - OK
exports.validarEntidade = async (req, res) => {
  var { statusCadastro, comentario } = req.body;
  var idAdmin = req.params.id;
  var dataAprovacao = Date();

  try {
    console.log(statusCadastro);
    await Entidade.updateOne(
      { _id: req.params.entid },
      { statusCadastro, comentario, idAdmin, dataAprovacao }
    );
    return res.status(200).send({
      message: "Status do cadastro: " + statusCadastro,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

//RETORNAR TODOS OS ESTUDANTES PARA APROVAÇÃO - OK
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

//VER DETALHES ESTUDANTE - OK
exports.estudante = async (req, res) => {
  try {
    const estudante = await Estudante.findOne({
      _id: req.params.estid,
    }).populate("userid", "login perfil dataCadastro");
    res.status(200).send({ estudante });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//VALIDAR ESTUDANTE - OK
exports.validarEstudante = async (req, res) => {
  var { statusCadastro, comentario } = req.body;
  var idAdmin = req.params.id;
  var dataAprovacao = Date();

  try {
    await Estudante.updateOne(
      { _id: req.params.estid },
      { statusCadastro, comentario, idAdmin, dataAprovacao }
    );
    return res.status(200).send({
      message: "Status do cadastro: " + statusCadastro,
    });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao atualizar" + error });
  }
};

//RETORNAR TODOS OS ADMINS - OK
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

//CADASTRAR ADMIN - OK
exports.cadastrar = async (req, res) => {
  const { login, senha, perfil, nome } = req.body;

  try {
    if (await Usuario.findOne({ login }))
      return res.status(400).send({ error: "CFP já cadastrado" });
    const usuario = await Usuario.create({ login, senha, perfil, nome });
    usuario.senha = undefined;
    const userid = usuario.id;

    const cadastro = new Administrador(req.body);
    cadastro.userid = userid;
    await cadastro.save();

    // retorna usuario e admin pra mostrar nos testes
    return res
      .status(201)
      .send({ message: "Cadastro realizado com sucesso! ", usuario, cadastro });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar o cadastro " + error });
  }
};

//ADMIN POR ID - passando id do admin - OK
exports.visualizarAdmin = async (req, res) => {
  try {
    const admin = await Administrador.findOne({
      _id: req.params.adminid,
    }).populate("userid", "login perfil dataCadastro nome");
    res.status(200).send({ admin });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//EDITAR ADMIN - passando id do admin - OK
exports.editarAdmin = async (req, res) => {
  const dados = req.body;
  try {
    //altera dados das coleções Usuario e Administrador
    const admin = await Administrador.findOneAndUpdate(
      { _id: req.params.adminid },
      dados
    );
    var userid = mongoose.Types.ObjectId(admin.userid);
    await Usuario.findOneAndUpdate({ _id: userid }, dados);

    return res.status(200).send({ message: "Perfil alterado com sucesso!" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

//EXCLUIR ADMIN - passando id do admin - OK
exports.excluirAdmin = async (req, res) => {
  try {
    const admin = await Administrador.findOneAndRemove({
      _id: req.params.adminid,
    });
    var userid = mongoose.Types.ObjectId(admin.userid);
    await Usuario.findOneAndRemove({ _id: userid });

    res.status(200).send({ message: "Cadastro excluído com sucesso." });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível excluir o Administrador " + error });
  }
};

//PROMOVER ADMIN - passando id do admin
exports.promoverAdmin = async (req, res) => {
  try {
    const admin = await Administrador.findOne({ _id: req.params.adminid });
    var userid = mongoose.Types.ObjectId(admin.userid);
    await Usuario.findOneAndUpdate(
      { _id: userid },
      { perfil: "ADMINISTRADORGERAL" }
    );
    return res
      .status(200)
      .send({ message: "Administrador promovido com sucesso!" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

//REBAIXAR ADMIN - passando id do admin
exports.rebaixarAdmin = async (req, res) => {
  try {
    const admin = await Administrador.findOne({ _id: req.params.adminid });
    var userid = mongoose.Types.ObjectId(admin.userid);
    await Usuario.findOneAndUpdate(
      { _id: userid },
      { perfil: "ADMINISTRADOR" }
    );
    return res
      .status(200)
      .send({ message: "Administrador rebaixado com sucesso!" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};
