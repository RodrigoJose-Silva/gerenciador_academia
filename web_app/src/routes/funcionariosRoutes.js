/**
 * Rotas para gerenciamento de funcionários
 */

const express = require('express');
const router = express.Router();
const funcionariosController = require('../controllers/funcionariosController');

// Listar todos os funcionários
router.get('/', funcionariosController.listarFuncionarios);

// Exibir formulário para criar novo funcionário
router.get('/novo', funcionariosController.exibirFormularioNovoFuncionario);

// Criar novo funcionário
router.post('/', funcionariosController.criarFuncionario);

// Exibir detalhes de um funcionário
router.get('/:id', funcionariosController.exibirFuncionario);

// Exibir formulário para editar funcionário
router.get('/:id/editar', funcionariosController.exibirFormularioEditarFuncionario);

// Atualizar funcionário
router.post('/:id', funcionariosController.atualizarFuncionario);

// Excluir funcionário
router.post('/:id/excluir', funcionariosController.excluirFuncionario);

module.exports = router;