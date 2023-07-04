var mongoose = require("mongoose");
const Entidade = require("../models/usuario").Entidade;
const Estudante = require("../models/usuario").Estudante;
const Notificacao = require("../models/notificacao");
const Usuario = require("../models/usuario").Usuario;
const Vaga = require("../models/vaga");
const Inscricao = require("../models/inscricao");

//ENTIDADE POR ID
exports.getPerfilEntidade = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ _id: req.params.id }, "-senha");
    const entidade = await Entidade.findOne({ userid: req.params.id });

    res.status(200).send({ usuario, entidade });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//EDITAR ENTIDADE
exports.setPerfilEntidade = async (req, res) => { 
  const dados = req.body; 
  try {
    //altera dados das coleções Usuario e Estudante
    await Usuario.updateOne({ _id: req.params.id }, dados);
    await Entidade.updateOne({ userid: req.params.id }, dados);
    return res.status(200).send({ message: "Dados alterados com sucesso!" });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao atualizar" + error });
  }
};

//CADASTRAR VAGA
exports.cadastrarVaga = async (req, res) => {
  const entidadeId = mongoose.Types.ObjectId(req.params);
  const vaga = new Vaga(req.body);
  vaga.entidadeId = entidadeId;

  try {
    await vaga.save();
    return res.status(201).send({ message: "Vaga criada com sucesso! ", vaga });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Não foi possível cadastrar a vaga: " + error });
  }
};

//LISTAR TODAS AS VAGAS DA ENTIDADE
exports.filtrarVagas = async (req, res) => {
  const filtro = req.params.filtro;

  const id = req.params.id;
  const pagina = parseInt(req.params.pagina);

  let limit = 5;
  let skip = limit * (pagina - 1);

  try {
    //Buscar vagas de acordo com o que for filtrado
    if (filtro.length > 0) {
      const vagas = await Vaga.find({
        entidadeId: id,
        statusVaga: filtro,
        nomeVaga: filtro,
        requisitos: filtro,
        descricao: filtro,
      })
        .skip(skip)
        .limit(limit);
    } else {
      const tamanhoVagas = await Vaga.find({ entidadeId: id }).sort({
        dataCadastro: 1,
      });
      const vagas = await Vaga.find({ entidadeId: id }).skip(skip).limit(limit);
      res.status(200).send({ vagas: vagas, total: tamanhoVagas.length });
    }

    res.status(200).send({ vagas: vagas, total: tamanhoVagas.length });
  } catch (error) {
    res.status(404).send({ message: "Vagas não localizadas" + error });
  }
};

//LISTAR TODAS AS VAGAS DA ENTIDADE
exports.listarVagas = async (req, res) => {
  const id = req.params.id;
  const pagina = parseInt(req.params.pagina);

  let limit = 5;
  let skip = limit * (pagina - 1);
  try {
    //Busca a quantidade de vagas
    const tamanhoVagas = await Vaga.find({ entidadeId: id }).sort({
      dataCadastro: 1,
    });
    const vagas = await Vaga.find({ entidadeId: id }).skip(skip).limit(limit);
    res.status(200).send({ vagas: vagas, total: tamanhoVagas.length });
  } catch (error) {
    res.status(404).send({ message: "Vagas não localizadas" + error });
  }
};

//LISTAR VAGAS ABERTAS
exports.listarVagasAbertas = async (req, res) => {
  const id = req.params.id;
  const pagina = parseInt(req.params.pagina);

  let vagas;
  let tamanhoVagas;
  let limit = 5;
  let skip = limit * (pagina - 1);

  try {
    if (pagina == 10000) {
      vagas = await Vaga.find({ entidadeId: id })
        .where({ statusVaga: "ABERTA" })
        .sort({ dataCadastro: 1 });
      tamanhoVagas = vagas;
    } else {
      //Busca a quantidade de vagas
      tamanhoVagas = await Vaga.find({ entidadeId: id })
        .where({ statusVaga: "ABERTA" })
        .sort({ dataCadastro: 1 });
      vagas = await Vaga.find({ entidadeId: id })
        .where({ statusVaga: "ABERTA" })
        .skip(skip)
        .limit(limit);
    }
    res.status(200).send({ vagas: vagas, total: tamanhoVagas.length });
  } catch (error) {
    res.status(404).send({ message: "Vagas não localizadas" + error });
  }
};

//LISTAR VAGAS EM ANDAMENTO
exports.listarVagasAndamento = async (req, res) => {
  const id = req.params.id;
  const pagina = parseInt(req.params.pagina);

  let vagas;
  let tamanhoVagas;

  let limit = 5;
  let skip = limit * (pagina - 1);

  try {
    //Se valor For igual a 10000 ele retorna os valores sem filtros
    if (pagina == 10000) {
      vagas = await Vaga.find({ entidadeId: id })
        .where({ statusVaga: "ANDAMENTO" })
        .sort({ dataCadastro: 1 });
      tamanhoVagas = vagas;
    } else {
      //Busca a quantidade de vagas
      tamanhoVagas = await Vaga.find({ entidadeId: id })
        .where({ statusVaga: "ANDAMENTO" })
        .sort({ dataCadastro: 1 });
      vagas = await Vaga.find({ entidadeId: id })
        .where({ statusVaga: "ANDAMENTO" })
        .skip(skip)
        .limit(limit);
    }

    res.status(200).send({ vagas: vagas, total: tamanhoVagas.length });
  } catch (error) {
    res.status(404).send({ message: "Vagas não localizadas" + error });
  }
};

