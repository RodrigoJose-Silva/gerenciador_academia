/**
 * Controller de Autenticação
 * Gerencia o processo de autenticação de funcionários com controle de tentativas de login
 * 
 * Este controller implementa um sistema de autenticação com as seguintes características:
 * 
 * Funcionalidades principais:
 * - Login de funcionários com validação de credenciais
 * - Controle de tentativas de login (máximo 3 tentativas)
 * - Bloqueio automático de conta após exceder tentativas
 * - Reset de contador de tentativas após login bem-sucedido
 * 
 * Fluxo de autenticação:
 * 1. Valida as credenciais (userName e senha)
 * 2. Se as credenciais são válidas:
 *    - Reseta o contador de tentativas
 *    - Gera um token JWT
 *    - Retorna apenas o token e mensagem de sucesso
 * 3. Se as credenciais são inválidas:
 *    - Incrementa o contador de tentativas
 *    - Se atingiu o limite, bloqueia a conta
 *    - Informa o número de tentativas restantes
 * 
 * Segurança:
 * - Senhas são armazenadas com hash bcrypt
 * - Tokens JWT são gerados com informações mínimas necessárias
 * - Sistema de bloqueio automático protege contra força bruta
 */

const bcrypt = require('bcrypt');
const storageService = require('../services/StorageService');
const { gerarToken } = require('../middlewares/authMiddleware');

const MAX_TENTATIVAS = 3;

/**
 * Realiza o login de um funcionário.
 * 
 * Esta função implementa o processo de autenticação com as seguintes características:
 * - Validação de credenciais (userName e senha)
 * - Controle de tentativas de login com bloqueio após 3 falhas
 * - Reset de tentativas após bloqueio ou login bem-sucedido
 * 
 * @description
 * Processa a autenticação de um funcionário no sistema.
 * O processo inclui validação de credenciais, controle de tentativas e
 * bloqueio automático em caso de múltiplas falhas.
 * 
 * @param {Request} req - Objeto de requisição Express contendo userName e senha no body
 * @param {Response} res - Objeto de resposta Express
 * 
 * @returns {Response} 
 * Status 200: Login realizado com sucesso
 * - Retorna: { message: string, token: string }
 * - O contador de tentativas é resetado
 * 
 * Status 401: Credenciais inválidas
 * - Retorna: { message: string, tentativasRestantes: number }
 * - O contador de tentativas é incrementado
 * 
 * Status 403: Conta bloqueada
 * - Retorna: { message: string }
 * - Ocorre quando excede o número máximo de tentativas
 * 
 * Status 500: Erro interno do servidor
 * - Retorna: { message: string }
 * 
 * @security
 * - A senha é validada usando bcrypt
 * - O token JWT contém apenas id, userName e perfil do funcionário
 * - As tentativas são persistidas mesmo após reinicialização do servidor
 */
const login = async (req, res) => {
    try {
        const { userName, senha } = req.body;

        // Busca o funcionário pelo userName
        const funcionario = storageService.buscarFuncionarioPorUserName(userName);

        // Verifica se o funcionário existe
        // Retorna mensagem genérica para não revelar se o usuário existe ou não
        if (!funcionario) {
            return res.status(401).json({
                message: 'Credenciais inválidas'
            });
        }

        // Verifica se a conta do funcionário está bloqueada por excesso de tentativas
        if (funcionario.bloqueado) {
            return res.status(403).json({
                message: 'Conta bloqueada devido a múltiplas tentativas de login inválidas'
            });
        }

        // Verifica a senha
        const senhaValida = await bcrypt.compare(senha, funcionario.senha);

        if (!senhaValida) {
            // Incrementa o contador de tentativas
            funcionario.tentativasLogin += 1;

            // Atualiza as tentativas
            storageService.atualizarTentativasLoginFuncionario(
                userName,
                funcionario.tentativasLogin,
                false
            );

            // Bloqueia se atingir o máximo de tentativas
            if (funcionario.tentativasLogin >= MAX_TENTATIVAS) {
                // Reseta as tentativas antes de bloquear
                funcionario.tentativasLogin = 0;
                funcionario.bloqueado = true;
                storageService.atualizarTentativasLoginFuncionario(
                    userName,
                    0,
                    true
                );

                return res.status(403).json({
                    message: 'Conta bloqueada. Você excedeu o número máximo de tentativas'
                });
            }

            const tentativasRestantes = MAX_TENTATIVAS - funcionario.tentativasLogin;

            return res.status(401).json({
                message: 'Credenciais inválidas',
                tentativasRestantes: tentativasRestantes
            });
        }

        // Login bem-sucedido - reseta as tentativas
        funcionario.tentativasLogin = 0;
        storageService.atualizarTentativasLoginFuncionario(userName, 0, false);

        // Gera o token JWT
        const token = gerarToken({
            id: funcionario.id,
            userName: funcionario.userName,
            perfil: funcionario.perfil
        });

        // Retorna apenas a mensagem e o token
        res.status(200).json({
            message: 'Login realizado com sucesso',
            token: token
        });
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        res.status(500).json({
            message: 'Erro ao realizar login: ' + error.message
        });
    }
};

module.exports = {
    login
};
