const Usuario = require("../models/usuario");

//TO DO - /login /token

//CADASTRAR
exports.cadastrar = async (req, res) => {
  //  const { documento } = req.body;

  try {
    //  if (await Usuario.findOne({ documento }))
    //    return res.status(400).send({ error: "Documento já cadastrado" });

    const usuario = await Usuario.create(req.body);
    usuario.senha = undefined;

    return res.status(201).send({ usuario });
  } catch (error) {
    return res.status(400).send({ error: "Erro ao realizar o cadastro" });
  }
};

//USUARIO POR ID
exports.usuario = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ _id: req.params.id });
    res.status(200).send(usuario);
  } catch (error) {
    res.status(500).send({ erro: error });
  }
};

//LOGIN
exports.login = async (req, res) => {
  try {
    
  } catch (error) {}
};

//UPDATE USUARIO
/* exports.editar = async (req, res) => {
  const usuario = req.body;
   try {
    await Usuario.updateOne(
      { _id: req.params.id },
   
    );
    return res.status(200).send({ usuario });
  } catch (error) {
    return res.status(400).send({ error: "Erro ao realizar o cadastro" });
  }
}; */
