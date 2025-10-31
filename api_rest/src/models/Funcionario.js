/**
 * Modelo de Funcionário
 * Define a estrutura de dados para cadastro de funcionários
 * 
 * Este modelo representa um funcionário da academia e contém todos os campos
 * necessários para o seu cadastro e gerenciamento, incluindo:
 * - Dados pessoais (nome, email, telefone, etc.)
 * - Dados profissionais (cargo, salário, CREF)
 * - Dados de acesso (userName, senha, perfil)
 * - Dados de controle (tentativas de login, bloqueio)
 * 
 * O CREF (Registro do Profissional de Educação Física) é opcional,
 * sendo necessário apenas para funcionários que atuam como instrutores.
 */

const { PERFIS } = require('./Permissions');

class Funcionario {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.nomeCompleto = data.nomeCompleto;
        this.email = data.email;
        this.userName = data.userName;
        this.senha = data.senha;
        this.telefone = data.telefone;
        this.dataNascimento = data.dataNascimento;
        this.cpf = data.cpf || null;
        this.cargo = data.cargo;
        this.perfil = data.perfil || PERFIS.RECEPCIONISTA; // Define perfil padrão
        this.dataAdmissao = data.dataAdmissao || new Date().toISOString().split('T')[0];
        this.cref = data.cref || null;
        this.salario = data.salario;
        this.dataCadastro = new Date().toISOString();
        this.tentativasLogin = 0;
        this.bloqueado = false;
    }

    /**
     * Gera um ID único para o funcionário
     */
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    /**
     * Retorna os dados do funcionário sem informações sensíveis
     */
    toJSON() {
        return {
            id: this.id,
            nomeCompleto: this.nomeCompleto,
            email: this.email,
            userName: this.userName,
            telefone: this.telefone,
            dataNascimento: this.dataNascimento,
            cargo: this.cargo,
            perfil: this.perfil,
            dataAdmissao: this.dataAdmissao
        };
    }

    /**
     * Retorna todos os dados do funcionário incluindo salário
     */
    toFullJSON() {
        return {
            id: this.id,
            nomeCompleto: this.nomeCompleto,
            email: this.email,
            userName: this.userName,
            telefone: this.telefone,
            dataNascimento: this.dataNascimento,
            cpf: this.cpf,
            cargo: this.cargo,
            perfil: this.perfil,
            dataAdmissao: this.dataAdmissao,
            cref: this.cref,
            salario: this.salario,
            dataCadastro: this.dataCadastro
        };
    }
}

module.exports = Funcionario;
