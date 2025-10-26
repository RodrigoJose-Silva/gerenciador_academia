/**
 * Controller de Funcionário
 * Gerencia as operações relacionadas ao cadastro de funcionários
 */

const Funcionario = require('../models/Funcionario');
const bcrypt = require('bcrypt');
const storageService = require('../services/StorageService');

/**
 * Cadastra um novo funcionário
 */
const cadastrarFuncionario = async (req, res) => {
    try {
        // Verifica se o email já existe
        if (storageService.verificarEmailExistente(req.body.email)) {
            return res.status(409).json({
                message: 'Email já cadastrado'
            });
        }

        // Verifica se o userName já existe
        if (storageService.verificarUserNameExistente(req.body.userName)) {
            return res.status(409).json({
                message: 'UserName já cadastrado'
            });
        }

        // Hash da senha
        const senhaHash = await bcrypt.hash(req.body.senha, 10);

        // Cria o funcionário com senha hash
        const funcionarioData = {
            ...req.body,
            senha: senhaHash
        };

        const funcionario = new Funcionario(funcionarioData);

        // Adiciona ao storage
        const funcionarioCadastrado = storageService.adicionarFuncionario(funcionario);

        // Retorna apenas o ID e dados públicos
        res.status(201).json({
            message: 'Funcionário cadastrado com sucesso',
            id: funcionarioCadastrado.id,
            nomeCompleto: funcionarioCadastrado.nomeCompleto,
            userName: funcionarioCadastrado.userName,
            email: funcionarioCadastrado.email
        });
    } catch (error) {
        console.error('Erro ao cadastrar funcionário:', error);
        res.status(500).json({
            message: 'Erro ao cadastrar funcionário',
            error: error.message
        });
    }
};

/**
 * Lista todos os funcionários
 */
const listarFuncionarios = (req, res) => {
    try {
        const funcionarios = storageService.listarFuncionarios();
        res.status(200).json(funcionarios);
    } catch (error) {
        console.error('Erro ao listar funcionários:', error);
        res.status(500).json({
            message: 'Erro ao listar funcionários',
            error: error.message
        });
    }
};

/**
 * Busca um funcionário por ID
 */
const buscarFuncionarioPorId = (req, res) => {
    try {
        const funcionario = storageService.buscarFuncionarioPorId(req.params.id);

        if (!funcionario) {
            return res.status(404).json({
                message: 'Funcionário não encontrado'
            });
        }

        res.status(200).json(funcionario.toJSON());
    } catch (error) {
        console.error('Erro ao buscar funcionário:', error);
        res.status(500).json({
            message: 'Erro ao buscar funcionário',
            error: error.message
        });
    }
};

module.exports = {
    cadastrarFuncionario,
    listarFuncionarios,
    buscarFuncionarioPorId
};
