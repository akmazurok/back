const Vaga = require("../models/vaga");
const Notificacao = require("../models/notificacao");
const Inscricao = require("../models/inscricao");
const cron = require('node-cron');

const verificaCron = async () => {
       //cron.schedule('0 0 4 1/1 * *', validaVagasEncerradas).start();
       cron.schedule('* */1 * * * *', validaVagasEncerradas).start();
       //Site para Criar Crons http://www.cronmaker.com/?0
}
module.exports = {
    verificaCron
};

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