var mongoose = require("mongoose");
const Entidade = require("../models/usuario").Entidade;
const Usuario = require("../models/usuario").Usuario;
const Vaga = require("../models/vaga");
const Inscricao = require("../models/inscricao");

//TO-DO -

//ENTIDADE POR ID - OK
exports.entidade = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ _id: req.params.id }, "-senha");
    const entidade = await Entidade.findOne({ userid: req.params.id });

    res.status(200).send({ usuario, entidade });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//EDITAR ENTIDADE - OK
exports.editarEntidade = async (req, res) => {
  const dados = req.body;
  try {
    //altera dados das coleções Usuario e Estudante
    await Usuario.updateOne({ _id: req.params.id }, dados);
    await Entidade.updateOne({ userid: req.params.id }, dados);
    return res.status(200).send({ message: "Dados alterados com sucesso!" });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao atualizar" + error });
  }
};

//CADASTRAR VAGA - OK
exports.cadastrarVaga = async (req, res) => {
  const entidadeId = mongoose.Types.ObjectId(req.params);
  const vaga = new Vaga(req.body);
  vaga.entidadeId = entidadeId;

  try {
    await vaga.save();
    return res.status(201).send({ message: "Vaga criada com sucesso! ", vaga });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Não foi possível cadastrar a vaga: " + error });
  }
};

//LISTAR TODAS AS VAGAS DA ENTIDADE - OK
exports.listarVagas = async (req, res) => {
  const entidadeId = mongoose.Types.ObjectId(req.params);
  try {
    const vagas = await Vaga.find({ entidadeId: entidadeId });
    res.status(200).send(vagas);
  } catch (error) {
    res.status(404).send({ message: "Vagas não localizadas" + error });
  }
};

//LISTAR VAGAS ABERTAS - OK
exports.listarVagasAbertas = async (req, res) => {
  const entidadeId = mongoose.Types.ObjectId(req.params);

  try {
    const vagas = await Vaga.find({ entidadeId: entidadeId }).where({
      statusVaga: "ABERTA",
    });
    res.status(200).send(vagas);
  } catch (error) {
    res.status(404).send({ message: "Vagas não localizadas" + error });
  }
};

//LISTAR VAGAS EM ANDAMENTO - OK
exports.listarVagasAndamento = async (req, res) => {
  const entidadeId = mongoose.Types.ObjectId(req.params);

  try {
    const vagas = await Vaga.find({ entidadeId: entidadeId }).where({
      statusVaga: "ANDAMENTO",
    });
    res.status(200).send(vagas);
  } catch (error) {
    res.status(404).send({ message: "Vagas não localizadas" + error });
  }
};

//VISUALIZAR DETALHES DA VAGA - OK
exports.vaga = async (req, res) => {
  try {
    const vaga = await Vaga.findById(req.params.vagaid).populate({
      path: "inscricoes",
    });
    res.status(200).send(vaga);
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//CANCELAR VAGA - OK
exports.cancelarVaga = async (req, res) => {
  try {
    const vaga = await Vaga.findById(req.params.vagaid);
    if (vaga.statusVaga == "ANDAMENTO") {
      return res.status(422).send({ message: "Não é possível cancelar vagas em andamento!" });
    }
    vaga.statusVaga = "CANCELADA";
    vaga.save();
    return res.status(200).send({ message: "Vaga cancelada com sucesso!" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

//-------------ARRUMAR----------

//inserir a partir daqui no swagger
//VISUALIZAR INSCRITOS POR VAGA - JÁ APARECE NO VISUALIZAR VAGA
/* exports.visualizarInscritos = async (req, res) => {
  try {
    const inscritos = await Vaga.findById(req.params.vagaid, inscritos);
    return res.status(200).send(inscritos);
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Não há inscritos para a vaga" + error });
  }
}; */

//VISUALIZAR DETALHES DO INSCRITO - TESTAR
exports.visualizarInscrito = async (req, res) => {
  try {
    const inscrito = await Inscricao.findById(req.params.inscritoid).populate({
      path: "estudante",
      //verificar quais atributos precisa retornar
    });
    return res.status(200).send(inscrito);
  } catch (error) {
    return res.status(404).send({ message: "Não localizado" + error });
  }
};

//APROVAR OU REPROVAR
exports.aprovarInscrito = async (req, res, next) => {
  const statusInscricao = req.body;
  try {
    await Inscricao.updateOne({ _id: req.params.inscritoid }, statusInscricao);
    return res.status(200).send({ message: "Inscrição avaliada com sucesso!" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};
