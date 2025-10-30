/**
 * Testes para o controlador de Checkins
 */

const checkinController = require('../../../src/controllers/checkinController');
const Checkin = require('../../../src/models/Checkin');
const Aluno = require('../../../src/models/Aluno');
const storageService = require('../../../src/services/StorageService');

// Mock do express-validator
jest.mock('express-validator', () => ({
    validationResult: jest.fn(() => ({
        isEmpty: jest.fn(() => true),
        array: jest.fn(() => [])
    }))
}));

describe('Controlador de Checkins', () => {
    // Mock de requisição e resposta
    let req, res;

    // Dados de exemplo para testes
    const dadosAluno = {
        nomeCompleto: 'João Silva',
        email: 'joao@example.com',
        telefone: '11999998888',
        dataNascimento: '1990-01-01',
        endereco: {
            rua: 'Rua Teste',
            numero: '123',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01234-567'
        }
    };

    const dadosCheckin = {
        alunoId: '', // Será preenchido durante os testes
        dataHora: '2023-01-15T08:30:00Z',
        observacao: 'Aluno chegou para treino de musculação'
    };

    beforeEach(() => {
        // Limpa os dados do serviço de armazenamento antes de cada teste
        storageService.limparDados();

        // Adiciona um aluno para os testes
        const aluno = new Aluno(dadosAluno);
        storageService.adicionarAluno(aluno);

        // Atualiza o ID do aluno nos dados de checkin
        dadosCheckin.alunoId = aluno.id;

        // Configura os mocks de requisição e resposta
        req = {
            body: { ...dadosCheckin },
            params: {},
            user: { id: 'func123' }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('registrarCheckin', () => {
        test('Deve retornar 404 quando o aluno não existe', () => {
            // Altera o ID do aluno para um inexistente
            req.body.alunoId = 'id_inexistente';

            // Executa o controlador
            checkinController.registrarCheckin(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Aluno não encontrado' });
        });

        test('Deve registrar um checkin com sucesso', () => {
            // Executa o controlador
            checkinController.registrarCheckin(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalled();

            // Verifica se o checkin foi adicionado ao serviço de armazenamento
            const checkins = storageService.listarCheckins();
            expect(checkins.length).toBe(1);
            expect(checkins[0].alunoId).toBe(dadosCheckin.alunoId);
            expect(checkins[0].registradoPor).toBe(req.user.id);
        });
    });

    describe('listarCheckins', () => {
        test('Deve retornar uma lista vazia quando não há checkins', () => {
            // Executa o controlador
            checkinController.listarCheckins(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ checkins: [] });
        });

        test('Deve retornar uma lista com os checkins registrados', () => {
            // Adiciona um checkin ao serviço de armazenamento
            const checkin = new Checkin(dadosCheckin);
            storageService.adicionarCheckin(checkin);

            // Executa o controlador
            checkinController.listarCheckins(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
            expect(res.json.mock.calls[0][0].checkins.length).toBe(1);
        });
    });

    describe('buscarCheckinPorId', () => {
        test('Deve retornar 404 quando o checkin não existe', () => {
            // Configura o ID na requisição
            req.params.id = 'id_inexistente';

            // Executa o controlador
            checkinController.buscarCheckinPorId(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Checkin não encontrado' });
        });

        test('Deve retornar o checkin quando ele existe', () => {
            // Adiciona um checkin ao serviço de armazenamento
            const checkin = new Checkin(dadosCheckin);
            storageService.adicionarCheckin(checkin);

            // Configura o ID na requisição
            req.params.id = checkin.id;

            // Executa o controlador
            checkinController.buscarCheckinPorId(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
            expect(res.json.mock.calls[0][0].checkin.id).toBe(checkin.id);
        });
    });

    describe('listarCheckinsPorAluno', () => {
        test('Deve retornar 404 quando o aluno não existe', () => {
            // Configura o ID do aluno na requisição
            req.params.alunoId = 'id_inexistente';

            // Executa o controlador
            checkinController.listarCheckinsPorAluno(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Aluno não encontrado' });
        });

        test('Deve retornar os checkins do aluno', () => {
            // Adiciona um checkin ao serviço de armazenamento
            const checkin = new Checkin(dadosCheckin);
            storageService.adicionarCheckin(checkin);

            // Configura o ID do aluno na requisição
            req.params.alunoId = dadosCheckin.alunoId;

            // Executa o controlador
            checkinController.listarCheckinsPorAluno(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
            expect(res.json.mock.calls[0][0].checkins.length).toBe(1);
            expect(res.json.mock.calls[0][0].aluno).toBeDefined();
        });
    });

    describe('excluirCheckin', () => {
        test('Deve retornar 404 quando o checkin não existe', () => {
            // Configura o ID na requisição
            req.params.id = 'id_inexistente';

            // Executa o controlador
            checkinController.excluirCheckin(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Checkin não encontrado' });
        });

        test('Deve excluir o checkin com sucesso', () => {
            // Adiciona um checkin ao serviço de armazenamento
            const checkin = new Checkin(dadosCheckin);
            storageService.adicionarCheckin(checkin);

            // Configura o ID na requisição
            req.params.id = checkin.id;

            // Executa o controlador
            checkinController.excluirCheckin(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Checkin excluído com sucesso' });

            // Verifica se o checkin foi removido do serviço de armazenamento
            const checkins = storageService.listarCheckins();
            expect(checkins.length).toBe(0);
        });
    });
});