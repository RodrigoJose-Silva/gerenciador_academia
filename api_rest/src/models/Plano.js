/**
 * Modelo de Plano
 * Define a estrutura de dados para cadastro de planos de academia
 * 
 * @example
 * {
 *   "nome": "PLANO_PREMIUM",
 *   "modalidades": ["Acesso completo à academia e aulas"],
 *   "valor": 150.00,
 *   "duracao": 30,
 *   "beneficios": ["Acesso ilimitado", "Aulas coletivas", "Avaliação física mensal"]
 * }
 */

class Plano {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.nome = data.nome;
        this.modalidades = data.modalidades || [];
        this.valor = data.valor;
        this.duracao = data.duracao; // em dias
        this.beneficios = data.beneficios || [];
        this.ativo = data.ativo !== undefined ? data.ativo : true;
        this.dataCadastro = data.dataCadastro ||
            new Date().toISOString().split('T')[0]; // Formato AAAA-MM-DD
    }

    /**
     * Gera um ID único para o plano
     */
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    /**
     * Retorna os dados do plano no formato padronizado
     * @returns {Object} Dados do plano formatados
     */
    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            modalidades: this.modalidades,
            valor: this.valor,
            duracao: this.duracao,
            beneficios: this.beneficios,
            ativo: this.ativo,
            dataCadastro: this.dataCadastro
        };
    }
}

module.exports = Plano;