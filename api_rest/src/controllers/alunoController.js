/**
 * Controller de Aluno
 * Gerencia as operações relacionadas ao cadastro e gerenciamento de alunos
 *
 * Este controller implementa as seguintes funcionalidades:
 * - Cadastro de novos alunos com validação de dados
 * - Listagem de todos os alunos
 * - Busca de aluno por ID
 * - Atualização de dados do aluno
 * - Exclusão de aluno
 * 
 * Observações importantes:
 * - O ID do aluno é gerado automaticamente pelo sistema
 * - Em caso de sucesso no cadastro, apenas o ID do novo aluno é retornado
 * - Em caso de erro de validação, retorna o campo específico e a mensagem de erro
 * - O email do aluno é único no sistema
 */

const Aluno = require('../models/Aluno');
const storageService = require('../services/StorageService');

/**
 * Cadastra um novo aluno
 * 
 * @description 
 * Realiza o cadastro de um novo aluno no sistema. 
 * Verifica se o email já está cadastrado antes de prosseguir.
 * Remove o ID do corpo da requisição para garantir que seja gerado automaticamente.
 * 
 * @param {Request} req - Objeto de requisição Express
 * @param {Response} res - Objeto de resposta Express
 * 
 * @returns {Response} 
 * - Status 201: Aluno cadastrado com sucesso (retorna apenas o ID)
 * - Status 409: Email já cadastrado
 * - Status 500: Erro interno do servidor
 */
const cadastrarAluno = (req, res) => {
    try {
        // Verifica se o email já existe
        if (storageService.buscarAlunoPorEmail(req.body.email)) {
            return res.status(409).json({
                message: 'Email já cadastrado'
            });
        }

        // Remove o ID do corpo da requisição para garantir que seja gerado automaticamente
        const dadosAluno = { ...req.body };
        delete dadosAluno.id;

        // Cria o aluno com os dados filtrados
        const aluno = new Aluno(dadosAluno);

        // Adiciona ao storage
        const alunoCadastrado = storageService.adicionarAluno(aluno);

        // Retorna apenas o ID do novo registro
        res.status(201).json({
            id: alunoCadastrado.id
        });
    } catch (error) {
        console.error('Erro ao cadastrar aluno:', error);
        res.status(500).json({
            message: 'Erro ao cadastrar aluno: ' + error.message
        });
    }
};

/**
 * Lista todos os alunos cadastrados
 * 
 * @description
 * Retorna uma lista completa de todos os alunos cadastrados no sistema,
 * incluindo todos os dados de cada aluno com telefone e CPF formatados.
 * 
 * @param {Request} req - Objeto de requisição Express
 * @param {Response} res - Objeto de resposta Express
 * 
 * @returns {Response}
 * - Status 200: Lista de alunos com todos os dados
 * - Status 500: Erro interno do servidor
 */
const listarAlunos = (req, res) => {
    try {
        const alunos = storageService.listarAlunos().map(aluno => aluno.toFullJSON());
        res.status(200).json(alunos);
    } catch (error) {
        console.error('Erro ao listar alunos:', error);
        res.status(500).json({
            message: 'Erro ao listar alunos: ' + error.message
        });
    }
};

/**
 * Busca um aluno por ID
 * 
 * @description
 * Retorna os dados completos de um aluno específico com base no seu ID,
 * incluindo todos os dados cadastrais com telefone e CPF formatados.
 * 
 * @param {Request} req - Objeto de requisição Express
 * @param {Response} res - Objeto de resposta Express
 * 
 * @returns {Response}
 * - Status 200: Dados completos do aluno
 * - Status 404: Aluno não encontrado
 * - Status 500: Erro interno do servidor
 */
const buscarAlunoPorId = (req, res) => {
    try {
        const aluno = storageService.buscarAlunoPorId(req.params.id);

        if (!aluno) {
            return res.status(404).json({
                message: 'Aluno não encontrado'
            });
        }

        res.status(200).json(aluno.toFullJSON());
    } catch (error) {
        console.error('Erro ao buscar aluno:', error);
        res.status(500).json({
            message: 'Erro ao buscar aluno: ' + error.message
        });
    }
};

/**
 * Atualiza um aluno existente
 * 
 * @description
 * Esta função permite a atualização parcial dos dados de um aluno.
 * Apenas os campos fornecidos no payload serão atualizados, mantendo os demais inalterados.
 * O campo status só aceita os valores: ATIVO, BLOQUEADO e INATIVO.
 * 
 * @param {Request} req - Objeto de requisição Express
 * @param {Response} res - Objeto de resposta Express
 * 
 * @returns {Response}
 * - Status 200: Aluno atualizado com sucesso (retorna apenas mensagem)
 * - Status 404: Aluno não encontrado
 * - Status 400: Dados inválidos fornecidos
 * - Status 500: Erro interno do servidor
 */
const atualizarAluno = (req, res) => {
    try {
        const aluno = storageService.buscarAlunoPorId(req.params.id);

        if (!aluno) {
            return res.status(404).json({
                message: 'Aluno não encontrado'
            });
        }

        try {
            // Atualiza o status se fornecido
            if (req.body.status !== undefined) {
                aluno.status = aluno.validarStatus(req.body.status);
            }

            // Atualiza os campos fornecidos
            if (req.body.nomeCompleto) aluno.nomeCompleto = req.body.nomeCompleto;
            if (req.body.telefone) aluno.telefone = req.body.telefone;
            if (req.body.dataNascimento) aluno.dataNascimento = aluno.formatarData(req.body.dataNascimento);
            if (req.body.cpf) aluno.cpf = req.body.cpf;
            if (req.body.planoId) aluno.planoId = req.body.planoId;
            if (req.body.dataInicio) aluno.dataInicio = aluno.formatarData(req.body.dataInicio);
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
                message: 'Aluno atualizado com sucesso'
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
     * @param {Request} req - Objeto de requisição do Express
     * @param {Response} res - Objeto de resposta do Express
     * @returns {Response} Resposta da operação de deleção
     */
    const deletarAluno = (req, res) => {
        try {
            // Valida se o ID foi fornecido
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({
                    message: 'ID do aluno é obrigatório'
                });
            }

            // Converte o ID para número e valida
            const numericId = Number(id);
            if (isNaN(numericId)) {
                return res.status(400).json({
                    message: 'ID do aluno inválido'
                });
            }

            // Verifica se o aluno existe
            const aluno = storageService.buscarAlunoPorId(numericId);
            if (!aluno) {
                return res.status(404).json({
                    message: 'Aluno não encontrado'
                });
            }

            // Tenta deletar o aluno
            const deletado = storageService.deletarAluno(numericId);
            if (!deletado) {
                return res.status(500).json({
                    message: 'Erro ao deletar aluno. Operação não realizada.'
                });
            }

            // Retorna sucesso com o ID deletado
            res.status(200).json({
                message: 'Aluno deletado com sucesso',
                id: numericId
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
