var mongoose = require("mongoose");
const Vaga = require("../models/vaga");
const Inscricao = require("../models/inscricao");
const Certificado = require("../models/certificado");
const Estudante = require("../models/usuario").Estudante;
const Usuario = require("../models/usuario").Usuario;

//TO-DO

//ESTUDANTE POR ID
exports.estudante = async (req, res) => {
  try {
    const estudante = await Estudante.findById(req.params.id);
    res.status(200).send({ estudante });
  } catch (error) {
    res.status(404).send({ message: "Dados não localizados " + error });
  }
};

//EDITAR ESTUDANTE
exports.editarEstudante = async (req, res) => {
  const estudante = req.body;
  try {
    await Estudante.updateOne({ _id: req.params.id }, estudante);
    return res.status(200).send({ message: "Dados alterados com sucesso!" });
  } catch (error) {
    return res.status(400).send({ message: "Erro ao atualizar" + error });
  }
};

//LISTAR TODAS AS VAGAS ABERTAS
exports.listarVagas = async (req, res) => {
  try {
    const vagas = await Vaga.find({ statusVaga: "ABERTA" });
    res.status(200).send({ vagas });
  } catch (error) {
    res
      .status(404)
      .send({ message: "Vagas não localizadas" + error }, { vagas: null });
  }
};

//DETALHES DA VAGA
exports.detalhesVaga = async (req, res) => {
  try {
    const vaga = await Vaga.find({ _id: req.params.vagaid }).where({
      statusVaga: "ABERTA",
    });
    res.status(200).send({ vaga });
  } catch (error) {
    res.status(404).send({ message: "Vaga não localizada" + error });
  }
};

//SE INSCREVER EM VAGA (arrumar dados que vao na inscricao)
exports.inscricaoVaga = async (req, res) => {
  const estudante = req.params.id;
  const vaga = req.body;

  try {
    //verificar se o status default está funcionando
    const inscricao = await Inscricao.create(estudante, vaga);
    await Vaga.updateOne(
      { _id: req.params.vagaid },
      { $push: { inscritos: inscricao } }
    );
    res
      .status(200)
      .send({ message: "Inscrição realizada com sucesso! " + inscricao });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível completar a inscrição" + error });
  }
};

//LISTAR INSCRICOES
exports.listarInscricoes = async (req, res) => {
  try {
    const inscricoes = await Inscricao.find({ estudante: req.params.id });
    res.status(200).send({ inscricoes });
  } catch (error) {
    res
      .status(404)
      .send({ message: "Não há inscrições " + error }, { inscricoes: null });
  }
};

//DETALHES DA INSCRICAO
exports.detalhesInscricao = async (req, res) => {
  try {
    const inscricao = await Inscricao.find({ _id: req.params.inscricaoid });
    res.status(200).send({ inscricao });
  } catch (error) {
    res.status(404).send({ message: "Inscrição não localizada" + error });
  }
};

//CANCELAR INSCRICAO
exports.cancelarInscricao = async (req, res) => {
  try {
    const inscricao = await Inscricao.updateOne(
      { _id: req.params.inscricaoid },
      { $set: { statusInscricao: "CANCELADO" } }
    );
    await Vaga.updateOne(
      { _id: req.params.vagaid },
      { $pull: { inscritos: inscricao } }
    );
    res.status(200).send({ message: "Inscrição cancelada com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível cancelar a inscrição " + error });
  }
};

//ACEITAR TERMO DE ADESAO
exports.aceitarTermo = async (req, res) => {
  try {
    await Inscricao.updateOne(
      { _id: req.params.inscricaoid },
      { $set: { termoAdesao: true } },
    );
    res.status(200).send({ message: "Termo de adesão aceito com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível continuar com a operação " + error });
  }
};

//RESCINDIR TERMO DE ADESAO - arrumar dados para inserir no certificado
exports.rescindirTermo = async (req, res) => {
  try {
    const inscricao = await Inscricao.updateOne(
      { _id: req.params.inscricaoid },
      { $set: { termoAdesao: false, statusInscricao: "ENCERRADO"  } }
    );
    const certificado = await Certificado.create(inscricao);

    res
      .status(200)
      .send({
        message:
          "Termo de adesão rescindido com sucesso! O Certificado estará em breve disponível.",
      });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível continuar com a operação " + error });
  }
};

//LISTAR CERTIFICADOS
exports.listarCertificados = async (req, res) => {
  try {
    const inscricoes = await Inscricao.find({ estudante: req.params.id });
    res.status(200).send({ inscricoes });
  } catch (error) {
    res
      .status(404)
      .send({ message: "Não há inscrições " + error }, { inscricoes: null });
  }
};
