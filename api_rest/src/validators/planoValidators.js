/**
 * Validadores para Planos
 * Define as regras de validação para operações com planos
 * 
 * @example
 * {
 *   "nome": "PLANO_PREMIUM",
 *   "modalidades": ["Acesso completo à academia e aulas"],
 *   "valor": 150.00,
 *   "duracao": 30,
 *   "beneficios": ["Acesso ilimitado", "Aulas coletivas", "Avaliação física mensal"]
 * }
 */

const { body } = require('express-validator');

// Validações para criação de plano
const validarCriacaoPlano = [
    body('nome')
        .notEmpty().withMessage('O nome do plano é obrigatório')
        .isString().withMessage('O nome deve ser uma string')
        .isLength({ min: 3, max: 100 }).withMessage('O nome deve ter entre 3 e 100 caracteres'),

    body('modalidades')
        .notEmpty().withMessage('As modalidades são obrigatórias')
        .isArray().withMessage('As modalidades devem ser um array')
        .custom((value) => {
            if (!value || value.length === 0) {
                throw new Error('É necessário especificar pelo menos uma modalidade');
            }
            return true;
        }),

    body('valor')
        .notEmpty().withMessage('O valor do plano é obrigatório')
        .isFloat({ min: 0 }).withMessage('O valor deve ser um número positivo'),

    body('duracao')
        .notEmpty().withMessage('A duração do plano é obrigatória')
        .isInt({ min: 1 }).withMessage('A duração deve ser um número inteiro positivo'),

    body('beneficios')
        .notEmpty().withMessage('Os benefícios são obrigatórios')
        .isArray().withMessage('Os benefícios devem ser um array')
        .custom((value) => {
            if (!value || value.length === 0) {
                throw new Error('É necessário especificar pelo menos um benefício');
            }
            return true;
        }),

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

    body('modalidades')
        .optional()
        .isArray().withMessage('As modalidades devem ser um array')
        .custom((value) => {
            if (value && value.length === 0) {
                throw new Error('É necessário especificar pelo menos uma modalidade');
            }
            return true;
        }),

    body('valor')
        .optional()
        .isFloat({ min: 0 }).withMessage('O valor deve ser um número positivo'),

    body('duracao')
        .optional()
        .isInt({ min: 1 }).withMessage('A duração deve ser um número inteiro positivo'),

    body('beneficios')
        .optional()
        .isArray().withMessage('Os benefícios devem ser um array')
        .custom((value) => {
            if (value && value.length === 0) {
                throw new Error('É necessário especificar pelo menos um benefício');
            }
            return true;
        }),

    body('ativo')
        .optional()
        .isBoolean().withMessage('O status ativo deve ser um booleano')
];

module.exports = {
    validarCriacaoPlano,
    validarAtualizacaoPlano
};