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
    ApiService.setAuthToken(req.cookies.token);
    const checkins = await ApiService.get('/checkins');
    res.render('pages/checkins/index', { 
      title: 'Check-ins',
      checkins
    });
  } catch (error) {
    res.render('error', { 
      title: 'Erro',
      message: 'Erro ao listar check-ins',
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