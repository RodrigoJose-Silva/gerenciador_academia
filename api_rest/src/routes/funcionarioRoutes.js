/**
 * Rotas de Funcionário
 * Define os endpoints para cadastro e consulta de funcionários
 */

const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionarioController');
const { funcionarioValidators, validate } = require('../validators/funcionarioValidators');
const { autenticar, verificarPermissao } = require('../middlewares/authMiddleware');
const { PERMISSOES } = require('../models/Permissions');

/**
 * @swagger
 * /api/funcionarios:
 *   post:
 *     summary: Cadastra um novo funcionário
 *     tags: [Funcionários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomeCompleto
 *               - email
 *               - userName
 *               - senha
 *               - telefone
 *               - dataNascimento
 *               - cargo
 *               - salario
 *             properties:
 *               nomeCompleto:
 *                 type: string
 *                 maxLength: 250
 *               email:
 *                 type: string
 *                 maxLength: 150
 *               userName:
 *                 type: string
 *                 maxLength: 100
 *               senha:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 20
 *               telefone:
 *                 type: string
 *                 maxLength: 11
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *               cpf:
 *                 type: string
 *                 maxLength: 11
 *               cargo:
 *                 type: string
 *                 maxLength: 100
 *               dataAdmissao:
 *                 type: string
 *                 format: date
 *               cref:
 *                 type: string
 *               salario:
 *                 type: number
 *     responses:
 *       201:
 *         description: Funcionário cadastrado com sucesso
 *       400:
 *         description: Erro de validação
 *       409:
 *         description: Email ou UserName já cadastrado
 */
// POST /api/funcionarios - Cadastrar funcionário (requer: CRIAR_FUNCIONARIO)
router.post('/', autenticar, verificarPermissao(PERMISSOES.CRIAR_FUNCIONARIO), funcionarioValidators, validate, funcionarioController.cadastrarFuncionario);

/**
 * @swagger
 * /api/funcionarios:
 *   get:
 *     summary: Lista todos os funcionários
 *     tags: [Funcionários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de funcionários
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */
// GET /api/funcionarios - Listar funcionários (requer: LISTAR_FUNCIONARIOS)
router.get('/', autenticar, verificarPermissao(PERMISSOES.LISTAR_FUNCIONARIOS), funcionarioController.listarFuncionarios);

/**
 * @swagger
 * /api/funcionarios/{id}:
 *   get:
 *     summary: Busca um funcionário por ID
 *     tags: [Funcionários]
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
 *         description: Dados do funcionário
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Funcionário não encontrado
 */
// GET /api/funcionarios/:id - Buscar funcionário por ID (requer: VISUALIZAR_FUNCIONARIO)
router.get('/:id', autenticar, verificarPermissao(PERMISSOES.VISUALIZAR_FUNCIONARIO), funcionarioController.buscarFuncionarioPorId);

module.exports = router;
