/**
 * Middleware de Autenticação
 * Verifica e valida tokens JWT nas requisições
 */

const jwt = require('jsonwebtoken');
const { PERMISSOES, temPermissao } = require('../models/Permissions');

// Chave secreta para assinar os tokens (em produção deve vir de variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_academia_2024';

/**
 * Middleware para verificar se o usuário está autenticado
 * Extrai e valida o token JWT do header Authorization
 */
const autenticar = (req, res, next) => {
    try {
        // Extrai o token do header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: 'Token não fornecido'
            });
        }

        // O formato esperado é: "Bearer <token>"
        const parts = authHeader.split(' ');

        if (parts.length !== 2) {
            return res.status(401).json({
                message: 'Formato de token inválido'
            });
        }

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({
                message: 'Token mal formado'
            });
        }

        // Verifica e decodifica o token
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: 'Token inválido ou expirado'
                });
            }

            // Adiciona as informações do usuário decodificado na requisição
            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao processar autenticação',
            error: error.message
        });
    }
};

/**
 * Middleware para verificar se o usuário tem uma permissão específica
 * @param {string} permissao - Permissão necessária para acessar o recurso
 * @returns {Function} - Middleware do Express
 */
const verificarPermissao = (permissao) => {
    return (req, res, next) => {
        // Verifica se o usuário está autenticado
        if (!req.user) {
            return res.status(401).json({
                message: 'Usuário não autenticado'
            });
        }

        // Verifica se o usuário tem a permissão necessária
        const perfil = req.user.perfil;

        if (!temPermissao(perfil, permissao)) {
            return res.status(403).json({
                message: 'Acesso negado. Você não tem permissão para realizar esta ação',
                permissaoRequerida: permissao,
                seuPerfil: perfil
            });
        }

        next();
    };
};

/**
 * Middleware para verificar se o usuário tem uma das permissões especificadas
 * @param {Array} permissoes - Array de permissões aceitas
 * @returns {Function} - Middleware do Express
 */
const verificarAlgumaPermissao = (permissoes) => {
    return (req, res, next) => {
        // Verifica se o usuário está autenticado
        if (!req.user) {
            return res.status(401).json({
                message: 'Usuário não autenticado'
            });
        }

        // Verifica se o usuário tem pelo menos uma das permissões
        const perfil = req.user.perfil;
        const temAcesso = permissoes.some(permissao => temPermissao(perfil, permissao));

        if (!temAcesso) {
            return res.status(403).json({
                message: 'Acesso negado. Você não tem permissão para realizar esta ação',
                permissoesRequeridas: permissoes,
                seuPerfil: perfil
            });
        }

        next();
    };
};

/**
 * Gera um token JWT para um usuário
 * @param {Object} user - Dados do usuário (id, userName, perfil)
 * @returns {string} - Token JWT
 */
const gerarToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            userName: user.userName,
            perfil: user.perfil
        },
        JWT_SECRET,
        { expiresIn: '24h' } // Token expira em 24 horas
    );
};

module.exports = {
    autenticar,
    verificarPermissao,
    verificarAlgumaPermissao,
    gerarToken
};
