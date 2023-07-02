var mongoose = require("mongoose");
const Usuario = require("../models/usuario").Usuario;
const Entidade = require("../models/usuario").Entidade;
const Estudante = require("../models/usuario").Estudante;
const Administrador = require("../models/usuario").Administrador;
const Vaga = require("../models/vaga");

//VISUALIZAR PERFIL - passando id de usuario
exports.getPerfilAdmin = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ _id: req.params.id });
    const admin = await Administrador.findOne({ userid: req.params.id });
    res.status(200).send({ admin, usuario });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//EDITAR PERFIL - passando id de usuario
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

//RETORNAR TODAS AS VAGAS PARA APROVACAO
exports.listarVagas = async (req, res) => {
  try {
    const vagas = await Vaga.find({ statusVaga: "APROVACAO" })
      .populate({
        path: "entidadeId",
        select: "nome",
      })
      .sort({
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
    var entidadeId = mongoose.Types.ObjectId(vaga.entidadeId);
    const entidade = await Entidade.findOne({ entidadeId }).select(
      "razaoSocial nomeFantasia email telefone endereco"
    );
    res.status(200).send({ vaga, entidade });
  } catch (error) {
    res.status(404).send({ message: "Vaga não localizada" + error });
  }
};

//VALIDAR VAGA
exports.validarVaga = async (req, res) => {
  var { avaliacao, comentario } = req.body.formResolucao;
  var idAdmin = req.params.id;
  var statusVaga;
  var dataAprovacaoVaga = Date();

  avaliacao == 1 ? (statusVaga = "ABERTA") : (statusVaga = "REPROVADA");

  try {
    await Vaga.updateOne(
      { _id: req.params.vagaid },
      { statusVaga, comentario, idAdmin, dataAprovacaoVaga }
    );
    return res.status(200).send({ message: "Vaga avaliada com sucesso" });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao atualizar" + error });
  }
};

//RETORNAR TODOS AS ENTIDADES PARA APROVAÇÃO
exports.listarEntidades = async (req, res) => {
  try {
    const usuarios = await Usuario.find(
      { perfil: "ENTIDADE", statusPerfil: "PENDENTE" },
      { senha: 0 }
    ).sort({ dataCadastro: 1 });
    const entidades = await Entidade.find({
      userid: usuarios.map((user) => user._id),
    });
    res.status(200).send({ entidades });
  } catch (error) {
    res.status(404).send({
      message: "Não foram encontradas Entidades para aprovação" + error,
    });
  }
};

//VER DETALHES ENTIDADE
exports.entidade = async (req, res) => {
  try {
    const entidade = await Entidade.findOne({ _id: req.params.entid }).populate(
      {
        path: "userid",
        select: "login dataCadastro statusPerfil",
      }
    );
    res.status(200).send({ entidade });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//VALIDAR ENTIDADE
exports.validarEntidade = async (req, res) => {
  var { avaliacao, comentario } = req.body.formResolucao;
  var idAdmin = req.params.id;
  var dataAprovacao = Date();

  avaliacao == 1 ? (statusPerfil = "APROVADO") : (statusPerfil = "REPROVADO");

  try {
    const entidade = await Entidade.findByIdAndUpdate(
      { _id: req.params.entid },
      { comentario, idAdmin, dataAprovacao }
    );
    await Usuario.findOneAndUpdate({ _id: entidade.userid }, { statusPerfil });

    return res.status(200).send({
      message: "Entidade avaliada com sucesso",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

//RETORNAR TODOS OS ESTUDANTES PARA APROVAÇÃO
exports.listarEstudantes = async (req, res) => {
  try {
    const usuarios = await Usuario.find(
      { perfil: "ESTUDANTE", statusPerfil: "PENDENTE" },
      { senha: 0 }
    ).sort({ dataCadastro: 1 });
    const estudantes = await Estudante.find({
      userid: usuarios.map((user) => user._id),
    });

    res.status(200).send({ estudantes });
  } catch (error) {
    res.status(404).send({
      message: "Não foram encontrados Estudantes para aprovação" + error,
    });
  }
};

//VER DETALHES ESTUDANTE
exports.estudante = async (req, res) => {
  try {
    const estudante = await Estudante.findOne({
      _id: req.params.estid,
    }).populate({
      path: "userid",
      select: "login dataCadastro statusPerfil",
    });
    res.status(200).send({ estudante });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//VALIDAR ESTUDANTE
exports.validarEstudante = async (req, res) => {
  var { avaliacao, comentario } = req.body.formResolucao;
  var idAdmin = req.params.id;
  var dataAprovacao = Date();

  avaliacao == 1 ? (statusPerfil = "APROVADO") : (statusPerfil = "REPROVADO");

  try {
    const estudante = await Estudante.findByIdAndUpdate(
      { _id: req.params.estid },
      { comentario, idAdmin, dataAprovacao }
    );
    await Usuario.findOneAndUpdate({ _id: estudante.userid }, { statusPerfil });

    return res.status(200).send({
      message: "Estudante avaliado com sucesso",
    });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao atualizar" + error });
  }
};

//RETORNAR TODOS OS ADMINS
exports.listarAdmins = async (req, res) => {
  const busca = ["ADMINISTRADOR", "ADMINISTRADORGERAL"];
  try {
    const usuarios = await Usuario.find(
      { perfil: { $in: busca } },
      { senha: 0 }
    ).sort({ dataCadastro: 1 });
    const admins = await Administrador.find({
      userid: usuarios.map((user) => user._id),
    }).populate({
      path: "userid",
      select: "login perfil statusPerfil",
    });

    res.status(200).send({ admins });
  } catch (error) {
    res
      .status(404)
      .send({ message: "Administradores não localizados" + error });
  }
};

//CADASTRAR ADMIN
exports.cadastrarAdmin = async (req, res) => {
  const { login, senha, nome , perfil } = req.body; 
  const statusPerfil = 'APROVADO';

  try {
    //Confere se o cpf ou cnpj ja esta cadastrado
    if (await Usuario.findOne({ login }))
      return res.status(200).send({ message: "Usuário já cadastrado" });

    const usuario = await Usuario.create({
      login,
      senha,
      perfil,
      nome,
      statusPerfil
    });
    usuario.senha = undefined;
    const userid = usuario.id;    

    var cadastro = new Administrador(req.body);
    cadastro.userid = userid;    
    await cadastro.save();
    
    return res
      .status(201)
      .send({ message: "Cadastro realizado com sucesso! ", usuario, cadastro });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar o cadastro " + error });
  }
};

//ADMIN POR ID - passando id do admin
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

//EDITAR ADMIN - passando id do admin
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

//PROMOVER ADMIN - passando id do usuario admin
exports.promoverAdmin = async (req, res) => {
  try {
    await Usuario.findOneAndUpdate(
      { _id: req.params.adminid },
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

//REBAIXAR ADMIN - passando id do uusario admin
exports.rebaixarAdmin = async (req, res) => {
  var comentario = req.body.comentario; 
  try {
    await Usuario.findOneAndUpdate(
      { _id: req.params.adminid },
      { perfil: "ADMINISTRADOR" }
    );
    await Administrador.findOneAndUpdate(
      { userid: req.params.adminid },
      { comentario: comentario }
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
