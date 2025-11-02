/**
 * Controlador de funcionários
 * Gerencia as operações relacionadas aos funcionários
 */

const ApiService = require('../services/ApiService');

/**
 * Lista todos os funcionários
 */
exports.listarFuncionarios = async (req, res) => {
  try {
    ApiService.setAuthToken(req.cookies.token);
    const funcionarios = await ApiService.get('/funcionarios');
    res.render('pages/funcionarios/index', { 
      title: 'Funcionários',
      funcionarios
    });
  } catch (error) {
    res.render('error', { 
      title: 'Erro',
      message: 'Erro ao listar funcionários',
      error
    });
  }
};

/**
 * Exibe o formulário para criar um novo funcionário
 */
exports.exibirFormularioNovoFuncionario = (req, res) => {
  res.render('pages/funcionarios/novo', { 
    title: 'Novo Funcionário'
  });
};

/**
 * Cria um novo funcionário
 */
exports.criarFuncionario = async (req, res) => {
  try {
    ApiService.setAuthToken(req.cookies.token);
    await ApiService.post('/funcionarios', req.body);
    res.redirect('/funcionarios');
  } catch (error) {
    res.render('pages/funcionarios/novo', {
      title: 'Novo Funcionário',
      error: error.message,
      funcionario: req.body
    });
  }
};

/**
 * Exibe os detalhes de um funcionário
 */
exports.exibirFuncionario = async (req, res) => {
  try {
    ApiService.setAuthToken(req.cookies.token);
    const funcionario = await ApiService.get(`/funcionarios/${req.params.id}`);
    res.render('pages/funcionarios/detalhes', {
      title: 'Detalhes do Funcionário',
      funcionario
    });
  } catch (error) {
    res.render('error', {
      title: 'Erro',
      message: 'Erro ao exibir funcionário',
      error
    });
  }
};

/**
 * Exibe o formulário para editar um funcionário
 */
exports.exibirFormularioEditarFuncionario = async (req, res) => {
  try {
    ApiService.setAuthToken(req.cookies.token);
    const funcionario = await ApiService.get(`/funcionarios/${req.params.id}`);
    res.render('pages/funcionarios/editar', {
      title: 'Editar Funcionário',
      funcionario
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
 * Atualiza um funcionário
 */
exports.atualizarFuncionario = async (req, res) => {
  try {
    ApiService.setAuthToken(req.cookies.token);
    await ApiService.put(`/funcionarios/${req.params.id}`, req.body);
    res.redirect('/funcionarios');
  } catch (error) {
    res.render('pages/funcionarios/editar', {
      title: 'Editar Funcionário',
      funcionario: { ...req.body, id: req.params.id },
      error: error.message
    });
  }
};

/**
 * Exclui um funcionário
 */
exports.excluirFuncionario = async (req, res) => {
  try {
    ApiService.setAuthToken(req.cookies.token);
    await ApiService.delete(`/funcionarios/${req.params.id}`);
    res.redirect('/funcionarios');
  } catch (error) {
    res.render('error', {
      title: 'Erro',
      message: 'Erro ao excluir funcionário',
      error
    });
  }
};