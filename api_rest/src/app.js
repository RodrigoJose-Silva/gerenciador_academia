/**
 * Gerenciador de Academia - API REST
 * Arquivo principal da aplicação
 */

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Gerenciador de Academia API',
            version: '1.0.0',
            description: 'API REST para gestão de academia - cadastro de alunos, funcionários, planos, checkins e autenticação',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Servidor de desenvolvimento',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT obtido no endpoint de login'
                }
            },
            schemas: {
                Aluno: {
                    type: 'object',
                    required: ['nomeCompleto', 'email', 'telefone', 'dataNascimento', 'endereco'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'ID único do aluno'
                        },
                        nomeCompleto: {
                            type: 'string',
                            maxLength: 250,
                            description: 'Nome completo do aluno'
                        },
                        email: {
                            type: 'string',
                            maxLength: 150,
                            description: 'Email do aluno'
                        },
                        telefone: {
                            type: 'string',
                            maxLength: 11,
                            description: 'Telefone do aluno'
                        },
                        dataNascimento: {
                            type: 'string',
                            format: 'date',
                            description: 'Data de nascimento do aluno'
                        },
                        cpf: {
                            type: 'string',
                            maxLength: 11,
                            description: 'CPF do aluno'
                        },
                        planoId: {
                            type: 'string',
                            description: 'ID do plano do aluno'
                        },
                        dataInicio: {
                            type: 'string',
                            format: 'date',
                            description: 'Data de início do plano'
                        },
                        endereco: {
                            type: 'object',
                            required: ['rua', 'numero', 'cidade', 'estado', 'cep'],
                            properties: {
                                rua: {
                                    type: 'string',
                                    description: 'Nome da rua'
                                },
                                numero: {
                                    type: 'string',
                                    description: 'Número do endereço'
                                },
                                complemento: {
                                    type: 'string',
                                    description: 'Complemento do endereço'
                                },
                                bairro: {
                                    type: 'string',
                                    description: 'Bairro'
                                },
                                cidade: {
                                    type: 'string',
                                    description: 'Cidade'
                                },
                                estado: {
                                    type: 'string',
                                    maxLength: 2,
                                    description: 'Estado (UF)'
                                },
                                cep: {
                                    type: 'string',
                                    description: 'CEP'
                                }
                            }
                        },
                        informacoesMedicas: {
                            type: 'string',
                            description: 'Informações médicas relevantes'
                        },
                        dataCadastro: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de cadastro do aluno'
                        }
                    }
                },
                Funcionario: {
                    type: 'object',
                    required: ['nomeCompleto', 'email', 'userName', 'senha', 'telefone', 'dataNascimento', 'cargo', 'salario'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'ID único do funcionário'
                        },
                        nomeCompleto: {
                            type: 'string',
                            maxLength: 250,
                            description: 'Nome completo do funcionário'
                        },
                        email: {
                            type: 'string',
                            maxLength: 150,
                            description: 'Email do funcionário'
                        },
                        userName: {
                            type: 'string',
                            maxLength: 100,
                            description: 'Nome de usuário para login'
                        },
                        senha: {
                            type: 'string',
                            minLength: 6,
                            maxLength: 20,
                            description: 'Senha do funcionário'
                        },
                        telefone: {
                            type: 'string',
                            maxLength: 11,
                            description: 'Telefone do funcionário'
                        },
                        dataNascimento: {
                            type: 'string',
                            format: 'date',
                            description: 'Data de nascimento do funcionário'
                        },
                        cpf: {
                            type: 'string',
                            maxLength: 11,
                            description: 'CPF do funcionário'
                        },
                        cargo: {
                            type: 'string',
                            maxLength: 100,
                            description: 'Cargo do funcionário'
                        },
                        perfil: {
                            type: 'string',
                            enum: ['ADMINISTRADOR', 'GERENTE', 'INSTRUTOR', 'RECEPCIONISTA'],
                            description: 'Perfil de acesso do funcionário'
                        },
                        dataAdmissao: {
                            type: 'string',
                            format: 'date',
                            description: 'Data de admissão do funcionário'
                        },
                        cref: {
                            type: 'string',
                            description: 'Número do CREF (para instrutores)'
                        },
                        salario: {
                            type: 'number',
                            description: 'Salário do funcionário'
                        },
                        dataCadastro: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de cadastro do funcionário'
                        }
                    }
                },
                Plano: {
                    type: 'object',
                    required: ['nome', 'descricao', 'valor', 'duracao'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'ID único do plano'
                        },
                        nome: {
                            type: 'string',
                            description: 'Nome do plano'
                        },
                        descricao: {
                            type: 'string',
                            description: 'Descrição detalhada do plano'
                        },
                        valor: {
                            type: 'number',
                            description: 'Valor mensal do plano'
                        },
                        duracao: {
                            type: 'integer',
                            description: 'Duração do plano em meses'
                        },
                        modalidades: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Lista de modalidades incluídas no plano'
                        },
                        ativo: {
                            type: 'boolean',
                            description: 'Status do plano (ativo ou inativo)'
                        },
                        dataCadastro: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de cadastro do plano'
                        }
                    }
                },
                Checkin: {
                    type: 'object',
                    required: ['alunoId'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'ID único do checkin'
                        },
                        alunoId: {
                            type: 'string',
                            description: 'ID do aluno'
                        },
                        dataHora: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data e hora do checkin (formato ISO8601)'
                        },
                        observacao: {
                            type: 'string',
                            description: 'Observações sobre o checkin'
                        },
                        registradoPor: {
                            type: 'string',
                            description: 'ID do funcionário que registrou o checkin'
                        }
                    }
                },
                Login: {
                    type: 'object',
                    required: ['userName', 'senha'],
                    properties: {
                        userName: {
                            type: 'string',
                            description: 'Nome de usuário para login'
                        },
                        senha: {
                            type: 'string',
                            description: 'Senha do usuário'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Mensagem de erro'
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    msg: {
                                        type: 'string',
                                        description: 'Mensagem de erro específica'
                                    },
                                    param: {
                                        type: 'string',
                                        description: 'Campo com erro'
                                    },
                                    location: {
                                        type: 'string',
                                        description: 'Localização do erro (body, query, params)'
                                    }
                                }
                            },
                            description: 'Lista de erros de validação'
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Rotas do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da API
const alunoRoutes = require('./routes/alunoRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');
const authRoutes = require('./routes/authRoutes');
const planoRoutes = require('./routes/planoRoutes');
const checkinRoutes = require('./routes/checkinRoutes');

app.use('/api/alunos', alunoRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/planos', planoRoutes);
app.use('/api/checkins', checkinRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.json({
        message: 'API Gerenciador de Academia',
        version: '1.0.0',
        docs: '/api-docs'
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 3000;

// Inicia o servidor apenas se não estiver em ambiente de teste
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
        console.log(`📚 Documentação: http://localhost:${PORT}/api-docs`);
    });
}

module.exports = app;
