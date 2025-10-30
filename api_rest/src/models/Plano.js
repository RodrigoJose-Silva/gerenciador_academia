/**
 * Modelo de Plano
 * Define a estrutura de dados para cadastro de planos de academia
 */

class Plano {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.nome = data.nome;
        this.descricao = data.descricao;
        this.valor = data.valor;
        this.duracao = data.duracao; // em meses
        this.modalidades = data.modalidades || [];
        this.ativo = data.ativo !== undefined ? data.ativo : true;
        this.dataCadastro = new Date().toISOString();
    }

    /**
     * Gera um ID único para o plano
     */
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    /**
     * Retorna os dados do plano
     */
    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            descricao: this.descricao,
            valor: this.valor,
            duracao: this.duracao,
            modalidades: this.modalidades,
            ativo: this.ativo,
            dataCadastro: this.dataCadastro
        };
    }
}

module.exports = Plano;