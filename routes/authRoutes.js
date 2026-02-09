const express = require('express');
const router = express.Router();
const { registro, login } = require('../controllers/authController');

// Ruta de registro
router.post('/registro', registro);

// Ruta de login
router.post('/login', login);

module.exports = router;
