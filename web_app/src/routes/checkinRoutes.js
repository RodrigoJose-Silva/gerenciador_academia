/**
 * Rotas para gerenciamento de check-ins
 */

const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkinController');

// Listar todos os check-ins
router.get('/', checkinController.listarCheckins);

// Exibir formulário para criar novo check-in
router.get('/novo', checkinController.exibirFormularioNovoCheckin);

// Criar novo check-in
router.post('/', checkinController.criarCheckin);

// Exibir detalhes de um check-in
router.get('/:id', checkinController.exibirCheckin);

module.exports = router;