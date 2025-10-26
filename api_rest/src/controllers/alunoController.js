/**
 * Controller de Aluno
 * Gerencia as operações relacionadas ao cadastro de alunos
 */

const Aluno = require('../models/Aluno');
const storageService = require('../services/StorageService');

/**
 * Cadastra um novo aluno
 */
const cadastrarAluno = (req, res) => {
    try {
        // Verifica se o email já existe
        if (storageService.buscarAlunoPorEmail(req.body.email)) {
            return res.status(409).json({
                message: 'Email já cadastrado'
            });
        }

        // Cria o aluno
        const aluno = new Aluno(req.body);

        // Adiciona ao storage
        const alunoCadastrado = storageService.adicionarAluno(aluno);

        // Retorna apenas o ID e dados públicos
        res.status(201).json({
            message: 'Aluno cadastrado com sucesso',
            id: alunoCadastrado.id,
            nomeCompleto: alunoCadastrado.nomeCompleto,
            email: alunoCadastrado.email
        });
    } catch (error) {
        console.error('Erro ao cadastrar aluno:', error);
        res.status(500).json({
            message: 'Erro ao cadastrar aluno',
            error: error.message
        });
    }
};

/**
 * Lista todos os alunos
 */
const listarAlunos = (req, res) => {
    try {
        const alunos = storageService.listarAlunos();
        res.status(200).json(alunos);
    } catch (error) {
        console.error('Erro ao listar alunos:', error);
        res.status(500).json({
            message: 'Erro ao listar alunos',
            error: error.message
        });
    }
};

/**
 * Busca um aluno por ID
 */
const buscarAlunoPorId = (req, res) => {
    try {
        const aluno = storageService.buscarAlunoPorId(req.params.id);

        if (!aluno) {
            return res.status(404).json({
                message: 'Aluno não encontrado'
            });
        }

        res.status(200).json(aluno.toJSON());
    } catch (error) {
        console.error('Erro ao buscar aluno:', error);
        res.status(500).json({
            message: 'Erro ao buscar aluno',
            error: error.message
        });
    }
};

module.exports = {
    cadastrarAluno,
    listarAlunos,
    buscarAlunoPorId
};
