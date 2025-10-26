/**
 * Helpers para os Testes
 * Funções auxiliares para facilitar os testes
 */

const { gerarToken } = require('../../src/middlewares/authMiddleware');

/**
 * Gera um token JWT para testes
 * @param {string} perfil - Perfil do funcionário (padrão: ADMINISTRADOR)
 * @returns {string} - Token JWT
 */
const gerarTokenParaTeste = (perfil = 'ADMINISTRADOR') => {
    return gerarToken({
        id: 'test_user_id',
        userName: 'test_user',
        perfil: perfil
    });
};

module.exports = {
    gerarTokenParaTeste
};
