/**
 * Modelo de Aluno
 * Define a estrutura de dados para cadastro de alunos
 */

class Aluno {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.nomeCompleto = data.nomeCompleto;
        this.email = data.email;
        this.telefone = data.telefone;
        this.dataNascimento = data.dataNascimento;
        this.cpf = data.cpf || null;
        this.planoId = data.planoId || 'MUSCULAÇÃO';
        this.dataInicio = data.dataInicio || new Date().toISOString().split('T')[0];
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
        this.dataCadastro = new Date().toISOString();
        this.tentativasLogin = 0;
        this.bloqueado = false;
    }

    /**
     * Gera um ID único para o aluno
     */
    generateId() {
        return Math.random().toString(36).substr(2, 9);
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
     * Retorna todos os dados do aluno incluindo endereço
     */
    toFullJSON() {
        return {
            id: this.id,
            nomeCompleto: this.nomeCompleto,
            email: this.email,
            telefone: this.telefone,
            dataNascimento: this.dataNascimento,
            cpf: this.cpf,
            planoId: this.planoId,
            dataInicio: this.dataInicio,
            endereco: this.endereco,
            informacoesMedicas: this.informacoesMedicas,
            dataCadastro: this.dataCadastro
        };
    }
}

module.exports = Aluno;
