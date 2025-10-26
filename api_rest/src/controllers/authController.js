/**
 * Controller de Autenticação
 * Gerencia o login de funcionários com controle de tentativas
 */

const bcrypt = require('bcrypt');
const storageService = require('../services/StorageService');
const { gerarToken } = require('../middlewares/authMiddleware');

const MAX_TENTATIVAS = 3;

/**
 * Realiza o login de um funcionário
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

        // Retorna os dados do funcionário e o token
        res.status(200).json({
            message: 'Login realizado com sucesso',
            token: token,
            funcionario: {
                id: funcionario.id,
                nomeCompleto: funcionario.nomeCompleto,
                userName: funcionario.userName,
                email: funcionario.email,
                cargo: funcionario.cargo,
                perfil: funcionario.perfil
            }
        });
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        res.status(500).json({
            message: 'Erro ao realizar login',
            error: error.message
        });
    }
};

module.exports = {
    login
};
