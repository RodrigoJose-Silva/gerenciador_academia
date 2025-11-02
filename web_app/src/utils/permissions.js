/**
 * Utilitário para verificação de permissões
 */

/**
 * Lista de todas as permissões disponíveis
 */
const PERMISSOES = {
    // Alunos
    LISTAR_ALUNOS: 'LISTAR_ALUNOS',
    CRIAR_ALUNO: 'CRIAR_ALUNO',
    VISUALIZAR_ALUNO: 'VISUALIZAR_ALUNO',
    EDITAR_ALUNO: 'EDITAR_ALUNO',
    EXCLUIR_ALUNO: 'EXCLUIR_ALUNO',

    // Funcionários
    LISTAR_FUNCIONARIOS: 'LISTAR_FUNCIONARIOS',
    CRIAR_FUNCIONARIO: 'CRIAR_FUNCIONARIO',
    VISUALIZAR_FUNCIONARIO: 'VISUALIZAR_FUNCIONARIO',
    EDITAR_FUNCIONARIO: 'EDITAR_FUNCIONARIO',
    EXCLUIR_FUNCIONARIO: 'EXCLUIR_FUNCIONARIO',

    // Planos
    LISTAR_PLANOS: 'LISTAR_PLANOS',
    CRIAR_PLANO: 'CRIAR_PLANO',
    VISUALIZAR_PLANO: 'VISUALIZAR_PLANO',
    EDITAR_PLANO: 'EDITAR_PLANO',
    EXCLUIR_PLANO: 'EXCLUIR_PLANO',

    // Check-ins
    LISTAR_CHECKINS: 'LISTAR_CHECKINS',
    CRIAR_CHECKIN: 'CRIAR_CHECKIN',
    VISUALIZAR_CHECKIN: 'VISUALIZAR_CHECKIN',
    EXCLUIR_CHECKIN: 'EXCLUIR_CHECKIN'
};

/**
 * Perfis de usuário disponíveis
 */
const PERFIS = {
    ADMINISTRADOR: 'ADMINISTRADOR',
    GERENTE: 'GERENTE',
    INSTRUTOR: 'INSTRUTOR',
    RECEPCIONISTA: 'RECEPCIONISTA'
};

/**
 * Mapeamento de perfis para permissões
 */
const PERMISSOES_POR_PERFIL = {
    [PERFIS.ADMINISTRADOR]: Object.values(PERMISSOES),
    [PERFIS.GERENTE]: [
        PERMISSOES.LISTAR_ALUNOS,
        PERMISSOES.CRIAR_ALUNO,
        PERMISSOES.VISUALIZAR_ALUNO,
        PERMISSOES.EDITAR_ALUNO,
        PERMISSOES.LISTAR_FUNCIONARIOS,
        PERMISSOES.VISUALIZAR_FUNCIONARIO,
        PERMISSOES.LISTAR_PLANOS,
        PERMISSOES.CRIAR_PLANO,
        PERMISSOES.VISUALIZAR_PLANO,
        PERMISSOES.EDITAR_PLANO,
        PERMISSOES.LISTAR_CHECKINS,
        PERMISSOES.CRIAR_CHECKIN,
        PERMISSOES.VISUALIZAR_CHECKIN
    ],
    [PERFIS.INSTRUTOR]: [
        PERMISSOES.LISTAR_ALUNOS,
        PERMISSOES.VISUALIZAR_ALUNO,
        PERMISSOES.LISTAR_PLANOS,
        PERMISSOES.VISUALIZAR_PLANO,
        PERMISSOES.LISTAR_CHECKINS,
        PERMISSOES.CRIAR_CHECKIN,
        PERMISSOES.VISUALIZAR_CHECKIN
    ],
    [PERFIS.RECEPCIONISTA]: [
        PERMISSOES.LISTAR_ALUNOS,
        PERMISSOES.CRIAR_ALUNO,
        PERMISSOES.VISUALIZAR_ALUNO,
        PERMISSOES.LISTAR_PLANOS,
        PERMISSOES.VISUALIZAR_PLANO,
        PERMISSOES.LISTAR_CHECKINS,
        PERMISSOES.CRIAR_CHECKIN,
        PERMISSOES.VISUALIZAR_CHECKIN
    ]
};

/**
 * Verifica se um perfil tem uma permissão específica
 * @param {string} perfil - Perfil do usuário
 * @param {string} permissao - Permissão a ser verificada
 * @returns {boolean} - true se tem permissão, false caso contrário
 */
const temPermissao = (perfil, permissao) => {
    const permissoes = PERMISSOES_POR_PERFIL[perfil] || [];
    return permissoes.includes(permissao);
};

/**
 * Retorna todas as permissões de um perfil
 * @param {string} perfil - Perfil do usuário
 * @returns {Array} - Array com todas as permissões do perfil
 */
const obterPermissoes = (perfil) => {
    return PERMISSOES_POR_PERFIL[perfil] || [];
};

module.exports = {
    PERMISSOES,
    PERFIS,
    temPermissao,
    obterPermissoes
};