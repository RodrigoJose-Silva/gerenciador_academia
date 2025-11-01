/**
 * Testes para Cadastro de Funcionário
 * Cobertura de sentença e decisão
 */

const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs');
const path = require('path');
const storageService = require('../../src/services/StorageService');
const { gerarTokenParaTeste } = require('./testHelpers');

describe('POST /api/funcionarios - Cadastro de Funcionário', () => {
    const dataPath = path.join(__dirname, 'data');

    beforeEach(() => {
        storageService.limparDados();
    });

    test('Cadastrar funcionário com dados válidos deve retornar 201', async () => {
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const dados = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarFuncionarioComDadosValidosDeveRetornar201.json'), 'utf8')
        );

        const response = await request(app)
            .post('/api/funcionarios')
            .set('Authorization', `Bearer ${token}`)
            .send(dados);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('userName');
        expect(response.body.message).toBe('Funcionário cadastrado com sucesso');
    });

    test('Cadastrar funcionário com userName duplicado deve retornar 409', async () => {
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        // Primeiro cadastro
        const dadosValidos = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarFuncionarioComDadosValidosDeveRetornar201.json'), 'utf8')
        );
        await request(app)
            .post('/api/funcionarios')
            .set('Authorization', `Bearer ${token}`)
            .send(dadosValidos);

        // Segundo cadastro com mesmo userName
        const dadosDuplicados = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarFuncionarioComUserNameDuplicadoDeveRetornar409.json'), 'utf8')
        );

        const response = await request(app)
            .post('/api/funcionarios')
            .set('Authorization', `Bearer ${token}`)
            .send(dadosDuplicados);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('UserName já cadastrado');
    });

    test('Cadastrar funcionário com senha curta deve retornar 400', async () => {
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const dados = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarFuncionarioComSenhaCurtaDeveRetornar400.json'), 'utf8')
        );

        const response = await request(app)
            .post('/api/funcionarios')
            .set('Authorization', `Bearer ${token}`)
            .send(dados);

        expect(response.status).toBe(400);
    });

    test('Cadastrar funcionário sem CREF deve retornar 201', async () => {
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const dados = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarFuncionarioSemCrefDeveRetornar201.json'), 'utf8')
        );

        const response = await request(app)
            .post('/api/funcionarios')
            .set('Authorization', `Bearer ${token}`)
            .send(dados);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('userName');
        expect(response.body.message).toBe('Funcionário cadastrado com sucesso');
    });

    test('Cadastrar funcionário com email duplicado deve retornar 409', async () => {
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        // Primeiro cadastro
        const dadosValidos = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarFuncionarioComDadosValidosDeveRetornar201.json'), 'utf8')
        );
        await request(app)
            .post('/api/funcionarios')
            .set('Authorization', `Bearer ${token}`)
            .send(dadosValidos);

        // Segundo cadastro com mesmo email
        const dadosDuplicados = {
            ...dadosValidos,
            userName: 'outro_user',
            email: dadosValidos.email
        };

        const response = await request(app)
            .post('/api/funcionarios')
            .set('Authorization', `Bearer ${token}`)
            .send(dadosDuplicados);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Email já cadastrado');
    });
});

describe('GET /api/funcionarios - Listar Funcionários', () => {
    beforeEach(() => {
        storageService.limparDados();
    });

    test('Listar funcionários deve retornar array com dados formatados', async () => {
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        // Cadastra um funcionário primeiro
        const dados = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'data/cadastrarFuncionarioComDadosValidosDeveRetornar201.json'), 'utf8')
        );
        await request(app)
            .post('/api/funcionarios')
            .set('Authorization', `Bearer ${token}`)
            .send(dados);

        const response = await request(app)
            .get('/api/funcionarios')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        if (response.body.length > 0) {
            const funcionario = response.body[0];
            expect(funcionario).toHaveProperty('nomeCompleto');
            expect(funcionario).toHaveProperty('email');
            expect(funcionario).toHaveProperty('userName');
            expect(funcionario).toHaveProperty('telefone');
            expect(funcionario).toHaveProperty('dataNascimento');
            expect(funcionario).toHaveProperty('cpf');
            expect(funcionario).toHaveProperty('cargo');
            expect(funcionario).toHaveProperty('perfil');
            expect(funcionario).toHaveProperty('dataAdmissao');
            expect(funcionario).toHaveProperty('cref');
            expect(funcionario).toHaveProperty('salario');
            expect(funcionario).toHaveProperty('dataCadastro');
            // Verifica formato do telefone
            expect(funcionario.telefone).toMatch(/^\(\d{2}\) \d{5}-\d{4}$/);
            // Verifica formato do CPF
            if (funcionario.cpf) {
                expect(funcionario.cpf).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
            }
        }
    });
});

describe('GET /api/funcionarios/:id - Buscar Funcionário por ID', () => {
    beforeEach(() => {
        storageService.limparDados();
    });

    test('Buscar funcionário existente deve retornar 200 com dados formatados', async () => {
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        // Cadastra um funcionário
        const dados = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'data/cadastrarFuncionarioComDadosValidosDeveRetornar201.json'), 'utf8')
        );

        const cadastroResponse = await request(app)
            .post('/api/funcionarios')
            .set('Authorization', `Bearer ${token}`)
            .send(dados);

        const funcionarioId = cadastroResponse.body.id;

        // Busca o funcionário
        const response = await request(app)
            .get(`/api/funcionarios/${funcionarioId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('nomeCompleto');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('userName');
        expect(response.body).toHaveProperty('telefone');
        expect(response.body).toHaveProperty('dataNascimento');
        expect(response.body).toHaveProperty('cpf');
        expect(response.body).toHaveProperty('cargo');
        expect(response.body).toHaveProperty('perfil');
        expect(response.body).toHaveProperty('dataAdmissao');
        expect(response.body).toHaveProperty('cref');
        expect(response.body).toHaveProperty('salario');
        expect(response.body).toHaveProperty('dataCadastro');

        // Verifica formato do telefone
        expect(response.body.telefone).toMatch(/^\(\d{2}\) \d{5}-\d{4}$/);
        // Verifica formato do CPF
        if (response.body.cpf) {
            expect(response.body.cpf).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
        }
    });

    test('Buscar funcionário inexistente deve retornar 404', async () => {
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const response = await request(app)
            .get('/api/funcionarios/id_inexistente')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
    });
});
