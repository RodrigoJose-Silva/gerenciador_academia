/**
 * Controlador de alunos
 * Gerencia as operações relacionadas aos alunos
 */

const ApiService = require('../services/ApiService');

/**
 * Lista todos os alunos
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 */
exports.listarAlunos = async (req, res) => {
  try {
    // Configura o token para a requisição
    ApiService.setAuthToken(req.cookies.token);
    
    // Busca os alunos na API
    const alunos = await ApiService.get('/alunos');
    
    // Renderiza a página com a lista de alunos
    res.render('pages/alunos/index', { 
      title: 'Alunos',
      alunos
    });
  } catch (error) {
    res.render('error', { 
      title: 'Erro',
      message: 'Erro ao listar alunos',
      error: error
    });
  }
};

/**
 * Exibe o formulário para criar um novo aluno
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 */
exports.exibirFormularioNovoAluno = async (req, res) => {
  try {
    // Configura o token para a requisição
    ApiService.setAuthToken(req.cookies.token);
    
    // Busca os planos disponíveis para associar ao aluno
    const planos = await ApiService.get('/planos');
    
    // Renderiza o formulário
    res.render('pages/alunos/novo', { 
      title: 'Novo Aluno',
      planos
    });
  } catch (error) {
    res.render('error', { 
      title: 'Erro',
      message: 'Erro ao carregar formulário',
      error: error
    });
  }
};

/**
 * Cria um novo aluno
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 */
exports.criarAluno = async (req, res) => {
  try {
    // Configura o token para a requisição
    ApiService.setAuthToken(req.cookies.token);
    
    // Envia os dados do aluno para a API
    await ApiService.post('/alunos', req.body);
    
    // Redireciona para a lista de alunos com mensagem de sucesso
    res.redirect('/alunos?success=Aluno cadastrado com sucesso');
  } catch (error) {
    // Em caso de erro, renderiza o formulário novamente com a mensagem de erro
    const planos = await ApiService.get('/planos');
    
    res.render('pages/alunos/novo', { 
      title: 'Novo Aluno',
      error: error.message || 'Erro ao cadastrar aluno',
      planos,
      aluno: req.body
    });
  }
};

/**
 * Exibe os detalhes de um aluno
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 */
exports.exibirAluno = async (req, res) => {
  try {
    // Configura o token para a requisição
    ApiService.setAuthToken(req.cookies.token);
    
    // Busca os dados do aluno na API
    const aluno = await ApiService.get(`/alunos/${req.params.id}`);
    
    // Renderiza a página com os detalhes do aluno
    res.render('pages/alunos/detalhes', { 
      title: aluno.nomeCompleto,
      aluno
    });
  } catch (error) {
    res.render('error', { 
      title: 'Erro',
      message: 'Erro ao buscar detalhes do aluno',
      error: error
    });
  }
};

/**
 * Exibe o formulário para editar um aluno
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 */
exports.exibirFormularioEditarAluno = async (req, res) => {
  try {
    // Configura o token para a requisição
    ApiService.setAuthToken(req.cookies.token);
    
    // Busca os dados do aluno e os planos disponíveis
    const [aluno, planos] = await Promise.all([
      ApiService.get(`/alunos/${req.params.id}`),
      ApiService.get('/planos')
    ]);
    
    // Renderiza o formulário de edição
    res.render('pages/alunos/editar', { 
      title: `Editar ${aluno.nomeCompleto}`,
      aluno,
      planos
    });
  } catch (error) {
    res.render('error', { 
      title: 'Erro',
      message: 'Erro ao carregar formulário de edição',
      error: error
    });
  }
};

/**
 * Atualiza os dados de um aluno
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 */
exports.atualizarAluno = async (req, res) => {
  try {
    // Configura o token para a requisição
    ApiService.setAuthToken(req.cookies.token);
    
    // Envia os dados atualizados para a API
    await ApiService.put(`/alunos/${req.params.id}`, req.body);
    
    // Redireciona para a página de detalhes com mensagem de sucesso
    res.redirect(`/alunos/${req.params.id}?success=Aluno atualizado com sucesso`);
  } catch (error) {
    // Em caso de erro, renderiza o formulário novamente com a mensagem de erro
    const [aluno, planos] = await Promise.all([
      ApiService.get(`/alunos/${req.params.id}`),
      ApiService.get('/planos')
    ]);
    
    res.render('pages/alunos/editar', { 
      title: `Editar ${aluno.nomeCompleto}`,
      error: error.message || 'Erro ao atualizar aluno',
      aluno: { ...aluno, ...req.body },
      planos
    });
  }
};

/**
 * Exclui um aluno
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 */
exports.excluirAluno = async (req, res) => {
  try {
    // Configura o token para a requisição
    ApiService.setAuthToken(req.cookies.token);
    
    // Envia a requisição de exclusão para a API
    await ApiService.delete(`/alunos/${req.params.id}`);
    
    // Redireciona para a lista de alunos com mensagem de sucesso
    res.redirect('/alunos?success=Aluno excluído com sucesso');
  } catch (error) {
    // Em caso de erro, redireciona para a página de detalhes com a mensagem de erro
    res.redirect(`/alunos/${req.params.id}?error=${error.message || 'Erro ao excluir aluno'}`);
  }
};