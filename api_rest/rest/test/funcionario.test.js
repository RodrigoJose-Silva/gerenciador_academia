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
        expect(Object.keys(response.body).length).toBe(1);
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
        expect(response.body).toHaveProperty('message', 'Erro de validação');
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    message: expect.any(String),
                    field: 'senha'
                })
            ])
        );
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
        expect(Object.keys(response.body).length).toBe(1);
    });
});

describe('GET /api/funcionarios - Listar Funcionários', () => {
    beforeEach(() => {
        storageService.limparDados();
    });

    test('Listar funcionários deve retornar array', async () => {
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const response = await request(app)
            .get('/api/funcionarios')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('GET /api/funcionarios/:id - Buscar Funcionário por ID', () => {
    beforeEach(() => {
        storageService.limparDados();
    });

    test('Buscar funcionário existente deve retornar 200', async () => {
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
    });

    test('Buscar funcionário inexistente deve retornar 404', async () => {
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const response = await request(app)
            .get('/api/funcionarios/id_inexistente')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
    });
    
    test('Buscar funcionário com ID inválido deve retornar 400', async () => {
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const response = await request(app)
            .get('/api/funcionarios/123')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });
});

describe('PUT /api/funcionarios/:id - Atualizar Funcionário', () => {
    beforeEach(() => {
        storageService.limparDados();
    });

    test('Atualizar funcionário existente deve retornar 200', async () => {
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

        // Atualiza o funcionário
        const dadosAtualizados = {
            nomeCompleto: 'Nome Atualizado',
            telefone: '11999999999'
        };

        const response = await request(app)
            .put(`/api/funcionarios/${funcionarioId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(dadosAtualizados);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Funcionário atualizado com sucesso');
    });

    test('Atualizar funcionário inexistente deve retornar 404', async () => {
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const dadosAtualizados = {
            nomeCompleto: 'Nome Atualizado'
        };

        const response = await request(app)
            .put('/api/funcionarios/id_inexistente')
            .set('Authorization', `Bearer ${token}`)
            .send(dadosAtualizados);

        expect(response.status).toBe(404);
    });
    
    test('Atualizar funcionário com ID inválido deve retornar 400', async () => {
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const dadosAtualizados = {
            nomeCompleto: 'Nome Atualizado'
        };

        const response = await request(app)
            .put('/api/funcionarios/123')
            .set('Authorization', `Bearer ${token}`)
            .send(dadosAtualizados);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });
});

describe('DELETE /api/funcionarios/:id - Deletar Funcionário', () => {
    beforeEach(() => {
        storageService.limparDados();
    });

    test('Deletar funcionário existente deve retornar 200', async () => {
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

        // Deleta o funcionário
        const response = await request(app)
            .delete(`/api/funcionarios/${funcionarioId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Funcionário deletado com sucesso');
    });

    test('Deletar funcionário inexistente deve retornar 404', async () => {
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const response = await request(app)
            .delete('/api/funcionarios/id_inexistente')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
    });
    
    test('Deletar funcionário com ID inválido deve retornar 400', async () => {
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const response = await request(app)
            .delete('/api/funcionarios/123')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });
});
