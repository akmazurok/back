const Instituicao = require("../models/instituicao");
const Curso = require("../models/curso");

//TO DO - /instituicao /instituicoes /curso /cursos

//CADASTRAR INSTITUICAO
exports.cadastrarIes = async (req, res) => {
  try {
    const ies = await Instituicao.create(req.body);
    return res.status(201).send({ ies });
  } catch (error) {
    return res.status(400).send(error);
  }
};

//LISTAR IES
exports.listarIes = async function (req, res) {
  try {
    const instituicoes = await Instituicao.find();
    res.status(200).send({ instituicoes });
  } catch (error) {
    res
      .status(500)
      .send({ erro: "Não foi possível cadastrar a Instituição: " + error });
  }
};

//RETORNA IES POR ID
exports.buscarIes = async function (req, res) {
  try {
    const instituicao = await Instituicao.findOne({ _id: req.params.id });
    res.status(200).send({ instituicao });
  } catch (error) {
    res.status(500).send({ erro: error });
  }
};

//RETORNA IES POR ID
exports.excluirIes = async function (req, res) {
  try {
    const ies = await Instituicao.findOne({ _id: req.params.id });
    await Instituicao.findByIdAndRemove({ _id: req.params.id });
    res
      .status(200)
      .send({ message: "Instituição " + ies.nome + " excluída com sucesso." });
  } catch (error) {
    res.status(500).send({ erro: error });
  }
};

//ADICIONAR CURSO NA IES
exports.cadastrarCurso = async (req, res) => {
  const curso = new Curso(req.body);

  try {
    await Instituicao.updateOne(
      { _id: req.params.id },
      { $push: { cursos: req.body } }
    );
    return res.status(200).send({ curso });
  } catch (error) {
    return res.status(400).send({ error: "Erro ao realizar o cadastro" });
  }
};

//LISTAR CURSOS NA IES
exports.listarCursos = async (req, res) => {
  try {
    const instituicao = await Instituicao.findOne({ _id: req.params.id });
    res.status(200).send(instituicao.cursos);
  } catch (error) {
    res.status(500).send({ erro: error });
  }
};
