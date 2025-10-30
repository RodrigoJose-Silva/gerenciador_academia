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

/**
 * Atualiza um aluno existente
 */
const atualizarAluno = (req, res) => {
    try {
        const aluno = storageService.buscarAlunoPorId(req.params.id);

        if (!aluno) {
            return res.status(404).json({
                message: 'Aluno não encontrado'
            });
        }

        // Atualiza os campos fornecidos
        if (req.body.nomeCompleto) aluno.nomeCompleto = req.body.nomeCompleto;
        if (req.body.telefone) aluno.telefone = req.body.telefone;
        if (req.body.dataNascimento) aluno.dataNascimento = req.body.dataNascimento;
        if (req.body.cpf) aluno.cpf = req.body.cpf;
        if (req.body.planoId) aluno.planoId = req.body.planoId;
        if (req.body.dataInicio) aluno.dataInicio = req.body.dataInicio;
        if (req.body.endereco) {
            if (req.body.endereco.rua) aluno.endereco.rua = req.body.endereco.rua;
            if (req.body.endereco.numero) aluno.endereco.numero = req.body.endereco.numero;
            if (req.body.endereco.complemento !== undefined) aluno.endereco.complemento = req.body.endereco.complemento;
            if (req.body.endereco.bairro) aluno.endereco.bairro = req.body.endereco.bairro;
            if (req.body.endereco.cidade) aluno.endereco.cidade = req.body.endereco.cidade;
            if (req.body.endereco.estado) aluno.endereco.estado = req.body.endereco.estado;
            if (req.body.endereco.cep) aluno.endereco.cep = req.body.endereco.cep;
        }
        if (req.body.informacoesMedicas !== undefined) aluno.informacoesMedicas = req.body.informacoesMedicas;

        res.status(200).json({
            message: 'Aluno atualizado com sucesso',
            aluno: aluno.toJSON()
        });
    } catch (error) {
        console.error('Erro ao atualizar aluno:', error);
        res.status(500).json({
            message: 'Erro ao atualizar aluno',
            error: error.message
        });
    }
};

/**
 * Deleta um aluno
 */
const deletarAluno = (req, res) => {
    try {
        const aluno = storageService.buscarAlunoPorId(req.params.id);

        if (!aluno) {
            return res.status(404).json({
                message: 'Aluno não encontrado'
            });
        }

        storageService.deletarAluno(req.params.id);

        res.status(200).json({
            message: 'Aluno deletado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar aluno:', error);
        res.status(500).json({
            message: 'Erro ao deletar aluno',
            error: error.message
        });
    }
};

module.exports = {
    cadastrarAluno,
    listarAlunos,
    buscarAlunoPorId,
    atualizarAluno,
    deletarAluno
};
