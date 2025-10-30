/**
 * Validadores para Planos
 * Define as regras de validação para operações com planos
 */

const { body } = require('express-validator');

// Validações para criação de plano
const validarCriacaoPlano = [
    body('nome')
        .notEmpty().withMessage('O nome do plano é obrigatório')
        .isString().withMessage('O nome deve ser uma string')
        .isLength({ min: 3, max: 100 }).withMessage('O nome deve ter entre 3 e 100 caracteres'),
    
    body('descricao')
        .notEmpty().withMessage('A descrição do plano é obrigatória')
        .isString().withMessage('A descrição deve ser uma string')
        .isLength({ min: 10, max: 500 }).withMessage('A descrição deve ter entre 10 e 500 caracteres'),
    
    body('valor')
        .notEmpty().withMessage('O valor do plano é obrigatório')
        .isFloat({ min: 0 }).withMessage('O valor deve ser um número positivo'),
    
    body('duracao')
        .notEmpty().withMessage('A duração do plano é obrigatória')
        .isInt({ min: 1 }).withMessage('A duração deve ser um número inteiro positivo'),
    
    body('modalidades')
        .isArray().withMessage('As modalidades devem ser um array')
        .optional(),
    
    body('ativo')
        .isBoolean().withMessage('O status ativo deve ser um booleano')
        .optional()
];

// Validações para atualização de plano
const validarAtualizacaoPlano = [
    body('nome')
        .optional()
        .isString().withMessage('O nome deve ser uma string')
        .isLength({ min: 3, max: 100 }).withMessage('O nome deve ter entre 3 e 100 caracteres'),
    
    body('descricao')
        .optional()
        .isString().withMessage('A descrição deve ser uma string')
        .isLength({ min: 10, max: 500 }).withMessage('A descrição deve ter entre 10 e 500 caracteres'),
    
    body('valor')
        .optional()
        .isFloat({ min: 0 }).withMessage('O valor deve ser um número positivo'),
    
    body('duracao')
        .optional()
        .isInt({ min: 1 }).withMessage('A duração deve ser um número inteiro positivo'),
    
    body('modalidades')
        .optional()
        .isArray().withMessage('As modalidades devem ser um array'),
    
    body('ativo')
        .optional()
        .isBoolean().withMessage('O status ativo deve ser um booleano')
];

module.exports = {
    validarCriacaoPlano,
    validarAtualizacaoPlano
};