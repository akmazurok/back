const Arquivo = require("../models/upload");

//UPLOAD DE IMAGEM - OK
exports.uploadArquivo = async (req, res) => {
  const{ originalname: name, size, key, location: url = ""} = req.file;
  try {
    const imagem = await Arquivo.create({ 
      file,
      fileName,
      contentType
    });
    return res.status(201).send(imagem);
  } catch (error) {
    return res.status(500).send(error);
  }
};

//LISTAR IMAGENS - OK
exports.arquivos = async (req, res) => {
  try {
    const imagens = await Arquivo.find();
     return res.status(201).send(imagens);
  } catch (error) {
    return res.status(500).send(error);
  }
};

//DELETAR IMAGEM - OK
exports.excluirArquivo = async (req, res) => {
    try {
      const imagem = await Arquivo.findById(req.params.id);
      await imagem.remove();
       return res.status(201).send("Imagem excluída com sucesso!");
    } catch (error) {
      return res.status(500).send(error);
    }
  };
