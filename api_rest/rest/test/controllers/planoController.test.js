/**
 * Testes para o controlador de Planos
 */

const planoController = require('../../../src/controllers/planoController');
const Plano = require('../../../src/models/Plano');
const storageService = require('../../../src/services/StorageService');

// Mock do express-validator
jest.mock('express-validator', () => ({
    validationResult: jest.fn(() => ({
        isEmpty: jest.fn(() => true),
        array: jest.fn(() => [])
    }))
}));

describe('Controlador de Planos', () => {
    // Mock de requisição e resposta
    let req, res;

    // Dados de exemplo para testes
    const dadosPlano = {
        nome: 'PLANO_PREMIUM',
        modalidades: ['Acesso completo à academia e aulas'],
        valor: 150.00,
        duracao: 30,
        beneficios: ['Acesso ilimitado', 'Aulas coletivas', 'Avaliação física mensal'],
        ativo: true
    };

    beforeEach(() => {
        // Limpa os dados do serviço de armazenamento antes de cada teste
        storageService.limparDados();

        // Configura os mocks de requisição e resposta
        req = {
            body: { ...dadosPlano },
            params: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('criarPlano', () => {
        test('Deve criar um plano com sucesso', () => {
            // Executa o controlador
            planoController.criarPlano(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalled();

            // Verifica se o plano foi adicionado ao serviço de armazenamento
            const planos = storageService.listarPlanos();
            expect(planos.length).toBe(1);
            expect(planos[0].nome).toBe(dadosPlano.nome);
        });
    });

    describe('listarPlanos', () => {
        test('Deve retornar uma lista vazia quando não há planos', () => {
            // Executa o controlador
            planoController.listarPlanos(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ planos: [] });
        });

        test('Deve retornar uma lista com os planos cadastrados', () => {
            // Adiciona um plano ao serviço de armazenamento
            const plano = new Plano(dadosPlano);
            storageService.adicionarPlano(plano);

            // Executa o controlador
            planoController.listarPlanos(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
            expect(res.json.mock.calls[0][0].planos.length).toBe(1);
        });
    });

    describe('buscarPlanoPorId', () => {
        test('Deve retornar 404 quando o plano não existe', () => {
            // Configura o ID na requisição
            req.params.id = 'id_inexistente';

            // Executa o controlador
            planoController.buscarPlanoPorId(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Plano não encontrado' });
        });

        test('Deve retornar o plano quando ele existe', () => {
            // Adiciona um plano ao serviço de armazenamento
            const plano = new Plano(dadosPlano);
            storageService.adicionarPlano(plano);

            // Configura o ID na requisição
            req.params.id = plano.id;

            // Executa o controlador
            planoController.buscarPlanoPorId(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
            expect(res.json.mock.calls[0][0].plano.id).toBe(plano.id);
        });
    });

    describe('atualizarPlano', () => {
        test('Deve retornar 404 quando o plano não existe', () => {
            // Configura o ID na requisição
            req.params.id = 'id_inexistente';
            req.body = { nome: 'Novo Nome' };

            // Executa o controlador
            planoController.atualizarPlano(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Plano não encontrado' });
        });

        test('Deve retornar 400 quando nenhuma propriedade válida é fornecida', () => {
            // Adiciona um plano ao serviço de armazenamento
            const plano = new Plano(dadosPlano);
            storageService.adicionarPlano(plano);

            // Configura o ID e dados vazios/nulos
            req.params.id = plano.id;
            req.body = {
                nome: '',
                valor: null,
                modalidades: undefined
            };

            // Executa o controlador
            planoController.atualizarPlano(req, res);

            // Verifica se retorna erro de validação
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Nenhuma propriedade válida fornecida para atualização'
            });
        });

        test('Deve atualizar o plano com sucesso mantendo valores existentes', () => {
            // Adiciona um plano ao serviço de armazenamento
            const plano = new Plano(dadosPlano);
            storageService.adicionarPlano(plano);

            // Configura o ID e apenas algumas propriedades para atualização
            req.params.id = plano.id;
            req.body = {
                nome: 'PLANO_ATUALIZADO',
                valor: 129.90
            };

            // Executa o controlador
            planoController.atualizarPlano(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();

            // Verifica se o plano foi atualizado corretamente
            const planoAtualizado = storageService.buscarPlanoPorId(plano.id);
            expect(planoAtualizado.nome).toBe('PLANO_ATUALIZADO');
            expect(planoAtualizado.valor).toBe(129.90);
            // Verifica se os outros campos permaneceram inalterados
            expect(planoAtualizado.modalidades).toEqual(dadosPlano.modalidades);
            expect(planoAtualizado.duracao).toBe(dadosPlano.duracao);
            expect(planoAtualizado.beneficios).toEqual(dadosPlano.beneficios);
        });

        test('Deve atualizar o plano com sucesso com todas as propriedades', () => {
            // Adiciona um plano ao serviço de armazenamento
            const plano = new Plano(dadosPlano);
            storageService.adicionarPlano(plano);

            // Configura o ID e os dados de atualização completos
            req.params.id = plano.id;
            req.body = {
                nome: 'PLANO_ATUALIZADO',
                valor: 129.90,
                modalidades: ['Acesso premium à academia'],
                beneficios: ['Acesso VIP', 'Personal Trainer'],
                duracao: 45,
                ativo: false
            };

            // Executa o controlador
            planoController.atualizarPlano(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();

            // Verifica se o plano foi atualizado no serviço de armazenamento
            const planoAtualizado = storageService.buscarPlanoPorId(plano.id);
            expect(planoAtualizado.nome).toBe('PLANO_ATUALIZADO');
            expect(planoAtualizado.valor).toBe(129.90);
            expect(planoAtualizado.modalidades).toEqual(['Acesso premium à academia']);
            expect(planoAtualizado.beneficios).toEqual(['Acesso VIP', 'Personal Trainer']);
            expect(planoAtualizado.duracao).toBe(45);
            expect(planoAtualizado.ativo).toBe(false);
        });
    });

    describe('excluirPlano', () => {
        test('Deve retornar 404 quando o plano não existe', () => {
            // Configura o ID na requisição
            req.params.id = 'id_inexistente';

            // Executa o controlador
            planoController.excluirPlano(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Plano não encontrado' });
        });

        test('Deve excluir o plano com sucesso', () => {
            // Adiciona um plano ao serviço de armazenamento
            const plano = new Plano(dadosPlano);
            storageService.adicionarPlano(plano);

            // Configura o ID na requisição
            req.params.id = plano.id;

            // Executa o controlador
            planoController.excluirPlano(req, res);

            // Verifica se o status e o JSON foram chamados corretamente
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Plano excluído com sucesso' });

            // Verifica se o plano foi removido do serviço de armazenamento
            const planos = storageService.listarPlanos();
            expect(planos.length).toBe(0);
        });
    });
});