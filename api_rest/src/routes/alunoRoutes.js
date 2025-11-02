/**
 * Rotas de Aluno
 * Define os endpoints para cadastro e consulta de alunos
 */

const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const { alunoValidators, validate } = require('../validators/alunoValidators');
const { alunoUpdateValidators } = require('../validators/alunoUpdateValidators');
const { autenticar, verificarPermissao } = require('../middlewares/authMiddleware');
const { validateId } = require('../middlewares/idValidationMiddleware');
const { PERMISSOES } = require('../models/Permissions');

/**
 * @swagger
 * /api/alunos:
 *   post:
 *     summary: Cadastra um novo aluno
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aluno'
 *     responses:
 *       201:
 *         description: Aluno cadastrado com sucesso
 *       400:
 *         description: Erro de validação
 *       409:
 *         description: Email já cadastrado
 */
// POST /api/alunos - Cadastrar aluno (requer: CRIAR_ALUNO)
router.post('/', autenticar, verificarPermissao(PERMISSOES.CRIAR_ALUNO), alunoValidators, validate, alunoController.cadastrarAluno);

/**
 * @swagger
 * /api/alunos:
 *   get:
 *     summary: Lista todos os alunos
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de alunos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Aluno'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */
// GET /api/alunos - Listar alunos (requer: LISTAR_ALUNOS)
router.get('/', autenticar, verificarPermissao(PERMISSOES.LISTAR_ALUNOS), alunoController.listarAlunos);

/**
 * @swagger
 * /api/alunos/{id}:
 *   get:
 *     summary: Busca um aluno por ID
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do aluno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Aluno não encontrado
 */
// GET /api/alunos/:id - Buscar aluno por ID (requer: VISUALIZAR_ALUNO)
router.get('/:id', autenticar, verificarPermissao(PERMISSOES.VISUALIZAR_ALUNO), validateId(), alunoController.buscarAlunoPorId);

/**
 * @swagger
 * /api/alunos/{id}:
 *   put:
 *     summary: Atualiza um aluno existente
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aluno'
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Aluno não encontrado
 */
// PUT /api/alunos/:id - Atualizar aluno (requer: EDITAR_ALUNO)
router.put('/:id', autenticar, verificarPermissao(PERMISSOES.EDITAR_ALUNO), validateId(), alunoUpdateValidators, validate, alunoController.atualizarAluno);

/**
 * @swagger
 * /api/alunos/{id}:
 *   delete:
 *     summary: Deleta um aluno
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aluno deletado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Aluno não encontrado
 */
// DELETE /api/alunos/:id - Excluir aluno (requer: EXCLUIR_ALUNO)
router.delete('/:id', autenticar, verificarPermissao(PERMISSOES.EXCLUIR_ALUNO), validateId(), alunoController.deletarAluno);

module.exports = router;
