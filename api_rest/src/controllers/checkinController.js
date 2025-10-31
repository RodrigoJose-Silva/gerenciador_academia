/**
 * Controlador de Checkins
 * Gerencia as operações relacionadas aos checkins de alunos na academia
 */

const { validationResult } = require('express-validator');
const Checkin = require('../models/Checkin');
const storageService = require('../services/StorageService');

/**
 * Registra um novo checkin
 * @param {Request} req - Objeto de requisição
 * @param {Response} res - Objeto de resposta
 */
const registrarCheckin = (req, res) => {
    try {
        // Verifica se há erros de validação
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { alunoId } = req.body;

        // Verifica se o aluno existe
        const aluno = storageService.buscarAlunoPorId(alunoId);
        if (!aluno) {
            return res.status(404).json({
                message: 'Aluno não encontrado'
            });
        }

        // Remove o ID do corpo da requisição e prepara os dados do checkin
        const dadosCheckin = {
            ...req.body
        };
        delete dadosCheckin.id;

        // Adiciona o ID do funcionário que está registrando o checkin (se autenticado)
        if (req.user) {
            dadosCheckin.registradoPor = req.user.id;
        }

        // Cria um novo checkin
        const novoCheckin = new Checkin(dadosCheckin);

        // Salva o checkin no serviço de armazenamento
        const checkinSalvo = storageService.adicionarCheckin(novoCheckin);

        return res.status(201).json({
            message: 'Checkin registrado com sucesso',
            checkin: checkinSalvo.toJSON()
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao registrar checkin',
            error: error.message
        });
    }
};

/**
 * Lista todos os checkins
 * @param {Request} req - Objeto de requisição
 * @param {Response} res - Objeto de resposta
 */
const listarCheckins = (req, res) => {
    try {
        // Obtém todos os checkins do serviço de armazenamento
        const checkins = storageService.listarCheckins();

        return res.status(200).json({
            checkins: checkins
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao listar checkins',
            error: error.message
        });
    }
};

/**
 * Busca um checkin pelo ID
 * @param {Request} req - Objeto de requisição
 * @param {Response} res - Objeto de resposta
 */
const buscarCheckinPorId = (req, res) => {
    try {
        const { id } = req.params;

        // Busca o checkin no serviço de armazenamento
        const checkin = storageService.buscarCheckinPorId(id);

        if (!checkin) {
            return res.status(404).json({
                message: 'Checkin não encontrado'
            });
        }

        return res.status(200).json({
            checkin: checkin
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao buscar checkin',
            error: error.message
        });
    }
};

/**
 * Lista todos os checkins de um aluno específico
 * @param {Request} req - Objeto de requisição
 * @param {Response} res - Objeto de resposta
 */
const listarCheckinsPorAluno = (req, res) => {
    try {
        const { alunoId } = req.params;

        // Verifica se o aluno existe
        const aluno = storageService.buscarAlunoPorId(alunoId);
        if (!aluno) {
            return res.status(404).json({
                message: 'Aluno não encontrado'
            });
        }

        // Busca os checkins do aluno
        const checkins = storageService.listarCheckinsPorAluno(alunoId);

        return res.status(200).json({
            aluno: aluno.toJSON(),
            checkins: checkins
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao listar checkins do aluno',
            error: error.message
        });
    }
};

/**
 * Exclui um checkin
 * @param {Request} req - Objeto de requisição
 * @param {Response} res - Objeto de resposta
 */
const excluirCheckin = (req, res) => {
    try {
        const { id } = req.params;

        // Verifica se o checkin existe
        const checkinExistente = storageService.buscarCheckinPorId(id);
        if (!checkinExistente) {
            return res.status(404).json({
                message: 'Checkin não encontrado'
            });
        }

        // Exclui o checkin do serviço de armazenamento
        storageService.deletarCheckin(id);

        return res.status(200).json({
            message: 'Checkin excluído com sucesso'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao excluir checkin',
            error: error.message
        });
    }
};

module.exports = {
    registrarCheckin,
    listarCheckins,
    buscarCheckinPorId,
    listarCheckinsPorAluno,
    excluirCheckin
};