/**
 * Controlador de Planos
 * Gerencia as operações relacionadas aos planos da academia
 * 
 * Este controlador implementa um CRUD completo para gestão de planos, incluindo:
 * - Criação de novos planos com validação de dados
 * - Listagem de todos os planos disponíveis
 * - Busca de plano específico por ID
 * - Atualização de dados do plano
 * - Exclusão de planos
 * 
 * Características importantes:
 * - O ID do plano é gerado automaticamente pelo sistema
 * - Em caso de sucesso na criação, apenas o ID do novo plano é retornado
 * - Validações garantem a integridade dos dados do plano
 * - Controle de acesso baseado em permissões de funcionários
 * 
 * Respostas padronizadas:
 * - Sucesso em criação: Apenas ID
 * - Erro de validação: Campo específico e mensagem
 * - Erro interno: Mensagem descritiva
 */

const { validationResult } = require('express-validator');
const Plano = require('../models/Plano');
const storageService = require('../services/StorageService');

/**
 * Cria um novo plano
 * 
 * @description
 * Realiza o cadastro de um novo plano no sistema.
 * Valida os dados recebidos e garante a geração automática do ID.
 * 
 * @param {Request} req - Objeto de requisição Express contendo dados do plano
 * @param {Response} res - Objeto de resposta Express
 * 
 * @returns {Response}
 * Status 201: Plano criado com sucesso
 * - Retorna: { id: string }
 * 
 * Status 400: Erro de validação
 * - Retorna: { message: string, field: string }
 * 
 * Status 500: Erro interno do servidor
 * - Retorna: { message: string }
 * 
 * @example
 * Exemplo de payload:
 * {
 *   "nome": "PLANO_PREMIUM",
 *   "descricao": "Acesso completo à academia",
 *   "valor": 150.00,
 *   "duracao": 30,
 *   "beneficios": ["Acesso ilimitado", "Aulas"]
 * }
 */
const criarPlano = (req, res) => {
    try {
        // Verifica se há erros de validação
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Remove o ID do corpo da requisição para garantir que seja gerado automaticamente
        const dadosPlano = { ...req.body };
        delete dadosPlano.id;

        // Cria um novo plano com os dados filtrados
        const novoPlano = new Plano(dadosPlano);

        // Salva o plano no serviço de armazenamento
        const planoSalvo = storageService.adicionarPlano(novoPlano);

        return res.status(201).json({
            id: planoSalvo.id
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
 * @param {Request} req - Objeto de requisição do Express
 * @param {Response} res - Objeto de resposta do Express
 * @returns {Response} Resposta da operação de exclusão
 */
const excluirPlano = (req, res) => {
    try {
        // Valida se o ID foi fornecido
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                message: 'ID do plano é obrigatório'
            });
        }

        // Converte o ID para número e valida
        const numericId = Number(id);
        if (isNaN(numericId)) {
            return res.status(400).json({
                message: 'ID do plano inválido'
            });
        }

        // Verifica se o plano existe
        const planoExistente = storageService.buscarPlanoPorId(numericId);
        if (!planoExistente) {
            return res.status(404).json({
                message: 'Plano não encontrado'
            });
        }

        // Tenta excluir o plano
        const deletado = storageService.deletarPlano(numericId);
        if (!deletado) {
            return res.status(500).json({
                message: 'Erro ao excluir plano. Operação não realizada.'
            });
        }

        // Retorna sucesso com o ID excluído
        return res.status(200).json({
            message: 'Plano excluído com sucesso',
            id: numericId
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