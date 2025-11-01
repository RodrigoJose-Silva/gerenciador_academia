/**
 * Middleware de Validação de ID
 * Valida se o ID fornecido como parâmetro na rota é válido
 */

const { param, validationResult } = require('express-validator');

/**
 * Middleware para validar IDs em parâmetros de rota
 * @param {string} paramName - Nome do parâmetro que contém o ID (padrão: 'id')
 * @returns {Array} - Array de middlewares para validação
 */
const validateId = (paramName = 'id') => [
  param(paramName)
    .notEmpty()
    .withMessage(`O parâmetro ${paramName} é obrigatório`)
    .isString()
    .withMessage(`O parâmetro ${paramName} deve ser uma string válida`),
  
  // Middleware para verificar os resultados da validação
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'erro',
        mensagem: 'Erro de validação no parâmetro ID',
        erros: errors.array()
      });
    }
    next();
  }
];

module.exports = { validateId };