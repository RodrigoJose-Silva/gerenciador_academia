/**
 * Rotas de autenticação
 * Gerencia as rotas relacionadas à autenticação de usuários
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Rota para a página de login
 * Renderiza o formulário de login
 */
router.get('/login', authController.loginPage);

/**
 * Rota para processar o login
 * Recebe os dados do formulário e tenta autenticar o usuário
 */
router.post('/login', authController.login);

/**
 * Rota para logout
 * Encerra a sessão do usuário
 */
router.get('/logout', authController.logout);

module.exports = router;