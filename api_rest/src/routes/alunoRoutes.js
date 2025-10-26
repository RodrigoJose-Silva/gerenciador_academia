/**
 * Rotas de Aluno
 * Define os endpoints para cadastro e consulta de alunos
 */

const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const { alunoValidators, validate } = require('../validators/alunoValidators');
const { autenticar, verificarPermissao } = require('../middlewares/authMiddleware');
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
 *             type: object
 *             required:
 *               - nomeCompleto
 *               - email
 *               - telefone
 *               - dataNascimento
 *               - endereco
 *             properties:
 *               nomeCompleto:
 *                 type: string
 *                 maxLength: 250
 *               email:
 *                 type: string
 *                 maxLength: 150
 *               telefone:
 *                 type: string
 *                 maxLength: 11
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *               cpf:
 *                 type: string
 *                 maxLength: 11
 *               planoId:
 *                 type: string
 *               dataInicio:
 *                 type: string
 *                 format: date
 *               endereco:
 *                 type: object
 *                 required:
 *                   - rua
 *                   - numero
 *                   - cidade
 *                   - estado
 *                   - cep
 *                 properties:
 *                   rua:
 *                     type: string
 *                   numero:
 *                     type: string
 *                   complemento:
 *                     type: string
 *                   bairro:
 *                     type: string
 *                   cidade:
 *                     type: string
 *                   estado:
 *                     type: string
 *                     maxLength: 2
 *                   cep:
 *                     type: string
 *               informacoesMedicas:
 *                 type: string
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
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Aluno não encontrado
 */
// GET /api/alunos/:id - Buscar aluno por ID (requer: VISUALIZAR_ALUNO)
router.get('/:id', autenticar, verificarPermissao(PERMISSOES.VISUALIZAR_ALUNO), alunoController.buscarAlunoPorId);

module.exports = router;
