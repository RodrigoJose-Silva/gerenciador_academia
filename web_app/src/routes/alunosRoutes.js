/**
 * Rotas para gerenciamento de alunos
 */

const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/alunosController');

// Listar todos os alunos
router.get('/', alunosController.listarAlunos);

// Exibir formulário para criar novo aluno
router.get('/novo', alunosController.exibirFormularioNovoAluno);

// Criar novo aluno
router.post('/', alunosController.criarAluno);

// Exibir detalhes de um aluno
router.get('/:id', alunosController.exibirAluno);

// Exibir formulário para editar aluno
router.get('/:id/editar', alunosController.exibirFormularioEditarAluno);

// Atualizar aluno
router.post('/:id', alunosController.atualizarAluno);

// Excluir aluno
router.post('/:id/excluir', alunosController.excluirAluno);

module.exports = router;