var mongoose = require("mongoose");
const Certificado = require("../models/certificado");

//import PDFPrinter from "pdfmake";

const PDFPrinter = require('pdfmake');
const fs = require('fs');

exports.gerarCertificado = async(req,res) => {

  var dataAtual = new Date();
  var dia = dataAtual.getDate();
  var mes = (dataAtual.getMonth() + 1);
  var ano = dataAtual.getFullYear() < 10 ? '0' + dataAtual.getFullYear() : dataAtual.getFullYear();
  var horas = dataAtual.getHours();
  var minutos = dataAtual.getMinutes();

  let data = `${dia}/${mes}/${ano} - ${horas}:${minutos}h`;

  let valor = "123456";

  const chunks = [];

  var fonts = {
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique'
    },
  };
  
  var printer = new PDFPrinter(fonts);  
   const docDefinition = TDocumentDefinitions = {
    
    header: [
        {
            stack: [
       'Estudante Voluntário'
     ],
     style: 'logo',
     margin: [10,10]
        }
    ],
    content: [
        
       {
     stack: [
       'Declaração de Participação',
     ],
     style: 'header'
   },
     {
       text: [
         'Declaramos para fins de cômputo e aproveitamento de horas para Atividades Curriculares', 
         'complementares que ',{text: 'Gustavo de Oliveira Achinitz', bold:true, fontSize:15}, ', ',{text: 'do CPF Nº: XXX.XXX.XXX-XX', fontSize:15,bold:true},' do curso de ', 
         'graduação Análise e Desenvimento de Sistemas, participou como voluntário na atividade: Amigos do', 
         'Bem, realizada na entidade' ,{ text:' Amigos do HC', fontSize: 15, bold:true }, ', CNPJ: ',{text: 'XXX.XXXX.XXXXX.XXX-X',bold:true,fontSize:15}, ' com carga horária de ', 
         '',{text:'20 horas', bold:true, fontSize:15},', no período de ' ,{text: '02/03/2023', fontSize:15, bold: true},' até ' ,{text: '05/03/2023', fontSize:15, bold: true},'.',
         ]   
       ,style: 
         'body'
     },  
    ],
    footer: [
       {
     stack: [
       'Código de validação: '
     ],
     style: '',
     margin: [10,0]
   },
    {
     stack: [
       `Emissão em: ${data}`,
     ],
     style: '',
     margin: [10,5]
   },
    ],
    styles: {
       logo:{
         fontSize: 25,  
         color: '#1265a2'
       },
       top_header: {
           alignment: 'left', 
       },
   header: {
     fontSize: 32,
     alignment: 'center',
           margin: [0, 100, 0, 50]
   },
       body: {
       alignment: 'center',
       fontSize: 14,
       lineHeight: 1.5
       },
       footer: {
           fontSize: 14,
           lineHeigth: 21,
       },
   },  
   pageOrientation: 'landscape',   
   pageSize: 'A4',
   margin: [40,60],
   defaultStyle: {
       font: 'Helvetica'
     }
}


  // var docDefinition = {
  //   content: [
  //     'First paragraph',
  //     'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines',
  //   ],
  //   defaultStyle: {
  //     font: 'Helvetica'
  //   }
  // };
  
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  // pdfDoc.pipe(fs.createWriteStream('document.pdf'));
  pdfDoc.on("data", (chunk) => {
    chunks.push(chunk);
  });

  pdfDoc.end();

  pdfDoc.on("end", () => {
    let result = Buffer.concat(chunks);
    res.end(result);
  });

  console.log('deu boa');
}

exports.gerarCertificado1 = async (req, res) => {
  try {

    var pdf = require("html-pdf");

    config = {
        "orientation": "landscape",
        "border": {
            "top": "1in",            // default is 0, units: mm, cm, in, px
            "right": "1in",
            "bottom": "1in",
            "left": "1.5in"
          },
          "header": {
            "height": "10mm",
            "contents": '<h1>Certificado de Participação</h1>'
          },
      }
    var conteudo = 
          `
          <style>
              h1{
                  font-size: 40px;
                  text-align: center;
              }
          </style>
          `;
              pdf.create(conteudo,config).toStream((err, stream) => {
                stream.pipe(fs.createWriteStream('./foo.pdf'));
              })
    //     pdf.create(conteudo, config).toFile('./MeuPrimeiroPDF.pdf', (err,res) => {
    //     if(err){
    //         console.log('Um erro aconteceu');
    //     }else{
    //         console.log(res);
    //     }
    // });
    var data = fs.readFileSync('utput.pdf');  
    console.log(data);
    res.contentType("application/pdf");
    res.send(data);



    res.status(200).send({ message: "Notificação gerada com sucesso!" });
  } catch (error) {
    res.status(400).send({ message: "Erro ao gerar a notificação " + error });
  }
};

