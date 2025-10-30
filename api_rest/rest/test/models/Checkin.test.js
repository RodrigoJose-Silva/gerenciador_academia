/**
 * Testes para o modelo de Checkin
 */

const Checkin = require('../../../src/models/Checkin');

describe('Modelo Checkin', () => {
    // Dados de exemplo para testes
    const dadosCheckin = {
        alunoId: 'aluno123',
        dataHora: '2023-01-15T08:30:00Z',
        observacao: 'Aluno chegou para treino de musculação',
        registradoPor: 'func456'
    };

    test('Deve criar um checkin com todos os campos', () => {
        const checkin = new Checkin(dadosCheckin);

        // Verifica se o ID foi gerado
        expect(checkin.id).toBeDefined();
        expect(typeof checkin.id).toBe('string');

        // Verifica os campos
        expect(checkin.alunoId).toBe(dadosCheckin.alunoId);
        expect(checkin.dataHora).toBe(dadosCheckin.dataHora);
        expect(checkin.observacao).toBe(dadosCheckin.observacao);
        expect(checkin.registradoPor).toBe(dadosCheckin.registradoPor);
    });

    test('Deve criar um checkin apenas com o campo obrigatório (alunoId)', () => {
        // Dados mínimos
        const dadosMinimos = {
            alunoId: 'aluno123'
        };

        const checkin = new Checkin(dadosMinimos);

        // Verifica campo obrigatório
        expect(checkin.alunoId).toBe(dadosMinimos.alunoId);

        // Verifica valores padrão
        expect(checkin.dataHora).toBeDefined();
        expect(new Date(checkin.dataHora)).toBeInstanceOf(Date);
        expect(checkin.observacao).toBeNull();
        expect(checkin.registradoPor).toBeNull();
    });

    test('Deve gerar IDs únicos para diferentes checkins', () => {
        const checkin1 = new Checkin(dadosCheckin);
        const checkin2 = new Checkin(dadosCheckin);

        expect(checkin1.id).not.toBe(checkin2.id);
    });

    test('Método toJSON deve retornar objeto com todos os campos', () => {
        const checkin = new Checkin(dadosCheckin);
        const checkinJSON = checkin.toJSON();

        // Verifica se todos os campos estão presentes no JSON
        expect(checkinJSON).toHaveProperty('id');
        expect(checkinJSON).toHaveProperty('alunoId');
        expect(checkinJSON).toHaveProperty('dataHora');
        expect(checkinJSON).toHaveProperty('observacao');
        expect(checkinJSON).toHaveProperty('registradoPor');

        // Verifica se os valores correspondem
        expect(checkinJSON.alunoId).toBe(dadosCheckin.alunoId);
        expect(checkinJSON.dataHora).toBe(dadosCheckin.dataHora);
        expect(checkinJSON.observacao).toBe(dadosCheckin.observacao);
        expect(checkinJSON.registradoPor).toBe(dadosCheckin.registradoPor);
    });
});