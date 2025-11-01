/**
 * Serviço de Armazenamento
 * Gerencia o armazenamento em memória de alunos, funcionários, planos e checkins (mock)
 * 
 * O serviço é responsável pela geração automática de IDs únicos para cada entidade.
 * Os IDs são números inteiros incrementais, começando em 1 para cada tipo de entidade.
 * IDs são atribuídos automaticamente no momento da criação do registro.
 * 
 * Tratamento de IDs:
 * - IDs são armazenados internamente como números (Number)
 * - Ao receber um ID para busca, o serviço converte automaticamente para número
 * - Isso garante a correta comparação independente do tipo do ID recebido (string ou number)
 * - A conversão é feita usando Number(id) em todos os métodos de busca
 */

const { getDefaultAdminWithHashedPassword } = require('../config/adminDefaults');
const Funcionario = require('../models/Funcionario');

class StorageService {
    constructor() {
        this.alunos = [];
        this.funcionarios = [];
        this.planos = [];
        this.checkins = [];
        // Contadores para geração automática de IDs
        this._contadorAlunosId = 1;
        this._contadorFuncionariosId = 1;
        this._contadorPlanosId = 1;
        this._contadorCheckinsId = 1;
        this.initializeDefaultAdmin();
    }

    /**
     * Inicializa o administrador padrão do sistema
     */
    async initializeDefaultAdmin() {
        try {
            const adminData = await getDefaultAdminWithHashedPassword();
            const adminExists = this.buscarFuncionarioPorUserName(adminData.userName);

            if (!adminExists) {
                const adminFuncionario = new Funcionario(adminData);
                this.adicionarFuncionario(adminFuncionario);
                console.log('Administrador padrão criado com sucesso');
            }
        } catch (error) {
            console.error('Erro ao criar administrador padrão:', error);
        }
    }

    // Métodos para Alunos
    adicionarAluno(aluno) {
        // Gera ID automático
        aluno.id = this._contadorAlunosId++;
        this.alunos.push(aluno);
        return aluno;
    }

    /**
     * Busca um aluno pelo ID
     * @param {string|number} id - ID do aluno para busca
     * @returns {Object|null} Aluno encontrado ou null se não existir
     */
    buscarAlunoPorId(id) {
        // Converte o ID para número para garantir a comparação correta
        const numericId = Number(id);
        return this.alunos.find(aluno => aluno.id === numericId);
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

    deletarAluno(id) {
        const index = this.alunos.findIndex(aluno => aluno.id === id);
        if (index !== -1) {
            this.alunos.splice(index, 1);
            return true;
        }
        return false;
    }

    // Métodos para Funcionários
    adicionarFuncionario(funcionario) {
        // Gera ID automático
        funcionario.id = this._contadorFuncionariosId++;
        this.funcionarios.push(funcionario);
        return funcionario;
    }

    /**
     * Busca um funcionário pelo ID
     * @param {string|number} id - ID do funcionário para busca
     * @returns {Object|null} Funcionário encontrado ou null se não existir
     */
    buscarFuncionarioPorId(id) {
        // Converte o ID para número para garantir a comparação correta
        const numericId = Number(id);
        return this.funcionarios.find(funcionario => funcionario.id === numericId);
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

    deletarFuncionario(id) {
        const index = this.funcionarios.findIndex(funcionario => funcionario.id === id);
        if (index !== -1) {
            this.funcionarios.splice(index, 1);
            return true;
        }
        return false;
    }

    // Métodos de validação de unicidade
    verificarEmailExistente(email) {
        return this.buscarAlunoPorEmail(email) || this.buscarFuncionarioPorEmail(email);
    }

    verificarUserNameExistente(userName) {
        return this.buscarFuncionarioPorUserName(userName);
    }

    // Métodos para Planos
    adicionarPlano(plano) {
        // Gera ID automático
        plano.id = this._contadorPlanosId++;
        this.planos.push(plano);
        return plano;
    }

    /**
     * Busca um plano pelo ID
     * @param {string|number} id - ID do plano para busca
     * @returns {Object|null} Plano encontrado ou null se não existir
     */
    buscarPlanoPorId(id) {
        // Converte o ID para número para garantir a comparação correta
        const numericId = Number(id);
        return this.planos.find(plano => plano.id === numericId);
    }

    listarPlanos() {
        return this.planos;
    }

    atualizarPlano(id, dadosAtualizados) {
        // Converte o ID para número para garantir a comparação correta
        const numericId = Number(id);
        const index = this.planos.findIndex(plano => plano.id === numericId);
        if (index !== -1) {
            // Mantém o ID original como número
            dadosAtualizados.id = numericId;
            this.planos[index] = dadosAtualizados;
            return this.planos[index];
        }
        return null;
    }

    deletarPlano(id) {
        const index = this.planos.findIndex(plano => plano.id === id);
        if (index !== -1) {
            this.planos.splice(index, 1);
            return true;
        }
        return false;
    }

    // Métodos para Checkins
    adicionarCheckin(checkin) {
        // Gera ID automático
        checkin.id = this._contadorCheckinsId++;
        this.checkins.push(checkin);
        return checkin;
    }

    /**
     * Busca um checkin pelo ID
     * @param {string|number} id - ID do checkin para busca
     * @returns {Object|null} Checkin encontrado ou null se não existir
     */
    buscarCheckinPorId(id) {
        // Converte o ID para número para garantir a comparação correta
        const numericId = Number(id);
        return this.checkins.find(checkin => checkin.id === numericId);
    }

    listarCheckins() {
        return this.checkins;
    }

    listarCheckinsPorAluno(alunoId) {
        return this.checkins.filter(checkin => checkin.alunoId === alunoId);
    }

    deletarCheckin(id) {
        const index = this.checkins.findIndex(checkin => checkin.id === id);
        if (index !== -1) {
            this.checkins.splice(index, 1);
            return true;
        }
        return false;
    }

    // Método para limpar os dados (útil para testes)
    limparDados() {
        this.alunos = [];
        this.funcionarios = [];
        this.planos = [];
        this.checkins = [];
    }
}

// Singleton
module.exports = new StorageService();
