/**
 * Testes para Autenticação
 * Cobertura de sentença e decisão incluindo bloqueio após 3 tentativas
 */

const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs');
const path = require('path');
const storageService = require('../../src/services/StorageService');
const { gerarTokenParaTeste } = require('./testHelpers');

describe('POST /api/auth/login - Login de Funcionário', () => {
    const dataPath = path.join(__dirname, 'data');

    beforeEach(() => {
        storageService.limparDados();
    });

    test('Login com dados válidos deve retornar 200', async () => {
        // Primeiro cadastra um funcionário
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const dadosFuncionario = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarFuncionarioComDadosValidosDeveRetornar201.json'), 'utf8')
        );
        await request(app)
            .post('/api/funcionarios')
            .set('Authorization', `Bearer ${token}`)
            .send(dadosFuncionario);

        // Tenta fazer login
        const dadosLogin = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'loginComDadosValidosDeveRetornar200.json'), 'utf8')
        );

        const response = await request(app)
            .post('/api/auth/login')
            .send(dadosLogin);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('funcionario');
        expect(response.body).toHaveProperty('token');
        expect(response.body.message).toBe('Login realizado com sucesso');
    });

    test('Login com usuário inexistente deve retornar 401', async () => {
        const dadosLogin = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'loginComUsuarioInexistenteDeveRetornar401.json'), 'utf8')
        );

        const response = await request(app)
            .post('/api/auth/login')
            .send(dadosLogin);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Credenciais inválidas');
    });

    test('Login com senha inválida deve retornar 401 e aumentar tentativas', async () => {
        // Cadastra um funcionário
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const dadosFuncionario = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarFuncionarioComDadosValidosDeveRetornar201.json'), 'utf8')
        );
        await request(app)
            .post('/api/funcionarios')
            .set('Authorization', `Bearer ${token}`)
            .send(dadosFuncionario);

        // Tenta fazer login com senha errada
        const dadosLogin = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'loginComSenhaInvalidaAumentarTentativas.json'), 'utf8')
        );

        const response = await request(app)
            .post('/api/auth/login')
            .send(dadosLogin);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('tentativasRestantes');
        expect(response.body.message).toBe('Credenciais inválidas');
    });

    test('Login após 3 tentativas deve bloquear a conta', async () => {
        // Cadastra um funcionário
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const dadosFuncionario = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarFuncionarioComDadosValidosDeveRetornar201.json'), 'utf8')
        );
        await request(app)
            .post('/api/funcionarios')
            .set('Authorization', `Bearer ${token}`)
            .send(dadosFuncionario);

        // Tenta fazer login 3 vezes com senha errada
        const dadosLogin = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'loginApos3TentativasBloqueiaConta.json'), 'utf8')
        );

        // Primeira tentativa
        let response = await request(app)
            .post('/api/auth/login')
            .send(dadosLogin);
        expect(response.status).toBe(401);
        expect(response.body.tentativasRestantes).toBe(2);

        // Segunda tentativa
        response = await request(app)
            .post('/api/auth/login')
            .send(dadosLogin);
        expect(response.status).toBe(401);
        expect(response.body.tentativasRestantes).toBe(1);

        // Terceira tentativa - deve bloquear
        response = await request(app)
            .post('/api/auth/login')
            .send(dadosLogin);
        expect(response.status).toBe(403);
        expect(response.body.message).toContain('bloqueada');
    });

    test('Login com conta bloqueada deve retornar 403', async () => {
        // Cadastra um funcionário
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const dadosFuncionario = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarFuncionarioComDadosValidosDeveRetornar201.json'), 'utf8')
        );
        await request(app)
            .post('/api/funcionarios')
            .set('Authorization', `Bearer ${token}`)
            .send(dadosFuncionario);

        // Bloqueia a conta (3 tentativas falhas)
        const dadosLogin = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'loginApos3TentativasBloqueiaConta.json'), 'utf8')
        );

        for (let i = 0; i < 3; i++) {
            await request(app).post('/api/auth/login').send(dadosLogin);
        }

        // Tenta fazer login após bloqueio
        const response = await request(app)
            .post('/api/auth/login')
            .send(dadosLogin);

        expect(response.status).toBe(403);
        expect(response.body.message).toContain('bloqueada');
    });

    test('Login bem-sucedido após tentativas inválidas deve resetar contador', async () => {
        // Cadastra um funcionário
        const token = gerarTokenParaTeste('ADMINISTRADOR');

        const dadosFuncionario = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'cadastrarFuncionarioComDadosValidosDeveRetornar201.json'), 'utf8')
        );
        await request(app)
            .post('/api/funcionarios')
            .set('Authorization', `Bearer ${token}`)
            .send(dadosFuncionario);

        const dadosLoginErrado = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'loginComSenhaInvalidaAumentarTentativas.json'), 'utf8')
        );

        const dadosLoginCorreto = JSON.parse(
            fs.readFileSync(path.join(dataPath, 'loginComDadosValidosDeveRetornar200.json'), 'utf8')
        );

        // Duas tentativas falhas
        await request(app).post('/api/auth/login').send(dadosLoginErrado);
        await request(app).post('/api/auth/login').send(dadosLoginErrado);

        // Login bem-sucedido
        const response = await request(app)
            .post('/api/auth/login')
            .send(dadosLoginCorreto);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');

        // Tentativa inválida após login bem-sucedido deve começar do 1
        const response2 = await request(app)
            .post('/api/auth/login')
            .send(dadosLoginErrado);

        expect(response2.status).toBe(401);
        expect(response2.body.tentativasRestantes).toBe(2);
    });
});
