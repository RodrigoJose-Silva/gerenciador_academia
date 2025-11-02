/**
 * Controlador de autenticação
 * Gerencia as operações relacionadas à autenticação de usuários
 */

const ApiService = require('../services/ApiService');

/**
 * Renderiza a página de login
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 */
exports.loginPage = (req, res) => {
  // Se o usuário já estiver autenticado, redireciona para a página inicial
  if (req.cookies.token) {
    return res.redirect('/');
  }

  // Renderiza a página de login
  res.render('pages/auth/login', {
    title: 'Login',
    error: req.query.error || null,
    userName: req.query.userName || null
  });
};

/**
 * Processa o login do usuário
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 */
exports.login = async (req, res) => {
  const { userName, senha } = req.body;

  try {
    // Tenta fazer login na API
    const response = await ApiService.post('/auth/login', { userName, senha });

    // Se o login for bem-sucedido, armazena o token e os dados do usuário em cookies
    res.cookie('token', response.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 dia
    });

    // Decodifica o token para obter as informações do usuário
    const [, payload] = response.token.split('.');
    const decodedUser = JSON.parse(Buffer.from(payload, 'base64').toString());

    res.cookie('user', JSON.stringify({
      id: decodedUser.id,
      nome: decodedUser.userName,
      perfil: decodedUser.perfil
    }), {
      maxAge: 24 * 60 * 60 * 1000 // 1 dia
    });

    // Configura o token para as próximas requisições
    ApiService.setAuthToken(response.token);

    // Redireciona para a página inicial
    res.redirect('/');
  } catch (error) {
    // Se ocorrer um erro, renderiza a página de login com a mensagem de erro
    const errorMessage = error.response?.data?.message || error.message || 'Erro ao fazer login. Verifique suas credenciais.';
    res.render('pages/auth/login', {
      title: 'Login',
      error: errorMessage,
      userName: req.body.userName
    });
  }
};

/**
 * Realiza o logout do usuário
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 */
exports.logout = (req, res) => {
  // Remove os cookies de autenticação
  res.clearCookie('token');
  res.clearCookie('user');

  // Redireciona para a página de login
  res.redirect('/auth/login');
};