/**
 * Rotas de Autenticação
 * Define os endpoints para login de funcionários
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body, validationResult } = require('express-validator');

// Validadores para login
const loginValidators = [
    body('userName')
        .trim()
        .notEmpty().withMessage('UserName é obrigatório'),

    body('senha')
        .notEmpty().withMessage('Senha é obrigatória')
];

const validateLogin = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Erro de validação',
            errors: errors.array()
        });
    }
    next();
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza login de funcionário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação
 *                 funcionario:
 *                   $ref: '#/components/schemas/Funcionario'
 *       401:
 *         description: Credenciais inválidas
 *       403:
 *         description: Conta bloqueada
 */
router.post('/login', loginValidators, validateLogin, authController.login);

module.exports = router;
