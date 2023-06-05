const Instituicao = require("../models/instituicao");
const Curso = require("../models/curso");
const { default: mongoose } = require("mongoose");

//TO DO - arrumar excluir curso e excluir ies

//CADASTRAR INSTITUICAO - OK
exports.cadastrarIes = async (req, res) => {
  try {
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
    const instituicoes = await Instituicao.find();
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

//EXCLUI IES POR ID - ********ARRUMAR******
exports.excluirIes = async function (req, res) {
  try {
    await Curso.find().where({ instituicao: req.params.iesid }).deleteMany();
    const ies = await Instituicao.findOneAndRemove({ _id: req.params.iesid });
    //  await Instituicao.findByIdAndRemove({ _id: req.params.id });
    res
      .status(200)
      .send({ message: "Instituição " + ies.nome + " excluída com sucesso." });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível excluir a Instituição: " + error });
  }
};

//CADASTRAR CURSO NA COLECAO CURSOS E ADD NA IES - OK
exports.cadastrarCurso = async (req, res) => {
  const instituicao = req.params.iesid;
  try {
    const curso = await Curso.create(req.body);
    curso.instituicao = instituicao;
    curso.save();
    await Instituicao.updateOne(
      { _id: instituicao },
      { $push: { cursos: curso } }
    );

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
    res.status(200).send(instituicao.cursos);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível listar os cursos: " + error });
  }
};

//RETORNA CURSO POR ID - OK
exports.visualizarCurso = async function (req, res) {
  try {
    const curso = await Curso.findOne({ _id: req.params.cursoid });
    res.status(200).send({ curso });
  } catch (error) {
    res.status(404).send({
      message: "Curso " + req.params.nome + " não localizado: " + error,
    });
  }
};

//EXCLUI CURSO POR ID - *********ARRUMAR********
exports.excluirCurso = async function (req, res) {
  try {
    const curso = await Curso.findOneAndRemove({ _id: req.params.cursoid });
    const instituicao = mongoose.Types.ObjectId(curso.instituicao);
    console.log(instituicao);
    await Instituicao.updateOne(
      { _id: instituicao },
      { $pull: { "cursos": curso } }
    );
    console.log(curso);
    res.status(200).send({ message: "Curso excluído com sucesso." });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível excluir o curso: " + error });
  }
};