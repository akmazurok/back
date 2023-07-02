var mongoose = require("mongoose");
const Vaga = require("../models/vaga");
const Inscricao = require("../models/inscricao");
const Certificado = require("../models/certificado");
const Estudante = require("../models/usuario").Estudante;
const Usuario = require("../models/usuario").Usuario;

//ESTUDANTE POR ID
exports.getPerfilEstudante = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ _id: req.params.id }, "-senha");
    const estudante = await Estudante.findOne({ userid: req.params.id });   
    res.status(200).send({ usuario, estudante });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//EDITAR ESTUDANTE
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

//LISTAR TODAS AS VAGAS ABERTAS
exports.listarVagas = async (req, res) => {
  const id = parseInt(req.params.id);
  const pagina = parseInt(req.params.pagina);
  let limit = 5;
  let skipPage = limit * (pagina - 1);

  //Buscar o Id do Estudante a partir do ID do usuário
  const estudanteId = await Estudante.findOne({
    userid: req.params.id,
  }).select("_id");

  //Verificando todas as vagas que o estudante está inscrito
  const busca = await Inscricao.find({ estudanteId }).select("_id");

  try {
    //$nin a gente filtra para ele não trazer aqueles dados que possuem aquele id no caso da vaga
    const tamanhoVagas = await Vaga.find({
      statusVaga: "ABERTA",
      inscricoes: { $nin: busca },
    }).populate({
      path: "inscricoes",
      select: "userId",
    });

    const vagas = await Vaga.find({
      statusVaga: "ABERTA",
      inscricoes: { $nin: busca },
    })
      .populate({
        path: "inscricoes",
        select: "userId",
      })
      .populate({
        path: "entidadeId",
        select: "nome",
      })
      .skip(skipPage)
      .limit(limit);

    res.status(200).send({ vagas: vagas, tamanhoPagina: tamanhoVagas.length });
  } catch (error) {
    res
      .status(404)
      .send({ message: "Vagas não localizadas" + error }, { vagas: null });
  }
};

//BUSCA DE VAGAS
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

//DETALHES DA VAGA
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

//INSCREVER-SE EM VAGA
exports.inscricaoVaga = async (req, res) => {
  const vagaId = mongoose.Types.ObjectId(req.params.vagaid);

  try {
    //passa o id da coleção estudante pra salvar na inscrição
    const estudanteId = await Estudante.findOne({
      userid: req.params.id,
    }).select("_id");

    //verifica se está inscrito na vaga
    const estudante = await Estudante.find({ estudanteId });
    const busca = await Inscricao.find({ vagaId, estudanteId });
    if (busca.length > 0)
      return res
        .status(422)
        .send({ message: "Você já possui inscrição nesta vaga.", busca });

    const vaga = await Vaga.findById(req.params.vagaid);

    //criar a inscricao
    const inscricao = new Inscricao();
    inscricao.userId = req.params.id;
    inscricao.estudanteId = estudanteId;
    inscricao.vagaId = vagaId;
    inscricao.dataInicioTrabalho = vaga.dataInicioTrabalho;
    inscricao.dataEncerramentoTrabalho = vaga.dataEncerramentoTrabalho;
    inscricao.diasTrabalho = vaga.diasTrabalho;
    inscricao.save();

    //adiciona a inscricao na vaga para consulta da Entidade
    await Vaga.updateOne(
      { _id: req.params.vagaid },
      { $push: { inscricoes: inscricao } }
    );

    res
      .status(200)
      .send({ message: "Inscrição realizada com sucesso!", inscricao });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível completar a inscrição" + error });
  }
};

//LISTAR INSCRICOES
exports.listarInscricoes = async (req, res) => {
  try {
    const inscricoes = await Inscricao.find({
      userId: req.params.id,
    })
      .populate({
        path: "vagaId",
        populate: {
          path: "entidadeId",
          select: "nome",
        },
      })
      .sort({ dataInscricao: -1 });

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

//RESCINDIR TERMO DE ADESAO
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
