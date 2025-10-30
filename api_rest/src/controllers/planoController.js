/**
 * Controlador de Planos
 * Gerencia as operações relacionadas aos planos da academia
 */

const { validationResult } = require('express-validator');
const Plano = require('../models/Plano');
const storageService = require('../services/StorageService');

/**
 * Cria um novo plano
 * @param {Request} req - Objeto de requisição
 * @param {Response} res - Objeto de resposta
 */
const criarPlano = (req, res) => {
    try {
        // Verifica se há erros de validação
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Cria um novo plano com os dados da requisição
        const novoPlano = new Plano(req.body);
        
        // Salva o plano no serviço de armazenamento
        const planoSalvo = storageService.adicionarPlano(novoPlano);
        
        return res.status(201).json({
            message: 'Plano criado com sucesso',
            plano: planoSalvo.toJSON()
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao criar plano',
            error: error.message
        });
    }
};

/**
 * Lista todos os planos
 * @param {Request} req - Objeto de requisição
 * @param {Response} res - Objeto de resposta
 */
const listarPlanos = (req, res) => {
    try {
        // Obtém todos os planos do serviço de armazenamento
        const planos = storageService.listarPlanos();
        
        return res.status(200).json({
            planos: planos
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao listar planos',
            error: error.message
        });
    }
};

/**
 * Busca um plano pelo ID
 * @param {Request} req - Objeto de requisição
 * @param {Response} res - Objeto de resposta
 */
const buscarPlanoPorId = (req, res) => {
    try {
        const { id } = req.params;
        
        // Busca o plano no serviço de armazenamento
        const plano = storageService.buscarPlanoPorId(id);
        
        if (!plano) {
            return res.status(404).json({
                message: 'Plano não encontrado'
            });
        }
        
        return res.status(200).json({
            plano: plano
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao buscar plano',
            error: error.message
        });
    }
};

/**
 * Atualiza um plano existente
 * @param {Request} req - Objeto de requisição
 * @param {Response} res - Objeto de resposta
 */
const atualizarPlano = (req, res) => {
    try {
        // Verifica se há erros de validação
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { id } = req.params;
        
        // Verifica se o plano existe
        const planoExistente = storageService.buscarPlanoPorId(id);
        if (!planoExistente) {
            return res.status(404).json({
                message: 'Plano não encontrado'
            });
        }
        
        // Cria um novo objeto com os dados atualizados
        const dadosAtualizados = {
            ...planoExistente,
            ...req.body,
            id // Garante que o ID não seja alterado
        };
        
        // Atualiza o plano no serviço de armazenamento
        const planoAtualizado = storageService.atualizarPlano(id, new Plano(dadosAtualizados));
        
        return res.status(200).json({
            message: 'Plano atualizado com sucesso',
            plano: planoAtualizado
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao atualizar plano',
            error: error.message
        });
    }
};

/**
 * Exclui um plano
 * @param {Request} req - Objeto de requisição
 * @param {Response} res - Objeto de resposta
 */
const excluirPlano = (req, res) => {
    try {
        const { id } = req.params;
        
        // Verifica se o plano existe
        const planoExistente = storageService.buscarPlanoPorId(id);
        if (!planoExistente) {
            return res.status(404).json({
                message: 'Plano não encontrado'
            });
        }
        
        // Exclui o plano do serviço de armazenamento
        storageService.deletarPlano(id);
        
        return res.status(200).json({
            message: 'Plano excluído com sucesso'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao excluir plano',
            error: error.message
        });
    }
};

module.exports = {
    criarPlano,
    listarPlanos,
    buscarPlanoPorId,
    atualizarPlano,
    excluirPlano
};