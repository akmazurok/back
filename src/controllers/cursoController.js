const Instituicao = require("../models/instituicao");
const Curso = require("../models/curso");

//TO DO - arrumar excluir curso

//CADASTRAR INSTITUICAO
exports.cadastrarIes = async (req, res) => {
  try {
    const ies = await Instituicao.create(req.body);
    return res.status(201).send({ message: "Instituição cadastrada com sucesso: " + ies });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Não foi possível cadastrar a Instituição: " + error });
  }
};

//LISTAR IES
exports.listarIes = async function (req, res) {
  try {
    const instituicoes = await Instituicao.find();
    res.status(200).send({ instituicoes });
  } catch (error) {
    res.status(500).send({ message: "Não foi possível listar as Instituições: " + error });
  }
};

//RETORNA IES POR ID
exports.buscarIes = async function (req, res) {
  try {
    const instituicao = await Instituicao.findOne({ _id: req.params.id });
    res.status(200).send({ instituicao });
  } catch (error) {
    res.status(500).send({ message: "Instituição " + req.params.nome + " não localizada: " + error });
  }
};

//EXCLUI IES POR ID
exports.excluirIes = async function (req, res) {
  try {
    const ies = await Instituicao.findOne({ _id: req.params.id });
    await Instituicao.findByIdAndRemove({ _id: req.params.id });
    res
      .status(200)
      .send({ message: "Instituição " + ies.nome + " excluída com sucesso." });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível excluir a Instituição: " + error });
  }
};

//CADASTRAR CURSO NA COLECAO CURSOS E ADD NA IES
exports.addCurso = async (req, res) => {
  try {
    const curso = await Curso.create(req.body);
    await Instituicao.updateOne(
      { _id: req.params.id },
      { $push: { cursos: curso } }
    );

    return res
      .status(201).send({ message: "Curso " + curso.nome + " cadastrado com sucesso! " + curso });
  } catch (error) {
    return res.status(400).send({ message: "Erro ao realizar o cadastro: " + error });
  }
};

//LISTAR CURSOS NA IES
exports.listarCursos = async (req, res) => {
  try {
    const instituicao = await Instituicao.findOne({ _id: req.params.id });
    res.status(200).send(instituicao.cursos);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível listar os cursos: " + error });
  }
};

//RETORNA CURSO POR ID
exports.buscarCurso = async function (req, res) {
  try {
    const curso = await Curso.findOne({ _id: req.params.id });
    res.status(200).send({ curso });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Curso " + req.params.nome + " não localizado: " + error,
      });
  }
};

//EXCLUI CURSO POR ID - ARRUMAR
exports.excluirCurso = async function (req, res) {
  //const curso = req.body;
  try {
    //ver como exclui o curso da instituição
   
   await Curso.findByIdAndRemove({ _id: req.params.id });

    res.status(200).send({ message: "Instituição  excluída com sucesso." });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível excluir a Instituição: " + error });
  }
};

//NÃO UTILIZADO - ADICIONAR CURSO NA IES
/*exports.cadastrarCurso = async (req, res) => {
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
}; */