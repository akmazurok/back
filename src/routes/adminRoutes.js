const express = require("express");
const router = express.Router();

const adminController = require('../controllers/adminController');

router.get("/usuarios", adminController.listarUsuarios);

module.exports = router;