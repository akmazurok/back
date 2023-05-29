var mongoose = require("mongoose");
const Entidade = require("../models/usuario").Entidade;
const Usuario = require("../models/usuario").Usuario;
const Estudante = require("../models/usuario").Estudante;
const Vaga = require("../models/vaga");
const Inscricao = require('../models/inscricao');

//TO-DO - /ver inscritos /aprovar inscritos

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

//LISTAR VAGAS DA ENTIDADE - OK
exports.listarVagas = async (req, res) => {
  const entidade = mongoose.Types.ObjectId(req.params);
  try {
    const vagas = await Vaga.find({ "entidade.id": entidade });
    res.status(200).send(vagas);
  } catch (error) {
    res.status(404).send({ message: "Vagas não localizadas" + error });
  }
};

//VISUALIZAR VAGA - OK
exports.vaga = async (req, res) => {
  try {
    const vaga = await Vaga.findById(req.params.vagaid);
    res.status(200).send(vaga);
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//EDITAR VAGA - OK
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

//ENTIDADE POR ID - OK
exports.entidade = async (req, res) => {
  try {
    const entidade = await Entidade.findById(req.params.id);
    res.status(200).send({ entidade });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//EDITAR ENTIDADE - OK
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


//inserir a partir daqui no swagger
//VISUALIZAR INSCRITOS POR VAGA - TESTAR
exports.visualizarInscritos = async (req, res) => {
  try {
    const inscritos = await Vaga.findById(req.params.vagaid , inscritos);
    return res.status(200).send(inscritos);
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Não há inscritos para a vaga" + error });
  }
};

//VISUALIZAR DETALHES DO INSCRITO - TESTAR
exports.visualizarInscrito = async (req, res) => {
  try {
    const inscrito = await Estudante.findById(req.params.inscritoid);
    return res.status(200).send(inscrito);
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Não localizado" + error });
  }
};

//APROVAR INSCRITO - TESTAR
exports.aprovarInscrito = async (req, res, next) => {
	const entidade = req.params.id;
	const vaga = req.params.vagaid;
	const inscrito = req.params.inscritoid;
	
  try {
	await Vaga.updateOne({_id: vaga, inscritos: inscritoid} , inscritos);
	
	
    await Estudante.updateOne({ _id: req.params.id }, entidade);
    next('route');
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Não localizado" + error });
  }
};

//GERAR INSCRICAO - TESTAR
exports.aprovarInscrito = async (req, res, next) => {
  try {
    const inscrito = await Estudante.findById(req.params.id);
    return res.status(200).send(inscrito);
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Não localizado" + error });
  }
};

//CRIAR VINCULO CANDIDATO VAGA - MANTER
//na vaga, mudar a inscrição para "aprovado" e colocar id do vinculo gerado
//fazer endpoint para passar os dados pro termo de adesao ser gerado no front e aceito pelo estudante
//no est fazer endpoint para gerar certificado de horas de participação, com dados de todos as atividades
//e a soma da carga horária
exports.candidatoVaga = async (req, res) => {
  //const {id, vagaid, inscritoid} = req.params;
  const vaga = new Inscricao(req.params);
  
  try {
    await vaga.save();
    return res.status(201).send({ message: "Vaga criada com sucesso! ", vaga });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Não foi possível cadastrar a vaga: " + error });
  }
};

