/**
 * Controlador de planos
 * Gerencia as operações relacionadas aos planos
 */

const ApiService = require('../services/ApiService');

/**
 * Lista todos os planos
 */
exports.listarPlanos = async (req, res) => {
  try {
    ApiService.setAuthToken(req.cookies.token);
    const planos = await ApiService.get('/planos');
    res.render('pages/planos/index', { 
      title: 'Planos',
      planos
    });
  } catch (error) {
    res.render('error', { 
      title: 'Erro',
      message: 'Erro ao listar planos',
      error
    });
  }
};

/**
 * Exibe o formulário para criar um novo plano
 */
exports.exibirFormularioNovoPlano = (req, res) => {
  res.render('pages/planos/novo', { 
    title: 'Novo Plano'
  });
};

/**
 * Cria um novo plano
 */
exports.criarPlano = async (req, res) => {
  try {
    ApiService.setAuthToken(req.cookies.token);
    await ApiService.post('/planos', req.body);
    res.redirect('/planos');
  } catch (error) {
    res.render('pages/planos/novo', {
      title: 'Novo Plano',
      error: error.message,
      plano: req.body
    });
  }
};

/**
 * Exibe os detalhes de um plano
 */
exports.exibirPlano = async (req, res) => {
  try {
    ApiService.setAuthToken(req.cookies.token);
    const plano = await ApiService.get(`/planos/${req.params.id}`);
    res.render('pages/planos/detalhes', {
      title: 'Detalhes do Plano',
      plano
    });
  } catch (error) {
    res.render('error', {
      title: 'Erro',
      message: 'Erro ao exibir plano',
      error
    });
  }
};

/**
 * Exibe o formulário para editar um plano
 */
exports.exibirFormularioEditarPlano = async (req, res) => {
  try {
    ApiService.setAuthToken(req.cookies.token);
    const plano = await ApiService.get(`/planos/${req.params.id}`);
    res.render('pages/planos/editar', {
      title: 'Editar Plano',
      plano
    });
  } catch (error) {
    res.render('error', {
      title: 'Erro',
      message: 'Erro ao carregar formulário de edição',
      error
    });
  }
};

/**
 * Atualiza um plano
 */
exports.atualizarPlano = async (req, res) => {
  try {
    ApiService.setAuthToken(req.cookies.token);
    await ApiService.put(`/planos/${req.params.id}`, req.body);
    res.redirect('/planos');
  } catch (error) {
    res.render('pages/planos/editar', {
      title: 'Editar Plano',
      plano: { ...req.body, id: req.params.id },
      error: error.message
    });
  }
};

/**
 * Exclui um plano
 */
exports.excluirPlano = async (req, res) => {
  try {
    ApiService.setAuthToken(req.cookies.token);
    await ApiService.delete(`/planos/${req.params.id}`);
    res.redirect('/planos');
  } catch (error) {
    res.render('error', {
      title: 'Erro',
      message: 'Erro ao excluir plano',
      error
    });
  }
};