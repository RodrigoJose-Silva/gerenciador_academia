/**
 * Definição de Permissões e Perfis
 * Define os perfis de usuário e suas respectivas permissões
 */

// Perfis de usuário disponíveis
const PERFIS = {
    ADMINISTRADOR: 'ADMINISTRADOR',
    GERENTE: 'GERENTE',
    INSTRUTOR: 'INSTRUTOR',
    RECEPCIONISTA: 'RECEPCIONISTA'
};

// Permissões disponíveis no sistema
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

    // Relatórios
    GERAR_RELATORIOS: 'GERAR_RELATORIOS',
    VISUALIZAR_FINANCEIRO: 'VISUALIZAR_FINANCEIRO'
};

// Mapeamento de perfis para permissões
const PERMISSOES_POR_PERFIL = {
    [PERFIS.ADMINISTRADOR]: [
        PERMISSOES.LISTAR_ALUNOS,
        PERMISSOES.CRIAR_ALUNO,
        PERMISSOES.VISUALIZAR_ALUNO,
        PERMISSOES.EDITAR_ALUNO,
        PERMISSOES.EXCLUIR_ALUNO,
        PERMISSOES.LISTAR_FUNCIONARIOS,
        PERMISSOES.CRIAR_FUNCIONARIO,
        PERMISSOES.VISUALIZAR_FUNCIONARIO,
        PERMISSOES.EDITAR_FUNCIONARIO,
        PERMISSOES.EXCLUIR_FUNCIONARIO,
        PERMISSOES.GERAR_RELATORIOS,
        PERMISSOES.VISUALIZAR_FINANCEIRO
    ],
    [PERFIS.GERENTE]: [
        PERMISSOES.LISTAR_ALUNOS,
        PERMISSOES.CRIAR_ALUNO,
        PERMISSOES.VISUALIZAR_ALUNO,
        PERMISSOES.EDITAR_ALUNO,
        PERMISSOES.LISTAR_FUNCIONARIOS,
        PERMISSOES.VISUALIZAR_FUNCIONARIO,
        PERMISSOES.GERAR_RELATORIOS,
        PERMISSOES.VISUALIZAR_FINANCEIRO
    ],
    [PERFIS.INSTRUTOR]: [
        PERMISSOES.LISTAR_ALUNOS,
        PERMISSOES.VISUALIZAR_ALUNO,
        PERMISSOES.EDITAR_ALUNO
    ],
    [PERFIS.RECEPCIONISTA]: [
        PERMISSOES.LISTAR_ALUNOS,
        PERMISSOES.CRIAR_ALUNO,
        PERMISSOES.VISUALIZAR_ALUNO,
        PERMISSOES.EDITAR_ALUNO
    ]
};

/**
 * Verifica se um perfil tem uma permissão específica
 * @param {string} perfil - Perfil do usuário
 * @param {string} permissao - Permissão a ser verificada
 * @returns {boolean} - True se tiver permissão, false caso contrário
 */
const temPermissao = (perfil, permissao) => {
    const permissoes = PERMISSOES_POR_PERFIL[perfil] || [];
    return permissoes.includes(permissao);
};

/**
 * Retorna todas as permissões de um perfil
 * @param {string} perfil - Perfil do usuário
 * @returns {Array} - Array de permissões
 */
const obterPermissoes = (perfil) => {
    return PERMISSOES_POR_PERFIL[perfil] || [];
};

module.exports = {
    PERFIS,
    PERMISSOES,
    temPermissao,
    obterPermissoes
};
