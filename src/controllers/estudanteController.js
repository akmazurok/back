var mongoose = require("mongoose");
const Vaga = require("../models/vaga");
const Inscricao = require("../models/inscricao");
const Certificado = require("../models/certificado");
const Estudante = require("../models/usuario").Estudante;
const Usuario = require("../models/usuario").Usuario;

//TO-DO - /inscricao vaga  /detalhes da inscricao /termo de adesao /certificados /download certificado

//ESTUDANTE POR ID - OK
exports.getPerfilEstudante = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ _id: req.params.id }, "-senha");
    const estudante = await Estudante.findOne({ userid: req.params.id });

    res.status(200).send({ usuario, estudante });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//EDITAR ESTUDANTE - OK
exports.setPerfilEstudante = async (req, res) => {
  const dados = req.body;

  try {
    //altera dados das coleções Usuario e Estudante
    await Usuario.updateOne({ _id: req.params.id }, dados);
    await Estudante.updateOne({ userid: req.params.id }, dados);
    return res.status(200).send({ message: "Dados alterados com sucesso!" });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao atualizar" + error });
  }
};

//LISTAR TODAS AS VAGAS ABERTAS - OK
exports.listarVagas = async (req, res) => {
  try {
    const vagas = await Vaga.find({ statusVaga: "ABERTA" }).populate({ path: "entidadeId", select: "nome" });
    res.status(200).send({ vagas });
  } catch (error) {
    res
      .status(404)
      .send({ message: "Vagas não localizadas" + error }, { vagas: null });
  }
};

//DETALHES DA VAGA - OK
exports.detalhesVaga = async (req, res) => {
  try {
    //mostra os detalhes da vaga, escondendo o campo inscricoes
    const vaga = await Vaga.find(
      { _id: req.params.vagaid },
      "-inscricoes"
    ).populate({ path: "entidadeId", select: "nome" });
    res.status(200).send(vaga);
  } catch (error) {
    res.status(404).send({ message: "Vaga não localizada" + error });
  }
};

//INSCREVER-SE EM VAGA **********ARRUMAR *********
exports.inscricaoVaga = async (req, res) => {
  const estudanteId = mongoose.Types.ObjectId(req.params.id);
  //ver como pegar os dados da vaga pra salvar na inscricao
  //arrumar carga horária (provavelmente arrumar na classe Vaga)
  try {
    const vaga = await Vaga.find({ _id: req.params.vagaid });
    const inscricao = new Inscricao();
    inscricao.estudanteId = estudanteId;
    inscricao.entidadeId = mongoose.Types.ObjectId(vaga.entidadeId);
    inscricao.save();

    await Vaga.updateOne(
      { _id: req.params.vagaid },
      { $push: { inscricoes: inscricao } }
    );
    res
      .status(200)
      .send({ message: "Inscrição realizada com sucesso! ", inscricao });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível completar a inscrição" + error });
  }
};

//LISTAR INSCRICOES
exports.listarInscricoes = async (req, res) => {
  try {
    const inscricoes = await Inscricao.find({ estudanteId: req.params.id });
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
      { $set: { termoAdesao: true } }
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
      { $set: { termoAdesao: false, statusInscricao: "ENCERRADO" } }
    );
    //gera o certificado
    const certificado = await Certificado.create(inscricao);
    res.status(200).send({
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
    const certificados = await Certificado.find({ estudanteId: req.params.id });
    res.status(200).send({ certificados });
  } catch (error) {
    res
      .status(404)
      .send(
        { message: "Não há certificados " + error },
        { certificados: null }
      );
  }
};
