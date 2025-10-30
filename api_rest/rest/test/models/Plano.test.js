/**
 * Testes para o modelo de Plano
 */

const Plano = require('../../../src/models/Plano');

describe('Modelo Plano', () => {
    // Dados de exemplo para testes
    const dadosPlano = {
        nome: 'Plano Premium',
        descricao: 'Acesso completo a todas as modalidades da academia',
        valor: 99.90,
        duracao: 12,
        modalidades: ['Musculação', 'Natação', 'Pilates'],
        ativo: true
    };

    test('Deve criar um plano com todos os campos obrigatórios', () => {
        const plano = new Plano(dadosPlano);

        // Verifica se o ID foi gerado
        expect(plano.id).toBeDefined();
        expect(typeof plano.id).toBe('string');

        // Verifica os campos obrigatórios
        expect(plano.nome).toBe(dadosPlano.nome);
        expect(plano.descricao).toBe(dadosPlano.descricao);
        expect(plano.valor).toBe(dadosPlano.valor);
        expect(plano.duracao).toBe(dadosPlano.duracao);
        expect(plano.modalidades).toEqual(dadosPlano.modalidades);
        expect(plano.ativo).toBe(dadosPlano.ativo);

        // Verifica se a data de cadastro foi gerada
        expect(plano.dataCadastro).toBeDefined();
        expect(new Date(plano.dataCadastro)).toBeInstanceOf(Date);
    });

    test('Deve criar um plano com valores padrão para campos opcionais', () => {
        // Dados sem campos opcionais
        const dadosMinimos = {
            nome: 'Plano Básico',
            descricao: 'Acesso básico à academia',
            valor: 49.90,
            duracao: 3
        };

        const plano = new Plano(dadosMinimos);

        // Verifica valores padrão
        expect(plano.modalidades).toEqual([]);
        expect(plano.ativo).toBe(true);
    });

    test('Deve gerar IDs únicos para diferentes planos', () => {
        const plano1 = new Plano(dadosPlano);
        const plano2 = new Plano(dadosPlano);

        expect(plano1.id).not.toBe(plano2.id);
    });

    test('Método toJSON deve retornar objeto com todos os campos', () => {
        const plano = new Plano(dadosPlano);
        const planoJSON = plano.toJSON();

        // Verifica se todos os campos estão presentes no JSON
        expect(planoJSON).toHaveProperty('id');
        expect(planoJSON).toHaveProperty('nome');
        expect(planoJSON).toHaveProperty('descricao');
        expect(planoJSON).toHaveProperty('valor');
        expect(planoJSON).toHaveProperty('duracao');
        expect(planoJSON).toHaveProperty('modalidades');
        expect(planoJSON).toHaveProperty('ativo');
        expect(planoJSON).toHaveProperty('dataCadastro');

        // Verifica se os valores correspondem
        expect(planoJSON.nome).toBe(dadosPlano.nome);
        expect(planoJSON.descricao).toBe(dadosPlano.descricao);
        expect(planoJSON.valor).toBe(dadosPlano.valor);
        expect(planoJSON.duracao).toBe(dadosPlano.duracao);
        expect(planoJSON.modalidades).toEqual(dadosPlano.modalidades);
        expect(planoJSON.ativo).toBe(dadosPlano.ativo);
    });
});