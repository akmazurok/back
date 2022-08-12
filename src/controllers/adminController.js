const Usuario = require("../models/usuario").Usuario;
const Entidade = require("../models/usuario").Entidade;
const Estudante = require("../models/usuario").Estudante;
const Admin = require("../models/usuario").Admin;
const Vaga = require("../models/vaga");


//TO-DO - /retornar usuario /deletar entidade /aprovarvaga /aprovarcadastro

//RETORNAR TODOS OS USUARIOS - OK
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).send({ usuarios });
  } catch (error) {
    res.status(500).send({ message: "Usuários não localizados" + error });
  }
};

//RETORNAR TODOS AS ENTIDADES - OK
exports.listarEntidades = async (req, res) => {
  try {
	//ordena por cadastro pendente
    const entidades = await Entidade.find().sort('-situacaoCadastro');
    res.status(200).send({ entidades });
  } catch (error) {	
    res.status(500).send({ message: "Entidades não localizadas" + error });
  }
};

//RETORNAR TODOS OS ESTUDANTES - OK
exports.listarEstudantes = async (req, res) => {
  try {
    const estudantes = await Estudante.find().sort('-situacaoCadastro');
    res.status(200).send({ estudantes });
  } catch (error) {
    res.status(500).send({ message: "Usuários não localizados" + error });
  }
};

//RETORNAR TODOS OS ADMINS - OK
exports.listarAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).send({ admins });
  } catch (error) {
    res.status(500).send({ message: "Usuários não localizados" + error });
  }
};

//RETORNAR TODAS AS VAGAS - OK
exports.listarVagas = async (req, res) => {
  try {
    const vagas = await Vaga.find().sort('-statusAprovacao');
    res.status(200).send({ vagas });
  } catch (error) {
    res.status(500).send({ message: "Usuários não localizados" + error });
  }
};

//APROVAR VAGA - OK
exports.aprovarVaga = async (req, res) => {
  const vaga = req.body;
  vaga.statusAprovacao = "Ativa";
  vaga.statusVaga = "Ativa";
  
  try {
    await Vaga.updateOne({ _id: req.params.id }, vaga);
    return res.status(200).send({ message: "Vaga aprovada com sucesso!" });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

//CADASTRAR ADMIN - OK
exports.cadastrar = async (req, res) => {
  //Confere se o cpf ou cnpj ja esta cadastrado
  const { documento, email, senha, acesso } = req.body;

  try {
    //  if (await Usuario.findOne({ documento }))
    //    return res.status(400).send({ error: "Documento já cadastrado" });
    const usuario = await Usuario.create({ documento, email, senha, acesso });
    usuario.senha = undefined;
    const userid = usuario.id;

	const cadastro = new Admin(req.body);
	cadastro.userid = userid;
    await cadastro.save();
	
    return res.status(201).send({ usuario , cadastro });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Erro ao realizar o cadastro " + error });
  }
};



/* //RETORNA USUARIO ESPECIFICO
router.get("/:id_usuario", (req, res, next) => {
  const id = req.params.id_usuario;
  res.status(200).send({
    message: "retorna o usuario por id",
    id_usuario: id,
  });
});


//ALTERA USUARIO
router.patch("/", (req, res, next) => {
  res.status(201).send({
    message: "Usuario alterado com sucesso",
  });
});

//DELETA USUARIO
router.delete("/", (req, res, next) => {
  res.status(201).send({
    message: "usando delete",
  });
});
 */

//aprovar --- put aprovar find() status=pendente