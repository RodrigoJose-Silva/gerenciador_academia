/**
 * Rotas de Checkins
 * Define os endpoints para gerenciamento de checkins
 */

const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkinController');
const { validarCriacaoCheckin } = require('../validators/checkinValidators');
const { autenticar, verificarPermissao } = require('../middlewares/authMiddleware');
const { PERMISSOES } = require('../models/Permissions');

/**
 * @swagger
 * tags:
 *   name: Checkins
 *   description: Gerenciamento de checkins de alunos na academia
 */

/**
 * @swagger
 * /api/checkins:
 *   post:
 *     summary: Registra um novo checkin
 *     tags: [Checkins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Checkin'
 *     responses:
 *       201:
 *         description: Checkin registrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Aluno não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.post('/', 
    autenticar, 
    verificarPermissao(PERMISSOES.CRIAR_CHECKIN),
    validarCriacaoCheckin, 
    checkinController.registrarCheckin
);

/**
 * @swagger
 * /api/checkins:
 *   get:
 *     summary: Lista todos os checkins
 *     tags: [Checkins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de checkins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Checkin'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem permissão
 *       500:
 *         description: Erro no servidor
 */
router.get('/', 
    autenticar, 
    verificarPermissao(PERMISSOES.LISTAR_CHECKINS),
    checkinController.listarCheckins
);

/**
 * @swagger
 * /api/checkins/{id}:
 *   get:
 *     summary: Busca um checkin pelo ID
 *     tags: [Checkins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do checkin
 *     responses:
 *       200:
 *         description: Checkin encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Checkin'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Checkin não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/:id', 
    autenticar, 
    verificarPermissao(PERMISSOES.VISUALIZAR_CHECKIN),
    checkinController.buscarCheckinPorId
);

/**
 * @swagger
 * /api/checkins/aluno/{alunoId}:
 *   get:
 *     summary: Lista todos os checkins de um aluno específico
 *     tags: [Checkins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alunoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Lista de checkins do aluno
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Checkin'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Aluno não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/aluno/:alunoId', 
    autenticar, 
    verificarPermissao(PERMISSOES.VISUALIZAR_CHECKIN),
    checkinController.listarCheckinsPorAluno
);

/**
 * @swagger
 * /api/checkins/{id}:
 *   delete:
 *     summary: Exclui um checkin
 *     tags: [Checkins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do checkin
 *     responses:
 *       200:
 *         description: Checkin excluído com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Checkin não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete('/:id', 
    autenticar, 
    verificarPermissao(PERMISSOES.EXCLUIR_CHECKIN),
    checkinController.excluirCheckin
);

module.exports = router;