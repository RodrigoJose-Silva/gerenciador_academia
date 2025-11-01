/**
 * Testes para Cadastro de Aluno
 * Cobertura de sentença e decisão
 */

const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs');
const path = require('path');
const storageService = require('../../src/services/StorageService');
const { gerarTokenParaTeste } = require('./testHelpers');

describe('POST /api/alunos - Cadastro de Aluno', () => {
    const dataPath = path.join(__dirname, 'data');

    // Limpa os dados antes de cada teste
    beforeEach(() => {
        storageService.limparDados();
    });

    test('Cadastrar aluno com dados válidos deve retornar 201', async () => {
        const dados = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarAlunoComDadosValidosDeveRetornar201.json'), 'utf8')
        );

        const token = gerarTokenParaTeste('RECEPCIONISTA');

        const response = await request(app)
            .post('/api/alunos')
            .set('Authorization', `Bearer ${token}`)
            .send(dados);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(Object.keys(response.body).length).toBe(1);
    });

    test('Cadastrar aluno com email duplicado deve retornar 409', async () => {
        const token = gerarTokenParaTeste('RECEPCIONISTA');

        // Primeiro cadastro
        const dadosValidos = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarAlunoComDadosValidosDeveRetornar201.json'), 'utf8')
        );
        await request(app)
            .post('/api/alunos')
            .set('Authorization', `Bearer ${token}`)
            .send(dadosValidos);

        // Segundo cadastro com mesmo email
        const dadosDuplicados = JSON.parse(
            fs.readFileSync(dataPath + '/cadastrarAlunoComEmailDuplicadoDeveRetornar409.json', 'utf8')
        );

        const response = await request(app)
            .post('/api/alunos')
            .set('Authorization', `Bearer ${token}`)
            .send(dadosDuplicados);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Email já cadastrado');
    });

    test('Cadastrar aluno com campos obrigatórios faltando deve retornar 400', async () => {
        const token = gerarTokenParaTeste('RECEPCIONISTA');

        const dados = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarAlunoComCamposObrigatoriosFaltandoDeveRetornar400.json'), 'utf8')
        );

        const response = await request(app)
            .post('/api/alunos')
            .set('Authorization', `Bearer ${token}`)
            .send(dados);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('field');
    });

    test('Cadastrar aluno com estado inválido deve retornar 400', async () => {
        const token = gerarTokenParaTeste('RECEPCIONISTA');

        const dados = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarAlunoComEstadoInvalidoDeveRetornar400.json'), 'utf8')
        );

        const response = await request(app)
            .post('/api/alunos')
            .set('Authorization', `Bearer ${token}`)
            .send(dados);

        expect(response.status).toBe(400);
    });
});

describe('GET /api/alunos - Listar Alunos', () => {
    beforeEach(() => {
        storageService.limparDados();
    });

    test('Listar alunos deve retornar array', async () => {
        const token = gerarTokenParaTeste('RECEPCIONISTA');

        const response = await request(app)
            .get('/api/alunos')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('GET /api/alunos/:id - Buscar Aluno por ID', () => {
    beforeEach(() => {
        storageService.limparDados();
    });

    test('Buscar aluno existente deve retornar 200', async () => {
        const token = gerarTokenParaTeste('RECEPCIONISTA');

        // Cadastra um aluno
        const dados = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'data/cadastrarAlunoComDadosValidosDeveRetornar201.json'), 'utf8')
        );

        const cadastroResponse = await request(app)
            .post('/api/alunos')
            .set('Authorization', `Bearer ${token}`)
            .send(dados);

        const alunoId = cadastroResponse.body.id;

        // Busca o aluno
        const response = await request(app)
            .get(`/api/alunos/${alunoId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });

    test('Buscar aluno inexistente deve retornar 404', async () => {
        const token = gerarTokenParaTeste('RECEPCIONISTA');

        const response = await request(app)
            .get('/api/alunos/id_inexistente')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
    });
    
    test('Buscar aluno com ID inválido deve retornar 400', async () => {
        const token = gerarTokenParaTeste('RECEPCIONISTA');

        const response = await request(app)
            .get('/api/alunos/123')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });
});

describe('PUT /api/alunos/:id - Atualizar Aluno', () => {
    beforeEach(() => {
        storageService.limparDados();
    });

    test('Atualizar aluno existente deve retornar 200', async () => {
        const token = gerarTokenParaTeste('RECEPCIONISTA');

        // Cadastra um aluno
        const dados = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'data/cadastrarAlunoComDadosValidosDeveRetornar201.json'), 'utf8')
        );

        const cadastroResponse = await request(app)
            .post('/api/alunos')
            .set('Authorization', `Bearer ${token}`)
            .send(dados);

        const alunoId = cadastroResponse.body.id;

        // Atualiza o aluno
        const dadosAtualizados = {
            nomeCompleto: 'Nome Atualizado',
            telefone: '11999999999'
        };

        const response = await request(app)
            .put(`/api/alunos/${alunoId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(dadosAtualizados);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Aluno atualizado com sucesso');
        expect(response.body.aluno.nomeCompleto).toBe('Nome Atualizado');
    });

    test('Atualizar aluno inexistente deve retornar 404', async () => {
        const token = gerarTokenParaTeste('RECEPCIONISTA');

        const dadosAtualizados = {
            nomeCompleto: 'Nome Atualizado'
        };

        const response = await request(app)
            .put('/api/alunos/id_inexistente')
            .set('Authorization', `Bearer ${token}`)
            .send(dadosAtualizados);

        expect(response.status).toBe(404);
    });
    
    test('Atualizar aluno com ID inválido deve retornar 400', async () => {
        const token = gerarTokenParaTeste('RECEPCIONISTA');

        const dadosAtualizados = {
            nomeCompleto: 'Nome Atualizado'
        };

        const response = await request(app)
            .put('/api/alunos/123')
            .set('Authorization', `Bearer ${token}`)
            .send(dadosAtualizados);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });
});

describe('DELETE /api/alunos/:id - Deletar Aluno', () => {
    beforeEach(() => {
        storageService.limparDados();
    });

    test('Deletar aluno existente deve retornar 200', async () => {
        const tokenAdmin = gerarTokenParaTeste('ADMINISTRADOR');
        const tokenRecep = gerarTokenParaTeste('RECEPCIONISTA');

        // Cadastra um aluno
        const dados = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'data/cadastrarAlunoComDadosValidosDeveRetornar201.json'), 'utf8')
        );

        const cadastroResponse = await request(app)
            .post('/api/alunos')
            .set('Authorization', `Bearer ${tokenRecep}`)
            .send(dados);

        const alunoId = cadastroResponse.body.id;

        // Deleta o aluno (apenas ADMINISTRADOR tem permissão)
        const response = await request(app)
            .delete(`/api/alunos/${alunoId}`)
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Aluno deletado com sucesso');
    });

    test('Deletar aluno inexistente deve retornar 404', async () => {
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const response = await request(app)
            .delete('/api/alunos/id_inexistente')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
    });

    test('Deletar aluno sem permissão deve retornar 403', async () => {
        const tokenRecep = gerarTokenParaTeste('RECEPCIONISTA');

        // RECEPCIONISTA não tem permissão para deletar alunos
        const response = await request(app)
            .delete('/api/alunos/id_qualquer')
            .set('Authorization', `Bearer ${tokenRecep}`);

        expect(response.status).toBe(403);
    });
    
    test('Deletar aluno com ID inválido deve retornar 400', async () => {
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const response = await request(app)
            .delete('/api/alunos/123')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });
});
