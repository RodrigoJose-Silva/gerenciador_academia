/**
 * Controller de Autenticação
 * Gerencia o processo de autenticação de funcionários com controle de tentativas de login
 * 
 * Funcionalidades:
 * - Login de funcionários com validação de credenciais
 * - Controle de tentativas de login (máximo 3 tentativas)
 * - Bloqueio automático de conta após exceder tentativas
 * - Reset de contador de tentativas após login bem-sucedido
 */

const bcrypt = require('bcrypt');
const storageService = require('../services/StorageService');
const { gerarToken } = require('../middlewares/authMiddleware');

const MAX_TENTATIVAS = 3;

/**
 * Realiza o login de um funcionário
 * 
 * @param {Request} req - Objeto de requisição Express contendo userName e senha no body
 * @param {Response} res - Objeto de resposta Express
 * @returns {Response} - Retorna status 200 e token JWT se autenticado com sucesso
 *                      - Retorna status 401 se credenciais inválidas
 *                      - Retorna status 403 se conta bloqueada
 *                      - Retorna status 500 em caso de erro interno
 */
const login = async (req, res) => {
    try {
        const { userName, senha } = req.body;

        // Busca o funcionário pelo userName
        const funcionario = storageService.buscarFuncionarioPorUserName(userName);

        // Verifica se o funcionário existe
        if (!funcionario) {
            return res.status(401).json({
                message: 'Credenciais inválidas'
            });
        }

        // Verifica se o funcionário está bloqueado
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

            // Bloqueia se atingir o máximo de tentativas
            if (funcionario.tentativasLogin >= MAX_TENTATIVAS) {
                funcionario.bloqueado = true;
                storageService.atualizarTentativasLoginFuncionario(
                    userName,
                    funcionario.tentativasLogin,
                    true
                );

                return res.status(403).json({
                    message: 'Conta bloqueada. Você excedeu o número máximo de tentativas'
                });
            }

            // Atualiza as tentativas
            storageService.atualizarTentativasLoginFuncionario(
                userName,
                funcionario.tentativasLogin,
                false
            );

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
