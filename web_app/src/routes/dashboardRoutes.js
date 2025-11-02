/**
 * Rotas do dashboard
 * Gerencia as rotas relacionadas à página de dashboard do usuário
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * Rota para o dashboard
 * Renderiza a página do dashboard com as funcionalidades baseadas nas permissões do usuário
 */
router.get('/', authMiddleware, (req, res) => {
    res.render('pages/dashboard', {
        title: 'Dashboard',
        user: JSON.parse(req.cookies.user)
    });
});

module.exports = router;