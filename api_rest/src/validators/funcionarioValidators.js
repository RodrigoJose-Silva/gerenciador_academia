/**
 * Validadores para Cadastro de Funcionário
 * Define todas as regras de validação para os campos do funcionário
 */

const { body, validationResult } = require('express-validator');
const { PERFIS } = require('../models/Permissions');

const funcionarioValidators = [
    // Nome completo
    body('nomeCompleto')
        .trim()
        .notEmpty().withMessage('Nome completo é obrigatório')
        .isLength({ max: 250 }).withMessage('Nome completo deve ter no máximo 250 caracteres')
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('Nome completo deve conter apenas letras e espaços'),

    // Email
    body('email')
        .trim()
        .notEmpty().withMessage('Email é obrigatório')
        .isLength({ max: 150 }).withMessage('Email deve ter no máximo 150 caracteres')
        .isEmail().withMessage('Email inválido'),

    // UserName
    body('userName')
        .trim()
        .notEmpty().withMessage('UserName é obrigatório')
        .isLength({ max: 100 }).withMessage('UserName deve ter no máximo 100 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('UserName deve conter apenas letras, números e underscore'),

    // Senha
    body('senha')
        .notEmpty().withMessage('Senha é obrigatória')
        .isLength({ min: 6, max: 20 }).withMessage('Senha deve ter entre 6 e 20 caracteres'),

    // Telefone
    body('telefone')
        .trim()
        .notEmpty().withMessage('Telefone é obrigatório')
        .isLength({ max: 11 }).withMessage('Telefone deve ter no máximo 11 dígitos')
        .matches(/^\d+$/).withMessage('Telefone deve conter apenas números'),

    // Data de nascimento
    body('dataNascimento')
        .notEmpty().withMessage('Data de nascimento é obrigatória')
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Data de nascimento deve estar no formato AAAA-MM-DD')
        .custom((value) => {
            const data = new Date(value);
            const hoje = new Date();
            if (data > hoje) {
                throw new Error('Data de nascimento não pode ser no futuro');
            }
            return true;
        }),

    // CPF (opcional)
    body('cpf')
        .optional()
        .isLength({ max: 11 }).withMessage('CPF deve ter no máximo 11 dígitos')
        .matches(/^\d+$/).withMessage('CPF deve conter apenas números'),

    // Cargo
    body('cargo')
        .trim()
        .notEmpty().withMessage('Cargo é obrigatório')
        .isLength({ max: 100 }).withMessage('Cargo deve ter no máximo 100 caracteres')
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('Cargo deve conter apenas letras e espaços'),

    // Perfil (opcional, padrão: RECEPCIONISTA)
    body('perfil')
        .optional()
        .isIn(Object.values(PERFIS)).withMessage('Perfil inválido. Use: ADMINISTRADOR, GERENTE, INSTRUTOR ou RECEPCIONISTA'),

    // Data de admissão (opcional)
    body('dataAdmissao')
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Data de admissão deve estar no formato AAAA-MM-DD'),

    // CREF (opcional, pode ser null)
    body('cref')
        .optional({ nullable: true })
        .isString().withMessage('CREF deve ser uma string quando fornecido'),

    // Salário
    body('salario')
        .notEmpty().withMessage('Salário é obrigatório')
        .isFloat({ min: 0 }).withMessage('Salário deve ser um número positivo')
];

// Validação de resultados
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsFormatted = errors.array().map(err => ({
            message: err.msg,
            field: err.param
        }));
        return res.status(400).json({
            message: 'Erro de validação',
            errors: errorsFormatted
        });
    }
    next();
};

module.exports = {
    funcionarioValidators,
    validate
};
