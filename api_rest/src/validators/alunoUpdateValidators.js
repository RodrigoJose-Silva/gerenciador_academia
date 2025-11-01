/**
 * Validadores para Atualização de Aluno
 * Define todas as regras de validação para atualização dos campos do aluno
 * 
 * Diferenças em relação ao cadastro:
 * - Todos os campos são opcionais
 * - Adição da validação de status
 */

const { body, validationResult } = require('express-validator');

// Estados brasileiros válidos
const estadosBrasileiros = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

// Validações para atualização de aluno
const alunoUpdateValidators = [
    // Status
    body('status')
        .optional()
        .isIn(['ATIVO', 'BLOQUEADO', 'INATIVO'])
        .withMessage('Status deve ser ATIVO, BLOQUEADO ou INATIVO'),

    // Nome completo
    body('nomeCompleto')
        .optional()
        .trim()
        .isLength({ max: 250 }).withMessage('Nome completo deve ter no máximo 250 caracteres')
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('Nome completo deve conter apenas letras e espaços'),

    // Telefone
    body('telefone')
        .optional()
        .trim()
        .isLength({ max: 11 }).withMessage('Telefone deve ter no máximo 11 dígitos')
        .matches(/^\d+$/).withMessage('Telefone deve conter apenas números'),

    // Data de nascimento
    body('dataNascimento')
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Data de nascimento deve estar no formato AAAA-MM-DD')
        .custom((value) => {
            const data = new Date(value);
            const hoje = new Date();
            if (data > hoje) {
                throw new Error('Data de nascimento não pode ser no futuro');
            }
            return true;
        }),

    // CPF
    body('cpf')
        .optional()
        .isLength({ max: 11 }).withMessage('CPF deve ter no máximo 11 dígitos')
        .matches(/^\d+$/).withMessage('CPF deve conter apenas números'),

    // Plano ID
    body('planoId')
        .optional()
        .isString().withMessage('Plano ID deve ser uma string'),

    // Data de início
    body('dataInicio')
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Data de início deve estar no formato AAAA-MM-DD'),

    // Endereço - Rua
    body('endereco.rua')
        .optional()
        .trim()
        .isLength({ max: 250 }).withMessage('Rua deve ter no máximo 250 caracteres'),

    // Endereço - Número
    body('endereco.numero')
        .optional()
        .trim()
        .isLength({ max: 10 }).withMessage('Número deve ter no máximo 10 caracteres')
        .matches(/^\d+$/).withMessage('Número deve conter apenas números'),

    // Endereço - Complemento
    body('endereco.complemento')
        .optional()
        .trim()
        .isLength({ max: 250 }).withMessage('Complemento deve ter no máximo 250 caracteres'),

    // Endereço - Bairro
    body('endereco.bairro')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Bairro deve ter no máximo 100 caracteres'),

    // Endereço - Cidade
    body('endereco.cidade')
        .optional()
        .trim()
        .isLength({ max: 80 }).withMessage('Cidade deve ter no máximo 80 caracteres')
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('Cidade deve conter apenas letras e espaços'),

    // Endereço - Estado
    body('endereco.estado')
        .optional()
        .trim()
        .isLength({ max: 2 }).withMessage('Estado deve ter 2 caracteres')
        .isUppercase().withMessage('Estado deve estar em maiúsculas')
        .isIn(estadosBrasileiros).withMessage('Estado inválido'),

    // Endereço - CEP
    body('endereco.cep')
        .optional()
        .trim()
        .matches(/^\d{8}$/).withMessage('CEP deve ter 8 dígitos numéricos'),

    // Informações médicas
    body('informacoesMedicas')
        .optional()
        .isString().withMessage('Informações médicas deve ser uma string')
];

// Validação de resultados
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array();
        return res.status(400).json({
            message: errorArray[0].msg
        });
    }
    next();
};

module.exports = {
    alunoUpdateValidators,
    validate
};