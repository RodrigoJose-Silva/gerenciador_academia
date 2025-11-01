/**
 * Controller de Autenticação
 * Gerencia o processo de autenticação de funcionários com controle de tentativas de login.
 * 
 * Funcionalidades:
 * - Login de funcionários com validação de credenciais
 * - Controle de tentativas de login (máximo 3 tentativas)
 * - Bloqueio automático de conta após exceder tentativas
 * - Reset de contador de tentativas ao bloquear conta e após login bem-sucedido
 * - Retorno padronizado de erros com message e descrição
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
 * @param {Request} req - Objeto de requisição Express contendo userName e senha no body
 * @param {Response} res - Objeto de resposta Express
 * @returns {Response} 
 * - 200: Login bem-sucedido, retorna { message, token }
 * - 401: Credenciais inválidas, retorna { message, tentativasRestantes }
 * - 403: Conta bloqueada, retorna { message }
 * - 500: Erro interno, retorna { message }
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
