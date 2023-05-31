var mongoose = require("mongoose");
const Entidade = require("../models/usuario").Entidade;
const Vaga = require("../models/vaga");
const Inscricao = require("../models/inscricao");

//TO-DO - 

//ENTIDADE POR ID - OK
exports.entidade = async (req, res) => {
  try {
    const entidade = await Entidade.findById(req.params.id).populate({
      path: "userid",
      select: "login",
      //verificar quais atributos precisa retornar
    });

    res.status(200).send({ entidade });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//EDITAR ENTIDADE
exports.editarEntidade = async (req, res) => {
  const entidade = req.body;
  try {
    await Entidade.updateOne({ _id: req.params.id }, entidade);
    return res.status(200).send({ message: "Dados alterados com sucesso!" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

//CADASTRAR VAGA - OK
exports.cadastrarVaga = async (req, res) => {
  const vaga = new Vaga(req.body);
  vaga.entidade = req.params;

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
  const entidade = mongoose.Types.ObjectId(req.params);
  try {
    const vagas = await Vaga.find({ "entidade.id": entidade });
    res.status(200).send(vagas);
  } catch (error) {
    res.status(404).send({ message: "Vagas não localizadas" + error });
  }
};

 //LISTAR VAGAS ABERTAS
/* exports.listarVagas = async (req, res) => {
  const entidade = mongoose.Types.ObjectId(req.params);
  try {
    const vagas = await Vaga.find({ "entidade.id": entidade }).where({
      statusVaga: "ABERTA",
    });;
    res.status(200).send(vagas);
  } catch (error) {
    res.status(404).send({ message: "Vagas não localizadas" + error });
  }
}; */
 
//VISUALIZAR VAGA - OK
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

//EDITAR VAGA
exports.editarVaga = async (req, res) => {
  const idvaga = req.params.vagaid;
  const vaga = req.body;
  try {
    await Vaga.updateOne({ _id: idvaga }, vaga);
    return res.status(200).send({ message: "Vaga alterada com sucesso!" });
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
    return res.status(500).send({ message: "Erro ao realizar ao atualizar" + error  });
  }
};

