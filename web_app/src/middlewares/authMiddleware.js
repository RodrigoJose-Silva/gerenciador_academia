/**
 * Middleware de autenticação
 * Verifica se o usuário está autenticado antes de acessar rotas protegidas
 */

/**
 * Middleware que verifica se o usuário está autenticado
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Função para passar para o próximo middleware
 * @returns {void}
 */
const authMiddleware = (req, res, next) => {
  // Verifica se existe um token nos cookies
  const token = req.cookies.token;
  
  if (!token) {
    // Redireciona para a página de login se não houver token
    return res.redirect('/auth/login?error=Você precisa estar logado para acessar esta página');
  }
  
  // Se o token existir, continua para o próximo middleware
  next();
};

module.exports = authMiddleware;