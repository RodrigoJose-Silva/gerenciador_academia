/**
 * Configuração do Administrador Padrão
 * Define as credenciais do administrador padrão para inicialização do sistema
 */

const bcrypt = require('bcrypt');
const { PERFIS } = require('../models/Permissions');

const DEFAULT_ADMIN = {
    nomeCompleto: 'Administrador do Sistema',
    email: 'admin@academia.com',
    userName: 'admin',
    senha: 'admin@123', // Será hasheada antes de salvar
    telefone: '(00) 00000-0000',
    dataNascimento: '2000-01-01',
    cpf: '000.000.000-00',
    cargo: 'Administrador do Sistema',
    perfil: PERFIS.ADMINISTRADOR,
    salario: 0
};

/**
 * Cria o hash da senha do administrador padrão
 * @returns {Promise<string>} Senha hasheada
 */
const getDefaultAdminWithHashedPassword = async () => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.senha, saltRounds);
    return {
        ...DEFAULT_ADMIN,
        senha: hashedPassword
    };
};

module.exports = {
    DEFAULT_ADMIN,
    getDefaultAdminWithHashedPassword
};