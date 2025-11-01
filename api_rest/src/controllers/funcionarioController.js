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

        // Remove o ID do corpo da requisição para garantir que seja gerado automaticamente
        const dadosFuncionario = { ...req.body };
        delete dadosFuncionario.id;

        // Hash da senha
        const senhaHash = await bcrypt.hash(dadosFuncionario.senha, 10);

        // Cria o funcionário com senha hash
        const funcionarioData = {
            ...dadosFuncionario,
            senha: senhaHash
        };

        const funcionario = new Funcionario(funcionarioData);

        // Adiciona ao storage
        const funcionarioCadastrado = storageService.adicionarFuncionario(funcionario);

        // Retorna apenas o ID
        res.status(201).json({
            id: funcionarioCadastrado.id
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
/**
 * Lista todos os funcionários com dados completos formatados
 * Retorna um array com todos os funcionários cadastrados, incluindo dados pessoais e profissionais
 * O telefone e CPF são retornados com máscara de formatação
 */
const listarFuncionarios = (req, res) => {
    try {
        const funcionarios = storageService.listarFuncionarios();
        const funcionariosFormatados = funcionarios.map(funcionario => funcionario.toFullJSON());
        res.status(200).json(funcionariosFormatados);
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
/**
 * Busca um funcionário por ID
 * Retorna os dados completos do funcionário, incluindo informações pessoais e profissionais
 * O telefone e CPF são retornados com máscara de formatação
 */
const buscarFuncionarioPorId = (req, res) => {
    try {
        const funcionario = storageService.buscarFuncionarioPorId(req.params.id);

        if (!funcionario) {
            return res.status(404).json({
                message: 'Funcionário não encontrado'
            });
        }

        res.status(200).json(funcionario.toFullJSON());
    } catch (error) {
        console.error('Erro ao buscar funcionário:', error);
        res.status(500).json({
            message: 'Erro ao buscar funcionário',
            error: error.message
        });
    }
};

/**
 * Atualiza um funcionário existente
 * Aceita atualização parcial dos campos: email, telefone, cargo, perfil e salario
 */
const atualizarFuncionario = async (req, res) => {
    try {
        const funcionario = storageService.buscarFuncionarioPorId(req.params.id);

        if (!funcionario) {
            return res.status(404).json({
                message: 'Funcionário não encontrado'
            });
        }

        const camposPermitidos = ['email', 'telefone', 'cargo', 'perfil', 'salario'];
        const camposEnviados = Object.keys(req.body);

        // Verifica se existem campos não permitidos no payload
        const camposInvalidos = camposEnviados.filter(campo => !camposPermitidos.includes(campo));
        if (camposInvalidos.length > 0) {
            return res.status(400).json({
                message: `Campos não permitidos na atualização: ${camposInvalidos.join(', ')}`
            });
        }

        // Verifica se pelo menos um campo válido foi enviado
        const temCampoValido = camposEnviados.some(campo =>
            camposPermitidos.includes(campo) &&
            req.body[campo] !== null &&
            req.body[campo] !== '' &&
            req.body[campo] !== undefined
        );

        if (!temCampoValido) {
            return res.status(400).json({
                message: 'Pelo menos um campo válido deve ser fornecido para atualização'
            });
        }

        // Atualiza apenas os campos permitidos que foram fornecidos
        if (req.body.email !== undefined && req.body.email !== null && req.body.email !== '') {
            if (storageService.verificarEmailExistente(req.body.email) && funcionario.email !== req.body.email) {
                return res.status(409).json({
                    message: 'Email já cadastrado para outro funcionário'
                });
            }
            funcionario.email = req.body.email;
        }

        if (req.body.telefone !== undefined && req.body.telefone !== null && req.body.telefone !== '') {
            funcionario.telefone = req.body.telefone;
        }

        if (req.body.cargo !== undefined && req.body.cargo !== null && req.body.cargo !== '') {
            funcionario.cargo = req.body.cargo;
        }

        if (req.body.perfil !== undefined && req.body.perfil !== null && req.body.perfil !== '') {
            funcionario.perfil = req.body.perfil;
        }

        if (req.body.salario !== undefined && req.body.salario !== null) {
            funcionario.salario = req.body.salario;
        }

        res.status(200).json({
            message: 'Cadastro atualizado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar funcionário:', error);
        res.status(500).json({
            message: 'Erro ao atualizar funcionário',
            error: error.message
        });
    }
};

/**
 * Deleta um funcionário
 */
const deletarFuncionario = (req, res) => {
    try {
        const funcionario = storageService.buscarFuncionarioPorId(req.params.id);

        if (!funcionario) {
            return res.status(404).json({
                message: 'Funcionário não encontrado'
            });
        }

        storageService.deletarFuncionario(req.params.id);

        res.status(200).json({
            message: 'Funcionário deletado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar funcionário:', error);
        res.status(500).json({
            message: 'Erro ao deletar funcionário',
            error: error.message
        });
    }
};

module.exports = {
    cadastrarFuncionario,
    listarFuncionarios,
    buscarFuncionarioPorId,
    atualizarFuncionario,
    deletarFuncionario
};
