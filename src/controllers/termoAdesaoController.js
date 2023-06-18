var mongoose = require("mongoose");
const Entidade = require("../models/usuario").Entidade;
const Estudante = require("../models/usuario").Estudante;
const TermoAdesao = require("../models/termoAdesao");
const Inscricao = require("../models/inscricao");
const Vaga = require("../models/vaga");

//GERAR TERMO DE ADESAO - OK
exports.gerarTermo = async (req, res) => {
  const idInscricao = mongoose.Types.ObjectId(req.params.inscricaoid);

  try {
    const entidade = await Entidade.findOne({ userid: req.params.idUserEnt });
    const inscricao = await Inscricao.findById({ _id: req.params.inscricaoid });

    const termoAdesao = new TermoAdesao();
    termoAdesao.idInscricao = idInscricao;
    termoAdesao.idEntidade = entidade._id;
    termoAdesao.idEstudante = inscricao.estudanteId;
    termoAdesao.idVaga = inscricao.vagaId;
    termoAdesao.save();

    await Inscricao.updateOne(
      { _id: req.params.inscricaoid },
      { $set: { termoAdesaoId: termoAdesao._id } }
    );

    res.status(201).send({ message: "Termo gerado com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível completar a inscrição" + error });
  }
};

//VISUALIZAR TERMO - OK
exports.visualizarTermo = async (req, res) => {
  try {
    const termo = await TermoAdesao.findOne({
      _id: req.params.termoid,
    }).populate({
      path: "idInscricao",
      select: "_id termoAdesao",
    });
    const estudante = await Estudante.findOne({ _id: termo.idEstudante })
      .populate({
        path: "userid",
        select: "login",
      })
      .select(
        "nomeCompleto nomeSocial rg rgEmissor estadoCivil telefone email endereco"
      );
    const entidade = await Entidade.findOne({ _id: termo.idEntidade })
      .populate({
        path: "userid",
        select: "login",
      })
      .select("razaoSocial nomeFantasia telefone email endereco");
    const vaga = await Vaga.findOne({ _id: termo.idVaga }).select(
      "nomeVaga descricao requisitos dataInicioTrabalho dataEncerramentoTrabalho horarioInicioTrabalho horarioEncerramentoTrabalho"
    );
    res.status(200).send({ termo, estudante, entidade, vaga });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível completar a operação" + error });
  }
};

//ACEITAR TERMO - OK
exports.aceitarTermo = async (req, res) => {
  try {
    const termo = await TermoAdesao.findByIdAndUpdate(
      { _id: req.params.termoid },
      { $set: { aceiteTermo: Date.now() } }
    );
    await Inscricao.findByIdAndUpdate(
      { _id: termo.idInscricao },
      { $set: { termoAdesao: true } }
    );

    res.status(200).send({ message: "Termo de Adesão aceito com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível completar a operação" + error });
  }
};

//RESCINDIR TERMO - fazer gerar o certificado
exports.rescindirTermo = async (req, res) => {
  try {
    const termo = await TermoAdesao.findByIdAndUpdate(
      { _id: req.params.termoid },
      { $set: { rescisaoTermo: Date.now() } }
    );
    await Inscricao.findByIdAndUpdate(
      { _id: termo.idInscricao },
      { $set: { statusInscricao: 'ENCERRADO' } }
    );

    //gerar certificado 

    res.status(200).send({ message: "Termo de Adesão rescindido com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível completar a operação" + error });
  }
};