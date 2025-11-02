/**
 * Rotas para gerenciamento de planos
 */

const express = require('express');
const router = express.Router();
const planosController = require('../controllers/planosController');

// Listar todos os planos
router.get('/', planosController.listarPlanos);

// Exibir formulário para criar novo plano
router.get('/novo', planosController.exibirFormularioNovoPlano);

// Criar novo plano
router.post('/', planosController.criarPlano);

// Exibir detalhes de um plano
router.get('/:id', planosController.exibirPlano);

// Exibir formulário para editar plano
router.get('/:id/editar', planosController.exibirFormularioEditarPlano);

// Atualizar plano
router.post('/:id', planosController.atualizarPlano);

// Excluir plano
router.post('/:id/excluir', planosController.excluirPlano);

module.exports = router;