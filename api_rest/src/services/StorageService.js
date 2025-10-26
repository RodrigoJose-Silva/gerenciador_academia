/**
 * Serviço de Armazenamento
 * Gerencia o armazenamento em memória de alunos e funcionários (mock)
 */

class StorageService {
    constructor() {
        this.alunos = [];
        this.funcionarios = [];
    }

    // Métodos para Alunos
    adicionarAluno(aluno) {
        this.alunos.push(aluno);
        return aluno;
    }

    buscarAlunoPorId(id) {
        return this.alunos.find(aluno => aluno.id === id);
    }

    buscarAlunoPorEmail(email) {
        return this.alunos.find(aluno => aluno.email === email);
    }

    listarAlunos() {
        return this.alunos;
    }

    atualizarTentativasLoginAluno(email, tentativas, bloqueado) {
        const aluno = this.buscarAlunoPorEmail(email);
        if (aluno) {
            aluno.tentativasLogin = tentativas;
            aluno.bloqueado = bloqueado;
        }
        return aluno;
    }

    // Métodos para Funcionários
    adicionarFuncionario(funcionario) {
        this.funcionarios.push(funcionario);
        return funcionario;
    }

    buscarFuncionarioPorId(id) {
        return this.funcionarios.find(funcionario => funcionario.id === id);
    }

    buscarFuncionarioPorEmail(email) {
        return this.funcionarios.find(funcionario => funcionario.email === email);
    }

    buscarFuncionarioPorUserName(userName) {
        return this.funcionarios.find(funcionario => funcionario.userName === userName);
    }

    listarFuncionarios() {
        return this.funcionarios;
    }

    atualizarTentativasLoginFuncionario(userName, tentativas, bloqueado) {
        const funcionario = this.buscarFuncionarioPorUserName(userName);
        if (funcionario) {
            funcionario.tentativasLogin = tentativas;
            funcionario.bloqueado = bloqueado;
        }
        return funcionario;
    }

    // Métodos de validação de unicidade
    verificarEmailExistente(email) {
        return this.buscarAlunoPorEmail(email) || this.buscarFuncionarioPorEmail(email);
    }

    verificarUserNameExistente(userName) {
        return this.buscarFuncionarioPorUserName(userName);
    }

    // Método para limpar os dados (útil para testes)
    limparDados() {
        this.alunos = [];
        this.funcionarios = [];
    }
}

// Singleton
module.exports = new StorageService();
