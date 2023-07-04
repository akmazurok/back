const Vaga = require("../models/vaga");
const Notificacao = require("../models/notificacao");
const Estudante = require("../models/usuario").Estudante;
const Inscricao = require("../models/inscricao");

const cron = require('node-cron');
const nodemailer = require("nodemailer");

const verificaCron = async () => {
       //cron.schedule('* * 0/24 * * *', validaVagasEncerradas).start();
       cron.schedule('* 0/1 * * * *', async () => {
        await validarVagasIniciadas();
        await enviarEmailNotificacaoVaga();        
        await validarVagasParaFechar();
        await validaVagasEncerradas()
       }).start();
       //Site para Criar Crons http://www.cronmaker.com/?0
}
module.exports = {
    verificaCron
};

async function enviarEmailNotificacaoVaga(){
        
    //Dados para criar as datas
    const date = new Date();
    date.setDate(date.getDate() + 1);
    let diaComecoTrabalho = JSON.stringify(date).substring(1,11);

    let mensagem = "Prezado, Estudante. Seu Trabalho voluntário começa amanhã, dia: " + diaComecoTrabalho;
    let inscricoes = await Inscricao.find({ dataInicioTrabalho: diaComecoTrabalho }).populate({
        path: "vagaId"
    });   

    //Percorrendo a lista de Inscricoes e Atualizando as Datas que começam hoje
    inscricoes.forEach( async (data) => {

        //Buscando o Estudante para pegar o e-mail
        let estudante = await Estudante.findOne({ id: data.estudanteId });

        //Dados Para a Mensagem de Notificação
        let idRemetente = data.vagaId.entidadeId;
        let idDestinatario = data.estudanteId;
        let titulo = 'Inicio de Trabalho - ' + data.vagaId.nomeVaga;        
        
        //Está disparando muitos e-mail's e notificações
        await Notificacao.create({ idRemetente, idDestinatario, titulo, mensagem,});
        enviarEmail(estudante.email.trim(), diaComecoTrabalho);
    } );

}

async function validarVagasIniciadas(){
    //Dados para criar as datas
    const date = new Date();
    let diaAtual = JSON.stringify(date).substring(1,11);
    let inscricoes = await Inscricao.find({ dataInicioTrabalho: diaAtual });
    //Percorrendo a lista de Inscricoes e Atualizando as Datas que começam hoje
    inscricoes.forEach( async (data) => {
        await Inscricao.updateOne(
            { _id: data._id },
            { $set: { statusInscricao: "ANDAMENTO" } }
            );

        await Vaga.updateOne(
            { _id: data.vagaId },
            { $set: { statusVaga: "ANDAMENTO" } }
        );
    } );
}

async function validarVagasParaFechar(){
    //Mensagem para Notificacao    
    let mensagem = "Vaga finalizada, verifique seus certificados para fazer o download!";
    //Dados para criar as datas
    const date = new Date();
    let diaAtual = JSON.stringify(date).substring(1,11);
    //Pegando as Listas com as Vagas
    let vagas = await Vaga.find({ dataEncerramentoTrabalho: diaAtual, statusVaga: "ANDAMENTO" });
    let inscricoes = await Inscricao.find({ dataEncerramentoTrabalho: diaAtual, statusInscricao: "ANDAMENTO" }).populate({
        path: "vagaId"
    });
    //Percorrendo a lista de Vagas para Incluir o estado de encerrado quando a vaga for finalizada
    vagas.forEach( async (data) => {
         await Vaga.updateOne(
             { _id: data._id },
             { $set: { statusInscricao: "ENCERRADO" } }
             );
        });
    //Percorrendo a lista de Inscrições para Incluir o estado de encerrado quando a vaga for finalizada
    inscricoes.forEach( async (data) => {
        //Alterando os valores para enviar notificação
        let idRemetente = data.vagaId.entidadeId;
        let idDestinatario = data.estudanteId;
        let titulo = "Vaga " + data.vagaId.nomeVaga + " Finalizada!";
         await Inscricao.updateOne(
             { _id: data._id },
             { $set: { statusInscricao: "ENCERRADO" } }
         );
         await Notificacao.create({ idRemetente, idDestinatario, titulo, mensagem,});
    });
}

async function validaVagasEncerradas(){
    //Dados Para a Mensagem de Notificação
    let idRemetente;
    let idDestinatario;
    let titulo;
    let mensagem = "Vaga excluida, pois não tinha inscritos! Cadastre Novamente";
    //Dados para criar as datas
    const date = new Date();
    let diaAtual = JSON.stringify(date).substring(1,11);
    let listaVagasFinalizadas = await Vaga.find({ dataFinalizacaoVaga: diaAtual});
        listaVagasFinalizadas.forEach( async (vaga) => {
            idRemetente = vaga.entidadeId;
            idDestinatario = vaga.entidadeId;
            titulo = "Vaga: " + vaga.nomeVaga + " foi excluida :(";
            let totalVagas = await Inscricao.find({ vagaId: vaga._id });
            if(totalVagas.length == 0){
              await Notificacao.create({ idRemetente, idDestinatario, titulo, mensagem,});
              await Vaga.deleteOne({ _id: vaga._id });
            }else{
                await Vaga.updateOne(
            { _id: vaga._id },
            { $set: { statusVaga: "ANDAMENTO" } }
            );
            }   
        })
}

function enviarEmail(data,dataTrabalho){     
      // Configurando o e-mail
      const transport = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        auth: {
          user: "testeparaotcc@outlook.com",
          pass: "Ufpr@123",
        },
      });
      // Vai fazer o envio do e-mail
      transport
        .sendMail({
          from: "Estudante Voluntário <testeparaotcc@outlook.com>",
          to: data,
          subject: "Lembrete Inicio de Trabalho - Estudante Voluntário",
          html: `
          <h2>Olá, Futuro Voluntário! </h2>        
          <p>Lembrando que seu trabalho voluntário começa amanhã!! Lembre-se de chegar no horário e levar seus documentos: RG e CPF</p>          
      `,
        });
  }