/**
 * Testes para a funcionalidade de login
 */

const request = require('supertest');
const nock = require('nock');
const app = require('../src/app');
const loginComDadosValidosDeveRetornar200 = require('./data/loginComDadosValidosDeveRetornar200.json');

describe('Autenticação', () => {
  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    nock.cleanAll();
  });

  it('Login com dados válidos deve retornar 200', async () => {
    // Configura o mock para simular a resposta da API
    nock(process.env.API_URL || 'http://localhost:3000')
      .post('/auth/login')
      .reply(200, loginComDadosValidosDeveRetornar200);

    // Faz a requisição para a rota de login
    const response = await request(app)
      .post('/auth/login')
      .send({
        userName: 'admin',
        senha: 'senha123'
      });

    // Verifica se a resposta redireciona para a página inicial
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/');
  });

  it('Login com dados inválidos deve exibir mensagem de erro', async () => {
    // Configura o mock para simular erro da API
    nock(process.env.API_URL || 'http://localhost:3000')
      .post('/auth/login')
      .reply(401, { message: 'Credenciais inválidas' });

    // Faz a requisição para a rota de login
    const response = await request(app)
      .post('/auth/login')
      .send({
        userName: 'usuarioinvalido',
        senha: 'senhaerrada'
      });

    // Verifica se a resposta contém a mensagem de erro
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Credenciais inválidas');
  });
});