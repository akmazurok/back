var mongoose = require("mongoose");
const Entidade = require("../models/usuario").Entidade;
const Estudante = require("../models/usuario").Estudante;
const TermoAdesao = require("../models/termoAdesao");
const Inscricao = require("../models/inscricao");
const Vaga = require("../models/vaga");
const Certificado = require("../models/certificado");
const termoAdesao = require("../models/termoAdesao");

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
      "nomeVaga descricao requisitos dataInicioTrabalho dataEncerramentoTrabalho diasTrabalho horarioInicioTrabalho horarioEncerramentoTrabalho"
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
  let cargaHoraria = 0;
  let dataInicio = 0;
  let dataFim = 0;
  let datas = ['0','1','2','3','4','5','6'];

  try {
    const termo = await TermoAdesao.findByIdAndUpdate(
      { _id: req.params.termoid },
      { $set: { rescisaoTermo: Date.now() } }
    );
    
    let inscricao = null;

     await Inscricao.findByIdAndUpdate(
       { _id: termo.idInscricao },
       { $set: { statusInscricao: "ENCERRADO", dataEncerramentoTrabalho: Date.now() } }
     );

    inscricao = await Inscricao.findById(termo.idInscricao);
    vaga = await Vaga.findOne({ _id: inscricao.vagaId });
    // datas = datas.filter( function( el ) {
    //   return vaga.diasTrabalho.indexOf( el ) < 0;
    // });

    if(vaga.diasTrabalho.length != 0){
      datas = vaga.diasTrabalho;
    }

    console.log('vagas dias de trabalho');
    console.log(vaga.diasTrabalho);

    console.log('as datas');
    console.log(datas);

    dataBegin = JSON.stringify(inscricao.dataInicioTrabalho).substring(0,11);
    console.log('Data Begin');
    console.log(dataBegin);
    dataEnd = JSON.stringify(inscricao.dataEncerramentoTrabalho).substring(0,11);
    console.log('Data End');
    console.log(dataEnd);

    datasSel = getWeekDayList(dataBegin, 
    dataEnd, datas);

    dataInicio = parseInt(vaga.horarioInicioTrabalho.split(':')[0]);
    dataFim = parseInt(vaga.horarioEncerramentoTrabalho.split(':')[0]);
    console.log('HoraInicial');
    console.log( parseInt(vaga.horarioInicioTrabalho.split(':')[0]) );
    console.log('HoraFim');
    console.log( parseInt(vaga.horarioEncerramentoTrabalho.split(':')[0]) );

    (dataInicio > dataFim) ? cargaHoraria = dataInicio - dataFim : cargaHoraria = dataFim - dataInicio;    

      console.log("Carga Horária");
      console.log(cargaHoraria);

    //dados para certificado
    const nomeEntidade = await Entidade.findById(termo.idEntidade).select(
      "razaoSocial"
    );

    const estudante = await Estudante.findById(
      termo.idEstudante
    ).populate({
      path: "userid",
      select: "nome"
    });

    //Vai gerar um código de verificação
    let codigoVerificacao = novaSenha = Math.random().toString(36).substring(0, 12);

     const horasTotais = (parseInt(cargaHoraria) != 0 ) ? datasSel.length * cargaHoraria : 0;
     console.log('Dias trabalhados');
     console.log(horasTotais/9);
     const certificado = new Certificado();
     certificado.nomeEntidade = nomeEntidade;
     certificado.nomeEstudante = estudante.userid.nome;
     certificado.cargaHoraria = horasTotais;
     certificado.idInscricao = termo.idInscricao;
     certificado.idEstudante = termo.idEstudante;
     certificado.idEntidade = termo.idEntidade;
     certificado.dataInicio = inscricao.dataInicioTrabalho;
     certificado.dataFim = inscricao.dataEncerramentoTrabalho;
     certificado.codigoVerificacao = codigoVerificacao;
     certificado.save();
    res
      .status(200)
      .send({ message: "Termo de Adesão rescindido com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível completar a operação" + error });
  }
};

function calcularHoras(inscricao) {
  var dataInicio = inscricao.dataInicioTrabalho;
  var dataFim = inscricao.dataEncerramentoTrabalho;
  var diasTrabalho = inscricao.diasTrabalho;
  var horasTotais = null;

  //calcular horas totais
  return horasTotais;
}

function getWeekDayList(startDate, endDate, datas) {
  let days = []
  let end = new Date(endDate);
  for (let start = new Date(startDate); start <= end; start.setDate(start.getDate() + 1)) {
    for(let i = 0; i < datas.length; i++)
      {
        let day = start.getDay();   
        if (day == parseInt(datas[i]))
          {
            days.push(new Date(start));

          }
      }       
  }
  return days;
}