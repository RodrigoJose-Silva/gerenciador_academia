/**
 * Rotas de Planos
 * Define os endpoints para gerenciamento de planos
 */

const express = require('express');
const router = express.Router();
const planoController = require('../controllers/planoController');
const { validarCriacaoPlano, validarAtualizacaoPlano } = require('../validators/planoValidators');
const { autenticar, verificarPermissao } = require('../middlewares/authMiddleware');
const { PERMISSOES } = require('../models/Permissions');

/**
 * @swagger
 * tags:
 *   name: Planos
 *   description: Gerenciamento de planos da academia
 */

/**
 * @swagger
 * /api/planos:
 *   post:
 *     summary: Cria um novo plano
 *     tags: [Planos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plano'
 *     responses:
 *       201:
 *         description: Plano criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem permissão
 *       500:
 *         description: Erro no servidor
 */
router.post('/', 
    autenticar, 
    verificarPermissao(PERMISSOES.CRIAR_PLANO),
    validarCriacaoPlano, 
    planoController.criarPlano
);

/**
 * @swagger
 * /api/planos:
 *   get:
 *     summary: Lista todos os planos
 *     tags: [Planos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de planos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plano'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem permissão
 *       500:
 *         description: Erro no servidor
 */
router.get('/', 
    autenticar, 
    verificarPermissao(PERMISSOES.LISTAR_PLANOS),
    planoController.listarPlanos
);

/**
 * @swagger
 * /api/planos/{id}:
 *   get:
 *     summary: Busca um plano pelo ID
 *     tags: [Planos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do plano
 *     responses:
 *       200:
 *         description: Plano encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plano'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Plano não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/:id', 
    autenticar, 
    verificarPermissao(PERMISSOES.VISUALIZAR_PLANO),
    planoController.buscarPlanoPorId
);

/**
 * @swagger
 * /api/planos/{id}:
 *   put:
 *     summary: Atualiza um plano existente
 *     tags: [Planos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do plano
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plano'
 *     responses:
 *       200:
 *         description: Plano atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plano'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Plano não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/:id', 
    autenticar, 
    verificarPermissao(PERMISSOES.EDITAR_PLANO),
    validarAtualizacaoPlano, 
    planoController.atualizarPlano
);

/**
 * @swagger
 * /api/planos/{id}:
 *   delete:
 *     summary: Exclui um plano
 *     tags: [Planos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do plano
 *     responses:
 *       200:
 *         description: Plano excluído com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Plano não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete('/:id', 
    autenticar, 
    verificarPermissao(PERMISSOES.EXCLUIR_PLANO),
    planoController.excluirPlano
);

module.exports = router;