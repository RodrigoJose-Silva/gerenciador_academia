/**
 * Modelo de Checkin
 * Define a estrutura de dados para registro de entrada de alunos na academia
 */

class Checkin {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.alunoId = data.alunoId;
        this.dataHora = data.dataHora || new Date().toISOString();
        this.observacao = data.observacao || null;
        this.registradoPor = data.registradoPor || null; // ID do funcionário que registrou (opcional)
    }

    /**
     * Gera um ID único para o checkin
     */
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    /**
     * Retorna os dados do checkin
     */
    toJSON() {
        return {
            id: this.id,
            alunoId: this.alunoId,
            dataHora: this.dataHora,
            observacao: this.observacao,
            registradoPor: this.registradoPor
        };
    }
}

module.exports = Checkin;