//LISTAR VAGAS EM APROVAÇÃO
exports.listarVagasCanceladas = async (req, res) => {
  const id = req.params.id;

  let vagas;

  try {
    vagas = await Vaga.find({ entidadeId: id })
      .where({ statusVaga: "CANCELADA" })
      .sort({ dataCadastro: -1 });

    res.status(200).send({ vagas });
  } catch (error) {
    res.status(404).send({ message: "Vagas não localizadas" + error });
  }
};

//LISTAR VAGAS EM APROVAÇÃO
exports.listarVagasAprovacao = async (req, res) => {
  const id = req.params.id;
  const pagina = parseInt(req.params.pagina);

  let vagas;
  let tamanhoVagas;

  let limit = 5;
  let skip = limit * (pagina - 1);

  try {
    //Se valor For igual a 10000 ele retorna os valores sem filtros
    if (pagina == 10000) {
      vagas = await Vaga.find({ entidadeId: id })
        .where({ statusVaga: "APROVACAO" })
        .sort({ dataCadastro: -1 });
      tamanhoVagas = vagas;
    } else {
      tamanhoVagas = await Vaga.find({ entidadeId: id })
        .where({ statusVaga: "APROVACAO" })
        .sort({ dataCadastro: -1 });
      vagas = await Vaga.find({ entidadeId: id })
        .where({ statusVaga: "APROVACAO" })
        .skip(skip)
        .limit(limit);
    }
    res.status(200).send({ vagas: vagas, total: tamanhoVagas.length });
  } catch (error) {
    res.status(404).send({ message: "Vagas não localizadas" + error });
  }
};

//VISUALIZAR DETALHES DA VAGA
exports.detalheVaga = async (req, res) => {
  try {
    const vaga = await Vaga.findById(req.params.vagaid).populate({
      path: "inscricoes",
      populate: {
        path: "estudanteId",
        select: "_id nomeCompleto nomeSocial ",
        populate: {
          path: "curso",
        },
      },
    });
    res.status(200).send(vaga);
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//VISUALIZAR DETALHES DO INSCRITO
exports.visualizarInscrito = async (req, res) => {
  try {
    const inscrito = await Estudante.findOne({ userid: req.params.inscritoid });
    return res.status(200).send(inscrito);
  } catch (error) {
    return res.status(404).send({ message: "Não localizado" + error });
  }
};

//APROVAR INSCRITO 
exports.aprovarInscrito = async (req, res) => {

  try {

    let inscricao;

    await Inscricao.updateOne(
      { _id: req.params.inscricaoid },
      { $set: { statusInscricao: "APROVADO" } }
    );

    inscricao = await Inscricao.findOne({ _id: req.params.inscricaoid }).populate({
      path:"vagaId",
      populate: {
        path: "entidadeId"
      }
    });

    console.log(inscricao.userId);

     let idRemetente = inscricao.vagaId.entidadeId._id;
     let idDestinatario = inscricao.userId;
     let titulo = "Você foi Selecionado!!";
     let mensagem = "Parabéns, você foi o selecionado para a vaga: " + inscricao.vagaId.nomeVaga;

     await Notificacao.create({
       idRemetente,
       idDestinatario,
       titulo,
       mensagem,
     });

    let quantidadeVaga = parseInt(inscricao.vagaId.numeroVagas) - 1;

    await Vaga.updateOne(
      { _id: inscricao.vagaId },
      { $set: { numeroVagas: quantidadeVaga } }
    );
    

    if(quantidadeVaga == 0){
      await Vaga.updateOne(
        { _id: inscricao.vagaId },
        { $set: { statusVaga: "ANDAMENTO" } }
      );

      return res.status(200).send({ message: "Inscrição aprovada com sucesso, Vaga Finalizada!" });
    }else{
      console.log(quantidadeVaga);
      return res.status(200).send({ message: "Inscrição aprovada com sucesso!" });    
    }
  
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

//REPROVAR INSCRITO
exports.reprovarInscrito = async (req, res) => {
  try {
    await Inscricao.updateOne(
      { _id: req.params.inscricaoid },
      { $set: { statusInscricao: "REPROVADO" } }
    );
    return res
      .status(200)
      .send({ message: "Inscrição reprovada com sucesso!" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

exports.finalizarInscricaoVaga = async (req, res) => {
  try {
    await Vaga.findByIdAndUpdate(
      { _id: req.params.vagaid },
      { $set: { statusVaga: "ANDAMENTO" } }
    );
    return res
      .status(200)
      .send({ message: "Período de inscrição finalizado com sucesso!" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

//CANCELAR VAGA
exports.cancelarVaga = async (req, res) => {
  try {
    const vaga = await Vaga.findById(req.params.vagaid);
    if (vaga.statusVaga == "ANDAMENTO") {
      return res
        .status(422)
        .send({ message: "Não é possível cancelar vagas em andamento!" });
    }
    vaga.statusVaga = "CANCELADA";
    vaga.save();
    return res.status(200).send({ message: "Vaga cancelada com sucesso!" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};
