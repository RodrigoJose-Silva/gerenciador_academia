/**
 * Controlador de check-ins
 * Gerencia as operações relacionadas aos check-ins
 */

const ApiService = require('../services/ApiService');

/**
 * Lista todos os check-ins
 */
exports.listarCheckins = async (req, res) => {
  try {
    if (!req.cookies.token) {
      return res.redirect('/login?error=Sessão expirada. Por favor, faça login novamente.');
    }

    ApiService.setAuthToken(req.cookies.token);
    const checkins = await ApiService.get('/checkins');

    // Se não houver dados, exibe uma mensagem amigável
    if (!checkins || checkins.length === 0) {
      return res.render('pages/checkins/index', {
        title: 'Check-ins',
        checkins: [],
        message: 'Nenhum check-in encontrado.'
      });
    }

    res.render('pages/checkins/index', {
      title: 'Check-ins',
      checkins
    });
  } catch (error) {
    console.error('[Check-in Controller] Erro ao listar check-ins:', error);

    // Verifica se é erro de autenticação
    if (error.status === 401) {
      return res.redirect('/login?error=Sessão expirada. Por favor, faça login novamente.');
    }

    // Verifica se é erro de permissão
    if (error.status === 403) {
      return res.render('error', {
        title: 'Acesso Negado',
        message: 'Você não tem permissão para visualizar os check-ins.',
        error: { status: 403 }
      });
    }

    // Verifica se é erro de conexão
    if (error.status === 503) {
      return res.render('error', {
        title: 'Serviço Indisponível',
        message: 'O serviço está temporariamente indisponível. Por favor, tente novamente em alguns instantes.',
        error: { status: 503 }
      });
    }

    res.render('error', {
      title: 'Erro',
      message: 'Erro ao listar check-ins. Por favor, tente novamente.',
      error
    });
  }
};

/**
 * Exibe o formulário para criar um novo check-in
 */
exports.exibirFormularioNovoCheckin = async (req, res) => {
  try {
    ApiService.setAuthToken(req.cookies.token);
    const alunos = await ApiService.get('/alunos');
    res.render('pages/checkins/novo', {
      title: 'Novo Check-in',
      alunos
    });
  } catch (error) {
    res.render('error', {
      title: 'Erro',
      message: 'Erro ao carregar formulário de check-in',
      error
    });
  }
};

/**
 * Cria um novo check-in
 */
exports.criarCheckin = async (req, res) => {
  try {
    ApiService.setAuthToken(req.cookies.token);
    await ApiService.post('/checkins', req.body);
    res.redirect('/checkins');
  } catch (error) {
    try {
      const alunos = await ApiService.get('/alunos');
      res.render('pages/checkins/novo', {
        title: 'Novo Check-in',
        error: error.message,
        checkin: req.body,
        alunos
      });
    } catch (err) {
      res.render('error', {
        title: 'Erro',
        message: 'Erro ao processar check-in',
        error
      });
    }
  }
};

/**
 * Exibe os detalhes de um check-in
 */
exports.exibirCheckin = async (req, res) => {
  try {
    ApiService.setAuthToken(req.cookies.token);
    const checkin = await ApiService.get(`/checkins/${req.params.id}`);
    res.render('pages/checkins/detalhes', {
      title: 'Detalhes do Check-in',
      checkin
    });
  } catch (error) {
    res.render('error', {
      title: 'Erro',
      message: 'Erro ao exibir check-in',
      error
    });
  }
};

/**
 * Exclui um check-in
 */
exports.excluirCheckin = async (req, res) => {
  try {
    ApiService.setAuthToken(req.cookies.token);
    await ApiService.delete(`/checkins/${req.params.id}`);
    res.redirect('/checkins?success=Check-in excluído com sucesso');
  } catch (error) {
    res.render('error', {
      title: 'Erro',
      message: 'Erro ao excluir check-in',
      error
    });
  }
};