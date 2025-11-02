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
    // Valida os dados de entrada
    if (!userName || !senha) {
      throw new Error('Nome de usuário e senha são obrigatórios');
    }

    // Tenta fazer login na API
    const response = await ApiService.post('/api/auth/login', { userName, senha });

    // Se o login for bem-sucedido, armazena o token e os dados do usuário em cookies
    res.cookie('token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 dia
    });

    // Decodifica o token para obter as informações do usuário
    const [, payload] = response.token.split('.');
    const decodedUser = JSON.parse(Buffer.from(payload, 'base64').toString());

    // Armazena apenas as informações necessárias do usuário
    res.cookie('user', JSON.stringify({
      id: decodedUser.id,
      nome: decodedUser.userName,
      perfil: decodedUser.perfil
    }), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 dia
    });

    // Configura o token para as próximas requisições
    ApiService.setAuthToken(response.token);

    // Redireciona para o dashboard
    res.redirect('/dashboard');
  } catch (error) {
    // Log do erro em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error('[Auth Error]', error);
    }

    // Tratamento específico para diferentes tipos de erro
    let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
    if (error.status === 401) {
      errorMessage = 'Credenciais inválidas. Verifique seu usuário e senha.';
    } else if (error.status === 403) {
      errorMessage = 'Conta bloqueada. Entre em contato com o administrador.';
    } else if (error.status === 503) {
      errorMessage = 'Servidor indisponível. Tente novamente em alguns instantes.';
    }

    // Renderiza a página de login com a mensagem de erro apropriada
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