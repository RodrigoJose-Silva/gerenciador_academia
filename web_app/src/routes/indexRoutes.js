/**
 * Rotas para a página inicial
 * Gerencia as rotas relacionadas à página inicial da aplicação
 */

const express = require('express');
const router = express.Router();
const redirectIfAuthenticated = require('../middlewares/redirectIfAuthenticated');

/**
 * Rota para a página inicial
 * Renderiza a página inicial da aplicação
 * Redireciona para o dashboard se o usuário já estiver logado
 */
router.get('/', redirectIfAuthenticated, (req, res) => {
  res.render('pages/index', {
    title: 'Início',
    user: req.cookies.user ? JSON.parse(req.cookies.user) : null
  });
});

module.exports = router;