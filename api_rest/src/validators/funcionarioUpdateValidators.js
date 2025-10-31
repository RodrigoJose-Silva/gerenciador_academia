/**
 * Validadores para Atualização de Funcionário
 * Define todas as regras de validação para os campos do funcionário durante atualização
 */

const { body, validationResult } = require('express-validator');
const { PERFIS } = require('../models/Permissions');

const funcionarioUpdateValidators = [
    // Email (opcional)
    body('email')
        .optional()
        .trim()
        .isLength({ max: 150 }).withMessage('Email deve ter no máximo 150 caracteres')
        .isEmail().withMessage('Email inválido'),

    // Telefone (opcional)
    body('telefone')
        .optional()
        .trim()
        .isLength({ max: 11 }).withMessage('Telefone deve ter no máximo 11 dígitos')
        .matches(/^\d+$/).withMessage('Telefone deve conter apenas números'),

    // Cargo (opcional)
    body('cargo')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Cargo deve ter no máximo 100 caracteres')
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('Cargo deve conter apenas letras e espaços'),

    // Perfil (opcional)
    body('perfil')
        .optional()
        .isIn(Object.values(PERFIS)).withMessage('Perfil inválido. Use: ADMINISTRADOR, GERENTE, INSTRUTOR ou RECEPCIONISTA'),

    // Salário (opcional)
    body('salario')
        .optional()
        .isFloat({ min: 0 }).withMessage('Salário deve ser um número positivo')
];

// Validação de resultados
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Erro de validação',
            errors: errors.array()
        });
    }
    next();
};

module.exports = {
    funcionarioUpdateValidators,
    validate
};