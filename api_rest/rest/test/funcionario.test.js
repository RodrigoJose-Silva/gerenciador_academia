/**
 * Testes para Cadastro de Funcionário
 * Cobertura de sentença e decisão
 */

const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs');
const path = require('path');
const storageService = require('../../src/services/StorageService');

describe('POST /api/funcionarios - Cadastro de Funcionário', () => {
    const dataPath = path.join(__dirname, 'data');

    beforeEach(() => {
        storageService.limparDados();
    });

    test('Cadastrar funcionário com dados válidos deve retornar 201', async () => {
        const dados = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarFuncionarioComDadosValidosDeveRetornar201.json'), 'utf8')
        );

        const response = await request(app)
            .post('/api/funcionarios')
            .send(dados);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('userName');
        expect(response.body.message).toBe('Funcionário cadastrado com sucesso');
    });

    test('Cadastrar funcionário com userName duplicado deve retornar 409', async () => {
        // Primeiro cadastro
        const dadosValidos = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarFuncionarioComDadosValidosDeveRetornar201.json'), 'utf8')
        );
        await request(app).post('/api/funcionarios').send(dadosValidos);

        // Segundo cadastro com mesmo userName
        const dadosDuplicados = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarFuncionarioComUserNameDuplicadoDeveRetornar409.json'), 'utf8')
        );

        const response = await request(app)
            .post('/api/funcionarios')
            .send(dadosDuplicados);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('UserName já cadastrado');
    });

    test('Cadastrar funcionário com senha curta deve retornar 400', async () => {
        const dados = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarFuncionarioComSenhaCurtaDeveRetornar400.json'), 'utf8')
        );

        const response = await request(app)
            .post('/api/funcionarios')
            .send(dados);

        expect(response.status).toBe(400);
    });

    test('Cadastrar funcionário com email duplicado deve retornar 409', async () => {
        // Primeiro cadastro
        const dadosValidos = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarFuncionarioComDadosValidosDeveRetornar201.json'), 'utf8')
        );
        await request(app).post('/api/funcionarios').send(dadosValidos);

        // Segundo cadastro com mesmo email
        const dadosDuplicados = {
            ...dadosValidos,
            userName: 'outro_user',
            email: dadosValidos.email
        };

        const response = await request(app)
            .post('/api/funcionarios')
            .send(dadosDuplicados);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Email já cadastrado');
    });
});

describe('GET /api/funcionarios - Listar Funcionários', () => {
    beforeEach(() => {
        storageService.limparDados();
    });

    test('Listar funcionários deve retornar array', async () => {
        const response = await request(app)
            .get('/api/funcionarios');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('GET /api/funcionarios/:id - Buscar Funcionário por ID', () => {
    beforeEach(() => {
        storageService.limparDados();
    });

    test('Buscar funcionário existente deve retornar 200', async () => {
        // Cadastra um funcionário
        const dados = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'data/cadastrarFuncionarioComDadosValidosDeveRetornar201.json'), 'utf8')
        );

        const cadastroResponse = await request(app)
            .post('/api/funcionarios')
            .send(dados);

        const funcionarioId = cadastroResponse.body.id;

        // Busca o funcionário
        const response = await request(app)
            .get(`/api/funcionarios/${funcionarioId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });

    test('Buscar funcionário inexistente deve retornar 404', async () => {
        const response = await request(app)
            .get('/api/funcionarios/id_inexistente');

        expect(response.status).toBe(404);
    });
});
