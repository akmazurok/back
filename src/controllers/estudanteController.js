var mongoose = require("mongoose");
const Vaga = require("../models/vaga");
const Inscricao = require("../models/inscricao");
const Certificado = require("../models/certificado");
const Estudante = require("../models/usuario").Estudante;
const Usuario = require("../models/usuario").Usuario;

//TO-DO - /termo de adesao /certificados /download certificado

//ESTUDANTE POR ID - OK
exports.getPerfilEstudante = async (req, res) => {
  try {
    const estudante = await Estudante.findOne({ userid: req.params.id });

    res.status(200).send({ estudante });
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
    const vagas = await Vaga.find({ statusVaga: "ABERTA" }).populate({
      path: "entidadeId",
      select: "nome",
    });
    res.status(200).send(vagas);
  } catch (error) {
    res
      .status(404)
      .send({ message: "Vagas não localizadas" + error }, { vagas: null });
  }
};

/***- ARRUMAR */
//BUSCA DE VAGAS PELO NOME DA VAGA OU DA ENTIDADE 
exports.buscarVagas = async (req, res) => {
  try {
    const vagas = await Vaga.find({ statusVaga: "ABERTA" }).populate({
      path: "entidadeId",
      select: "nome",
    });

    res.status(200).send(vagas);
  } catch (error) {
    res
      .status(404)
      .send({ message: "Vagas não localizadas" + error }, { vagas: null });
  }
};

//DETALHES DA VAGA -  to-do //verificar se está inscrito na vaga
exports.detalhesVaga = async (req, res) => {
  // const estudanteId = req.params.id;}

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

//INSCREVER-SE EM VAGA ok
exports.inscricaoVaga = async (req, res) => {
  const estudanteId = mongoose.Types.ObjectId(req.params.id);
  const vagaId = mongoose.Types.ObjectId(req.params.vagaid);

  try {
    //verifica se está inscrito na vaga
    const busca = await Inscricao.find({ vagaId, estudanteId });
    if (busca.length > 0)
      return res
        .status(422)
        .send({ message: "Você já possui inscrição nesta vaga.", busca });

    //criar a inscricao
    const inscricao = new Inscricao();
    inscricao.estudanteId = estudanteId;
    inscricao.vagaId = vagaId;
    inscricao.save();

    //adiciona a inscricao na vaga para consulta da Entidade
    await Vaga.updateOne(
      { _id: req.params.vagaid },
      { $push: { inscricoes: inscricao } }
    );

    res.status(200).send({ message: "Inscrição realizada com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível completar a inscrição" + error });
  }
};

//LISTAR INSCRICOES - OK
exports.listarInscricoes = async (req, res) => {
  try {
    const inscricoes = await Inscricao.find({
      estudanteId: req.params.id,
    }).populate({
      path: "vagaId",
      populate: {
        path: "entidadeId",
        select: "nome",
      },
    }).sort({dataInscricao: -1});

    res.status(200).send({ inscricoes });
  } catch (error) {
    res
      .status(404)
      .send({ message: "Não há inscrições " + error }, { inscricoes: null });
  }
};

//DETALHES DA INSCRICAO - OK
exports.detalhesInscricao = async (req, res) => {
  try {
    const inscricao = await Inscricao.find({ _id: req.params.inscricaoid });
    res.status(200).send({ inscricao });
  } catch (error) {
    res.status(404).send({ message: "Inscrição não localizada" + error });
  }
};

//CANCELAR INSCRICAO - OK
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

//***ARRUMAR*****/
//ACEITAR TERMO DE ADESAO - arrumar na entidade primeiro
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

//***ARRUMAR*****/
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

//***ARRUMAR*****/
//LISTAR CERTIFICADOS - arrumar
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
