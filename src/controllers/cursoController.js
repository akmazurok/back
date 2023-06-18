var mongoose = require("mongoose");
const Instituicao = require("../models/instituicao");
const Curso = require("../models/curso");

//TO DO

//CADASTRAR INSTITUICAO - OK
exports.cadastrarIes = async (req, res) => {
  const cnpj = req.body.cnpj;
  try {
    if (await Instituicao.find({cnpj: cnpj})) {
      console.log("achou");
      return res.status(422).send({ message: "CNPJ já cadastrado" });
    }

    const ies = await Instituicao.create(req.body);

    return res
      .status(201)
      .send({ message: "Instituição cadastrada com sucesso: ", ies });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Não foi possível cadastrar a Instituição: " + error });
  }
};

//LISTAR IES - OK
exports.listarIes = async function (req, res) {
  try {
    const instituicoes = await Instituicao.find().sort({ nome: "asc" });
    res.status(200).send({ instituicoes });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível listar as Instituições: " + error });
  }
};

//RETORNA IES POR ID - OK
exports.visualizarIes = async function (req, res) {
  try {
    const instituicao = await Instituicao.findOne({ _id: req.params.iesid });
    res.status(200).send({ instituicao });
  } catch (error) {
    res.status(404).send({
      message: "Instituição " + req.params.nome + " não localizada: " + error,
    });
  }
};

//EXCLUI IES POR ID - OK
exports.excluirIes = async function (req, res) {
  try {
    const iesId = req.params.iesid;

    await Curso.deleteMany({ instituicao: iesId });
    const ies = await Instituicao.findByIdAndRemove({ _id: req.params.iesid });
  
    res
      .status(200)
      .send({ message: "Instituição " + ies.nome + " excluída com sucesso." });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível excluir a Instituição: " + error });
  }
};

//CADASTRAR CURSO - OK
exports.cadastrarCurso = async (req, res) => {
  const { nomeCurso, grau } = req.body;
  const instituicao = req.params.iesid;
  try {
    const curso = await Curso.create({ instituicao, nomeCurso, grau });
    return res.status(201).send({
      message: "Curso " + curso.nomeCurso + " cadastrado com sucesso! ",
      curso,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar o cadastro: " + error });
  }
};

//LISTAR CURSOS NA IES - OK
exports.listarCursos = async (req, res) => {
  try {
    const instituicao = await Instituicao.findOne({ _id: req.params.iesid });
    const id = mongoose.Types.ObjectId(instituicao.id);
    const cursos = await Curso.find()
      .where({ instituicao: id })
      .sort({ nome: "asc" });
    res.status(200).send(cursos);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível listar os cursos: " + error });
  }
};

//EXCLUI CURSO POR ID - O
exports.excluirCurso = async function (req, res) {
  try {
    await Curso.findOneAndRemove({ _id: req.params.cursoid });
    res.status(200).send({ message: "Curso excluído com sucesso." });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível excluir o curso: " + error });
  }
};

//RETORNA CURSO POR ID - Não utilizado
/* exports.visualizarCurso = async function (req, res) {
  try {
    const curso = await Curso.findOne({ _id: req.params.cursoid });
    res.status(200).send({ curso });
  } catch (error) {
    res.status(404).send({
      message: "Curso " + req.params.nome + " não localizado: " + error,
    });
  }
}; */
