/**
 * Gerenciador de Academia - Aplicação Web
 * Arquivo principal da aplicação web
 */

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Importação das rotas
const indexRoutes = require('./routes/indexRoutes');
const alunosRoutes = require('./routes/alunosRoutes');
const funcionariosRoutes = require('./routes/funcionariosRoutes');
const planosRoutes = require('./routes/planosRoutes');
const checkinRoutes = require('./routes/checkinRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 4001; // Alterado para porta 4001 para evitar conflito

// Configuração do EJS como template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Middleware para verificar autenticação
const authMiddleware = require('./middlewares/authMiddleware');

// Middleware para disponibilizar variáveis globais para as views
app.use((req, res, next) => {
  res.locals.user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  res.locals.isAuthenticated = !!req.cookies.token;
  next();
});

// Rotas
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/alunos', authMiddleware, alunosRoutes);
app.use('/funcionarios', authMiddleware, funcionariosRoutes);
app.use('/planos', authMiddleware, planosRoutes);
app.use('/checkins', authMiddleware, checkinRoutes);

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Erro', 
    message: 'Ocorreu um erro no servidor', 
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).render('error', { 
    title: 'Página não encontrada', 
    message: 'A página que você está procurando não existe',
    error: {}
  });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor web rodando na porta ${PORT}`);
});

module.exports = app;