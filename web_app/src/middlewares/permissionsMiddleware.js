/**
 * Middleware para disponibilizar funções de verificação de permissão nas views
 */

const { temPermissao } = require('../utils/permissions');

const permissionsMiddleware = (req, res, next) => {
    // Adiciona a função hasPermission ao objeto res.locals
    // para que possa ser usada nas views
    res.locals.hasPermission = (permissao) => {
        if (!req.cookies.user) {
            return false;
        }
        const user = JSON.parse(req.cookies.user);
        return temPermissao(user.perfil, permissao);
    };

    next();
};

module.exports = permissionsMiddleware;