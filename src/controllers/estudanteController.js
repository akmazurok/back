var mongoose = require("mongoose");
const Vaga = require("../models/vaga");
const Estudante = require("../models/usuario").Estudante;
const Usuario = require("../models/usuario").Usuario;

//TO-DO - /se inscrever em vaga /colocar codigo para permissoes de editar e visualizar infos

//ESTUDANTE POR ID - OK
exports.estudante = async (req, res) => {
  try {
    const estudante = await Estudante.findById(req.params.id);
    res.status(200).send({ estudante });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//EDITAR ESTUDANTE - OK
exports.editarEstudante = async (req, res) => {
  const estudante = req.body;
  try {
    await Estudante.updateOne({ _id: req.params.id }, estudante);
    return res.status(200).send({ message: "Dados alterados com sucesso!" });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

//LISTAR TODAS AS VAGAS ABERTAS - OK
exports.listarVagas = async (req, res) => {
  try {
    const vagas = await Vaga.find({ statusVaga: "Aberta" });
    res.status(200).send({ vagas });
  } catch (error) {
    res.status(404).send({ message: "Vagas não localizadas" + error });
  }
};

//DETALHES DA VAGA - OK
exports.detalhesVaga = async (req, res) => {
  try {
    const vaga = await Vaga.find({ _id: req.params.vagaid }).where({
      statusVaga: "Aberta",
    });
    res.status(200).send({ vaga });
  } catch (error) {
    res.status(404).send({ message: "Vaga não localizada" + error });
  }
};

//SE INSCREVER EM VAGA - OK
exports.inscricaoVaga = async (req, res) => {
  try {
    const inscricao = { estudante: req.params.id, statusAprovacao: "Inscrito" };
    await Vaga.updateOne(
      { _id: req.params.vagaid },
      { $push: { inscritos: inscricao } }
    );
    res.status(200).send({ inscricao });
  } catch (error) {
    res.status(404).send({ message: "Vaga não localizada" + error });
  }
};

//CANCELAR INSCRICAO - OK
exports.cancelarInscricao = async (req, res) => {
  try {
    const inscricao = { estudante: req.params.id, statusAprovacao: "Inscrito" };
     await Vaga.updateOne(
      { _id: req.params.vagaid },
      { $pull: { inscritos: inscricao } }
    ); 
    res.status(200).send({ message: "Inscrição cancelada com sucesso!" });
  } catch (error) {
    res.status(404).send({ message: "Inscrição não localizada" + error });
  }
};
