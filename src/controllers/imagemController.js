const Imagem = require("../models/image");

//arrumar o delete para apagar do localstorage e do aws

//UPLOAD DE IMAGEM
exports.uploadImagem = async (req, res) => {
  const{ originalname: name, size, key, location: url = ''} = req.file;
  try {
    const imagem = await Imagem.create({ 
      name,
      size,
      key,
      url
    });
    return res.status(201).send(imagem);
  } catch (error) {
    return res.status(500).send(error);
  }
};

//LISTAR IMAGENS
exports.imagens = async (req, res) => {
  try {
    const imagens = await Imagem.find();
     return res.status(201).send(imagens);
  } catch (error) {
    return res.status(500).send(error);
  }
};

//DELETAR IMAGEM - ARRUMAR
exports.excluirImagem = async (req, res) => {
    try {
      const imagem = await Imagem.findById(req.params.id);
      await imagem.remove();
       return res.status(201).send("Imagem excluída com sucesso!");
    } catch (error) {
      return res.status(500).send(error);
    }
  };
