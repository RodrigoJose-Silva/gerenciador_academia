/**
 * Rotas de Funcionário
 * Define os endpoints para cadastro e consulta de funcionários
 */

const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionarioController');
const { funcionarioValidators, validate } = require('../validators/funcionarioValidators');
const { funcionarioUpdateValidators } = require('../validators/funcionarioUpdateValidators');
const { autenticar, verificarPermissao } = require('../middlewares/authMiddleware');
const { validateId } = require('../middlewares/idValidationMiddleware');
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
 *             $ref: '#/components/schemas/Funcionario'
 *     responses:
 *       201:
 *         description: Funcionário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID do funcionário cadastrado
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Funcionario'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Funcionario'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Funcionário não encontrado
 */
// GET /api/funcionarios/:id - Buscar funcionário por ID (requer: VISUALIZAR_FUNCIONARIO)
router.get('/:id', autenticar, verificarPermissao(PERMISSOES.VISUALIZAR_FUNCIONARIO), validateId(), funcionarioController.buscarFuncionarioPorId);

/**
 * @swagger
 * /api/funcionarios/{id}:
 *   put:
 *     summary: Atualiza dados de um funcionário existente
 *     tags: [Funcionários]
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
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Novo email do funcionário
 *               telefone:
 *                 type: string
 *                 pattern: ^\d{11}$
 *                 description: Novo telefone do funcionário (apenas números)
 *               cargo:
 *                 type: string
 *                 maxLength: 100
 *                 description: Novo cargo do funcionário
 *               perfil:
 *                 type: string
 *                 enum: [ADMINISTRADOR, GERENTE, INSTRUTOR, RECEPCIONISTA]
 *                 description: Novo perfil de acesso do funcionário
 *               salario:
 *                 type: number
 *                 minimum: 0
 *                 description: Novo salário do funcionário
 *     responses:
 *       200:
 *         description: Cadastro atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cadastro atualizado com sucesso
 *       400:
 *         description: Erro de validação ou campos inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Funcionário não encontrado
 *       409:
 *         description: Email já cadastrado para outro funcionário
 */
// // PUT /api/funcionarios/:id - Atualizar funcionário
router.put('/:id', autenticar, verificarPermissao(PERMISSOES.EDITAR_FUNCIONARIO), validateId(), funcionarioUpdateValidators, validate, funcionarioController.atualizarFuncionario);

/**
 * @swagger
 * /api/funcionarios/{id}:
 *   delete:
 *     summary: Deleta um funcionário
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
 *         description: Funcionário deletado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Funcionário não encontrado
 */
// DELETE /api/funcionarios/:id - Deletar funcionário (requer: EXCLUIR_FUNCIONARIO)
router.delete('/:id', autenticar, verificarPermissao(PERMISSOES.EXCLUIR_FUNCIONARIO), validateId(), funcionarioController.deletarFuncionario);

module.exports = router;
