/**
 * Validadores para Checkins
 * Define as regras de validação para operações com checkins
 */

const { body } = require('express-validator');

// Validações para criação de checkin
const validarCriacaoCheckin = [
    body('alunoId')
        .notEmpty().withMessage('O ID do aluno é obrigatório')
        .isString().withMessage('O ID do aluno deve ser uma string'),
    
    body('dataHora')
        .optional()
        .isISO8601().withMessage('A data e hora devem estar no formato ISO8601'),
    
    body('observacao')
        .optional()
        .isString().withMessage('A observação deve ser uma string')
        .isLength({ max: 500 }).withMessage('A observação deve ter no máximo 500 caracteres'),
    
    body('registradoPor')
        .optional()
        .isString().withMessage('O ID do funcionário deve ser uma string')
];

module.exports = {
    validarCriacaoCheckin
};