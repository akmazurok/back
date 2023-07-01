var mongoose = require("mongoose");
const Certificado = require("../models/certificado");
const Estudante = require("../models/usuario").Estudante;
const PDFPrinter = require("pdfmake");
const fs = require("fs");

exports.validarCertificado = async (req, res) => {
  const codigo = req.body.codigo;
  try {
    const certificado = await Certificado.find({ codigoVerificacao: codigo })
      .populate({
        path: "idInscricao",
        select: "vagaId",
        populate: {
          path: "vagaId",
          select: "nomeVaga",
        },
      })
      .populate({
        path: "idEntidade",
        select: "razaoSocial nomeFantasia userid",
        populate: {
          path: "userid",
          select: "login",
        },
      });
      
    const estudante = await Estudante.findOne({ _id: certificado.idEstudante });

    let nome = estudante.nomeCompleto;
    let nomeVaga = certificado.idInscricao.vagaId.nomeVaga;
    let nomeEntidade = certificado.idEntidade.razaoSocial;
    let cnpj = formataCNPJ(certificado.idEntidade.userid.login);
    let cargaHoraria = certificado.cargaHoraria;
    let dataInicio = certificado.dataInicio.toLocaleDateString("pt-BR");
    let dataFim = certificado.dataFim.toLocaleDateString("pt-BR");

    res
      .status(200)
      .send({
        nome,
        nomeVaga,
        nomeEntidade,
        cnpj,
        cargaHoraria,
        dataInicio,
        dataFim,
        message: "Validado com Sucesso!",
      });
  } catch (err) {
    res.status(500).send({ message: "Código de verificação não encontrado!" });
  }
};

exports.listarCertificados = async (req, res) => {
  const estudante = await Estudante.findOne({ userid: req.params.id });

  const certificado = await Certificado.find({ idEstudante: estudante._id })
    .populate({
      path: "idInscricao",
      select: "vagaId",
      populate: {
        path: "vagaId",
        select: "nomeVaga",
      },
    })
    .populate({
      path: "idEntidade",
      select: "razaoSocial nomeFantasia userid",
      populate: {
        path: "userid",
        select: "login",
      },
    });

  try {
    res.status(200).send({ certificado });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Não foi possível completar a operação" + error });
  }
};

exports.gerarCertificado = async (req, res) => {
  const estudante = await Estudante.findOne({ userid: req.params.id }).populate(
    {
      path: "userid",
      select: "login",
    }
  );

  const certificado = await Certificado.findOne({
    _id: req.params.idCertificado,
  })
    .populate({
      path: "idInscricao",
      select: "vagaId",
      populate: {
        path: "vagaId",
        select: "nomeVaga",
      },
    })
    .populate({
      path: "idEntidade",
      select: "razaoSocial nomeFantasia userid",
      populate: {
        path: "userid",
        select: "login",
      },
    });

  //Criando a data e hora da emissão do formulário
  var dataAtual = new Date();
  var dia = dataAtual.getDate();
  var mes = dataAtual.getMonth() + 1;
  var ano =
    dataAtual.getFullYear() < 10
      ? "0" + dataAtual.getFullYear()
      : dataAtual.getFullYear();
  var horas = dataAtual.getHours();
  var minutos = dataAtual.getMinutes();

  let data = `${dia}/${mes}/${ano} - ${horas}:${minutos}h`;

  //Campos do Formulário
  let nome = estudante.nomeCompleto;
  let nomeVaga = certificado.idInscricao.vagaId.nomeVaga;
  let cpf = formataCPF(estudante.userid.login);
  let nomeEntidade = certificado.idEntidade.razaoSocial;
  let cnpj = formataCNPJ(certificado.idEntidade.userid.login);
  let cargaHoraria = certificado.cargaHoraria;
  let dataInicio = certificado.dataInicio.toLocaleDateString("pt-BR");
  let dataFim = certificado.dataFim.toLocaleDateString("pt-BR");
  let codigoValidacao = certificado.codigoVerificacao;

  const chunks = [];

  var fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };

  var printer = new PDFPrinter(fonts);
  const docDefinition = (TDocumentDefinitions = {
    header: [
      {
        stack: ["Estudante Voluntário"],
        style: "logo",
        margin: [10, 10],
      },
    ],
    content: [
      {
        stack: ["Declaração de Participação"],
        style: "header",
      },
      {
        text: [
          "Declaramos para fins de cômputo e aproveitamento de horas para Atividades Curriculares",
          "complementares que ",
          { text: nome, bold: true, fontSize: 15 },
          ", do CPF Nº: ",
          { text: cpf, fontSize: 15, bold: true },
          " do curso de ",
          "graduação Análise e Desenvimento de Sistemas, participou como voluntário na atividade: ",
          { text: nomeVaga, fontSize: 15, bold: true },
          ", realizada na entidade ",
          { text: nomeEntidade, fontSize: 15, bold: true },
          ", CNPJ: ",
          { text: cnpj, bold: true, fontSize: 15 },
          " com carga horária de ",
          "",
          { text: cargaHoraria, bold: true, fontSize: 15 },
          " horas, no período de ",
          { text: dataInicio, fontSize: 15, bold: true },
          " até ",
          { text: dataFim, fontSize: 15, bold: true },
          ".",
        ],
        style: "body",
      },
    ],
    footer: [
      {
        stack: [`Código de validação: ${codigoValidacao}`],
        style: "",
        margin: [10, 0],
      },
      {
        stack: [`Emissão em: ${data}`],
        style: "",
        margin: [10, 5],
      },
    ],
    styles: {
      logo: {
        fontSize: 25,
        color: "#1265a2",
      },
      top_header: {
        alignment: "left",
      },
      header: {
        fontSize: 32,
        alignment: "center",
        margin: [0, 100, 0, 50],
      },
      body: {
        alignment: "center",
        fontSize: 14,
        lineHeight: 1.5,
      },
      footer: {
        fontSize: 14,
        lineHeigth: 21,
      },
    },
    pageOrientation: "landscape",
    pageSize: "A4",
    margin: [40, 60],
    defaultStyle: {
      font: "Helvetica",
    },
  });
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.on("data", (chunk) => {
    chunks.push(chunk);
  });

  pdfDoc.end();
  pdfDoc.on("end", () => {
    let result = Buffer.concat(chunks);
    res.end(result);
  });
};

function formataCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, "");
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formataCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]/g, "");
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}
