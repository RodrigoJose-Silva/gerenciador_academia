/**
 * Serviço de comunicação com a API
 * Responsável por realizar as requisições para a API REST
 * 
 * Este serviço implementa:
 * - Comunicação com endpoints da API
 * - Tratamento de erros de requisição
 * - Gerenciamento de tokens de autenticação
 * - Timeout e retry de requisições
 * - Interceptadores para tratamento de respostas
 */

const axios = require('axios');

class ApiService {
  /**
   * Construtor da classe ApiService
   * @param {string} baseURL - URL base da API
   */
  constructor() {
    this.api = axios.create({
      baseURL: process.env.API_URL || 'http://localhost:3000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Interceptador de requisição
    this.api.interceptors.request.use(
      (config) => {
        // Log da requisição em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptador de resposta
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Log do erro em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.error('[API Error]', error.response?.data || error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Configura o token de autenticação para as requisições
   * @param {string} token - Token JWT de autenticação
   */
  setAuthToken(token) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  /**
   * Realiza uma requisição GET para a API
   * @param {string} url - Endpoint da API
   * @param {Object} params - Parâmetros da requisição
   * @returns {Promise} - Promessa com a resposta da API
   */
  async get(url, params = {}) {
    try {
      const response = await this.api.get(url, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Realiza uma requisição POST para a API
   * @param {string} url - Endpoint da API
   * @param {Object} data - Dados a serem enviados
   * @returns {Promise} - Promessa com a resposta da API
   */
  async post(url, data = {}) {
    try {
      const response = await this.api.post(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Realiza uma requisição PUT para a API
   * @param {string} url - Endpoint da API
   * @param {Object} data - Dados a serem enviados
   * @returns {Promise} - Promessa com a resposta da API
   */
  async put(url, data = {}) {
    try {
      const response = await this.api.put(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Realiza uma requisição DELETE para a API
   * @param {string} url - Endpoint da API
   * @returns {Promise} - Promessa com a resposta da API
   */
  async delete(url) {
    try {
      const response = await this.api.delete(url);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Trata os erros das requisições
   * @param {Error} error - Objeto de erro
   * @throws {Error} - Lança o erro tratado com mensagem apropriada
   */
  handleError(error) {
    if (error.response) {
      // A requisição foi feita e o servidor respondeu com status fora do intervalo 2xx
      const errorMessage = error.response.data.message || 'Erro na comunicação com o servidor';
      const errorStatus = error.response.status;

      // Tratamento específico para erros de autenticação
      if (errorStatus === 401) {
        // Se for erro de autenticação, limpa o token
        this.setAuthToken(null);
      }

      const customError = new Error(errorMessage);
      customError.status = errorStatus;
      customError.data = error.response.data;

      throw customError;
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      const customError = new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      customError.status = 503;
      throw customError;
    } else {
      // Erro na configuração da requisição
      throw new Error('Erro ao processar a requisição: ' + error.message);
    }
  }
}

module.exports = new ApiService();