/**
 * Middleware para redirecionar usuários autenticados
 * Redireciona usuários já logados para o dashboard quando tentam acessar páginas públicas
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Função para passar para o próximo middleware
 */
const redirectIfAuthenticated = (req, res, next) => {
    if (req.cookies.user) {
        return res.redirect('/dashboard');
    }
    next();
};

module.exports = redirectIfAuthenticated;