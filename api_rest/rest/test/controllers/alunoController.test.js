const request = require('supertest');
const app = require('../../../src/app');
const { gerarTokenTeste, limparDados, cadastrarAlunoTeste, cadastrarUsuarioAdmin } = require('../testHelpers');

describe('Testes do Controller de Aluno', () => {
  let token;
  let alunoId;

  beforeAll(async () => {
    await limparDados();
    await cadastrarUsuarioAdmin();
    token = await gerarTokenTeste();
    alunoId = await cadastrarAlunoTeste();
  });

  describe('DELETE /api/alunos/:id', () => {
    it('deve deletar um aluno existente e retornar status 200', async () => {
      const response = await request(app)
        .delete(`/api/alunos/${alunoId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Aluno deletado com sucesso');
      expect(response.body).toHaveProperty('id', alunoId);
    });

    it('deve retornar status 404 ao tentar deletar um aluno inexistente', async () => {
      const idInexistente = 9999;
      const response = await request(app)
        .delete(`/api/alunos/${idInexistente}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Aluno não encontrado');
    });

    it('deve retornar status 400 ao tentar deletar com ID inválido', async () => {
      const response = await request(app)
        .delete('/api/alunos/abc')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('deve retornar status 401 ao tentar deletar sem autenticação', async () => {
      const response = await request(app)
        .delete(`/api/alunos/${alunoId}`);

      expect(response.status).toBe(401);
    });
  });
});