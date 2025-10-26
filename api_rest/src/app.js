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
            description: 'API REST para gestão de academia - cadastro de alunos, funcionários e autenticação',
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

app.use('/api/alunos', alunoRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/auth', authRoutes);

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
