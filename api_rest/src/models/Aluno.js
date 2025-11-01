/**
 * Modelo de Aluno
 * Define a estrutura de dados para cadastro e gerenciamento de alunos
 * 
 * Este modelo representa um aluno da academia e contém todos os campos
 * necessários para o seu cadastro e gerenciamento, incluindo:
 * - Dados pessoais (nome, email, telefone, CPF)
 * - Dados do plano (planoId, dataInicio)
 * - Dados de endereço
 * - Dados médicos (quando aplicável)
 * - Dados de controle (status, tentativas de login, bloqueio)
 * 
 * O ID do aluno é gerenciado automaticamente pelo StorageService
 * e não deve ser fornecido durante a criação do objeto.
 */

class Aluno {
    /**
     * Formata uma data para o padrão AAAA-MM-DD
     * @param {Date|string} data - Data a ser formatada
     * @returns {string} Data formatada no padrão AAAA-MM-DD
     */
    formatarData(data) {
        if (!data) return null;
        const dataObj = data instanceof Date ? data : new Date(data);
        if (isNaN(dataObj.getTime())) return null;
        return dataObj.toISOString().split('T')[0];
    }
    /**
     * Formata o número de telefone para o padrão (XX) XXXXX-XXXX
     * @param {string} telefone - Número de telefone sem formatação
     * @returns {string} Número de telefone formatado
     */
    formatarTelefone(telefone) {
        if (!telefone) return null;
        const numero = telefone.replace(/\D/g, '');
        return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`;
    }

    /**
     * Formata o CPF para o padrão XXX.XXX.XXX-XX
     * @param {string} cpf - CPF sem formatação
     * @returns {string} CPF formatado
     */
    formatarCPF(cpf) {
        if (!cpf) return null;
        const numero = cpf.replace(/\D/g, '');
        return `${numero.slice(0, 3)}.${numero.slice(3, 6)}.${numero.slice(6, 9)}-${numero.slice(9)}`;
    }

    constructor(data) {
        this.id = null; // Será definido pelo StorageService
        this.nomeCompleto = data.nomeCompleto;
        this.email = data.email;
        this.telefone = data.telefone;
        this.dataNascimento = this.formatarData(data.dataNascimento);
        this.cpf = data.cpf || null;
        this.planoId = data.planoId || 'MUSCULAÇÃO';
        this.dataInicio = this.formatarData(data.dataInicio) || this.formatarData(new Date());
        this.status = 'ATIVO'; // Status default para novos alunos
        this.endereco = {
            rua: data.endereco.rua,
            numero: data.endereco.numero,
            complemento: data.endereco.complemento || null,
            bairro: data.endereco.bairro || null,
            cidade: data.endereco.cidade,
            estado: data.endereco.estado,
            cep: data.endereco.cep
        };
        this.informacoesMedicas = data.informacoesMedicas || null;
        this.dataCadastro = this.formatarData(new Date());
        this.tentativasLogin = 0;
        this.bloqueado = false;
    }

    /**
     * Retorna os dados do aluno sem informações sensíveis
     */
    toJSON() {
        return {
            id: this.id,
            nomeCompleto: this.nomeCompleto,
            email: this.email,
            telefone: this.telefone,
            dataNascimento: this.dataNascimento,
            planoId: this.planoId,
            dataInicio: this.dataInicio
        };
    }

    /**
     * Retorna todos os dados do aluno incluindo endereço e informações médicas
     * com telefone e CPF formatados
     */
    toFullJSON() {
        return {
            id: this.id,
            nomeCompleto: this.nomeCompleto,
            email: this.email,
            telefone: this.formatarTelefone(this.telefone),
            dataNascimento: this.dataNascimento,
            cpf: this.formatarCPF(this.cpf),
            planoId: this.planoId,
            dataInicio: this.dataInicio,
            status: this.status,
            endereco: this.endereco,
            informacoesMedicas: this.informacoesMedicas,
            dataCadastro: this.dataCadastro,
            bloqueado: this.bloqueado
        };
    }
}

module.exports = Aluno;
