/**
 * Controlador de Checkins
 * Gerencia as operações relacionadas aos checkins de alunos na academia
 * 
 * Este controlador implementa as seguintes funcionalidades:
 * - Registro de entrada de alunos (checkin)
 * - Listagem de todos os checkins
 * - Busca de checkin específico por ID
 * - Listagem de checkins por aluno
 * - Exclusão de registros de checkin
 * 
 * Características importantes:
 * - O ID do checkin é gerado automaticamente
 * - Data e hora são registradas automaticamente
 * - O funcionário que registrou o checkin é identificado
 * - Validações garantem que o aluno existe no sistema
 * 
 * Respostas padronizadas:
 * - Sucesso em criação: Apenas ID
 * - Erro de validação: Campo específico e mensagem
 * - Erro de aluno não encontrado: Mensagem específica
 * - Erro interno: Mensagem descritiva
 */

const { validationResult } = require('express-validator');
const Checkin = require('../models/Checkin');
const storageService = require('../services/StorageService');

/**
 * Registra um novo checkin
 * 
 * @description
 * Realiza o registro de entrada de um aluno na academia.
 * Valida a existência do aluno e registra informações automáticas como data/hora.
 * 
 * @param {Request} req - Objeto de requisição Express contendo alunoId e observação opcional
 * @param {Response} res - Objeto de resposta Express
 * 
 * @returns {Response}
 * Status 201: Checkin registrado com sucesso
 * - Retorna: { id: string }
 * 
 * Status 400: Erro de validação
 * - Retorna: { message: string, field: string }
 * 
 * Status 404: Aluno não encontrado
 * - Retorna: { message: string }
 * 
 * Status 500: Erro interno do servidor
 * - Retorna: { message: string }
 * 
 * @example
 * Exemplo de payload:
 * {
 *   "alunoId": "123456789",
 *   "observacao": "Treino de musculação"
 * }
 * 
 * @security
 * - Requer autenticação do funcionário
 * - O ID do funcionário é registrado automaticamente
 */
const registrarCheckin = (req, res) => {
    try {
        // Verifica se há erros de validação
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return res.status(400).json({
                message: errorArray[0].msg,
                field: errorArray[0].path
            });
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
            id: checkinSalvo.id
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao registrar checkin: ' + error.message
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
 * @param {Request} req - Objeto de requisição do Express
 * @param {Response} res - Objeto de resposta do Express
 * @returns {Response} Resposta da operação de exclusão
 */
const excluirCheckin = (req, res) => {
    try {
        // Valida se o ID foi fornecido
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                message: 'ID do checkin é obrigatório'
            });
        }

        // Converte o ID para número e valida
        const numericId = Number(id);
        if (isNaN(numericId)) {
            return res.status(400).json({
                message: 'ID do checkin inválido'
            });
        }

        // Verifica se o checkin existe
        const checkinExistente = storageService.buscarCheckinPorId(numericId);
        if (!checkinExistente) {
            return res.status(404).json({
                message: 'Checkin não encontrado'
            });
        }

        // Tenta excluir o checkin
        const deletado = storageService.deletarCheckin(numericId);
        if (!deletado) {
            return res.status(500).json({
                message: 'Erro ao excluir checkin. Operação não realizada.'
            });
        }

        // Retorna sucesso com o ID excluído
        return res.status(200).json({
            message: 'Checkin excluído com sucesso',
            id: numericId
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