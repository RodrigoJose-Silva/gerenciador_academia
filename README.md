# Gerenciador de Academia

Sistema completo de gerenciamento para academias, incluindo cadastro de alunos, funcionários e sistema de autenticação e autorização.

## 📋 Sobre o Projeto

O Gerenciador de Academia é uma solução desenvolvida para facilitar o gerenciamento de academias, oferecendo funcionalidades para controle de alunos, funcionários e sistemas de autenticação baseados em perfis de usuário.

## 🏗 Estrutura do Projeto

```
gerenciador_academia/
├── api_rest/           # API REST do sistema
├── artfacts/           # Documentos de requisitos e arquitetura
└── README.md           # Este arquivo
```

## 📦 Componentes

### API REST (`api_rest/`)

API REST desenvolvida com Node.js e Express.js, fornecendo endpoints completos para:

- **Gestão de Alunos**: Cadastro, listagem, busca, atualização e exclusão
- **Gestão de Funcionários**: Cadastro, listagem, busca, atualização e exclusão
- **Gestão de Planos**: Cadastro, listagem, busca, atualização e exclusão de planos de academia
- **Gestão de Checkins**: Registro, listagem e controle de entrada de alunos
- **Autenticação**: Sistema de login com JWT e controle de tentativas
- **Autorização**: Sistema de perfis e permissões por usuário

**Características:**
- ✅ Arquitetura em camadas (Layered Architecture)
- ✅ Autenticação JWT com expiração de 24 horas
- ✅ Sistema de perfis: ADMINISTRADOR, GERENTE, INSTRUTOR, RECEPCIONISTA
- ✅ Validação completa de dados com express-validator
- ✅ Documentação Swagger automática
- ✅ Senhas hashadas com bcrypt
- ✅ Bloqueio de conta após 3 tentativas de login inválidas

## 🛠 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **express-validator** - Validação
- **Swagger** - Documentação

### Testes
- **Jest** - Framework de testes
- **Supertest** - Testes de integração

### Desenvolvimento
- **Nodemon** - Auto-reload
- **dotenv** - Variáveis de ambiente
- **CORS** - Cross-Origin Resource Sharing


## 🚀 Início Rápido

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd gerenciador_academia
```

2. Instale as dependências da API:
```bash
cd api_rest
npm install
```

3. Configure as variáveis de ambiente (opcional):
```bash
cp env.example .env
# Edite o arquivo .env conforme necessário
```

### Execução

#### Modo Desenvolvimento
```bash
cd api_rest
npm run dev
```

O servidor iniciará em `http://localhost:3000`

#### Modo Produção
```bash
cd api_rest
npm start
```

### Documentação

Após iniciar o servidor, acesse:
- **Swagger UI**: http://localhost:3000/api-docs
- **API Base**: http://localhost:3000

## 🧪 Testes

### Executar Testes
```bash
cd api_rest
npm test
```

### Cobertura de Testes
```bash
cd api_rest
npm run test:coverage
```


## 🔐 Autenticação

O sistema utiliza autenticação JWT. Para acessar os endpoints protegidos:

1. Realize o login através de `POST /api/auth/login`
2. Copie o token retornado
3. Inclua no header: `Authorization: Bearer <token>`

### Perfis de Usuário

O sistema possui 4 perfis com diferentes níveis de acesso:

| Perfil | Alunos | Funcionários | Relatórios |
|--------|--------|--------------|------------|
| **ADMINISTRADOR** | ✅ Completo | ✅ Completo | ✅ Sim |
| **GERENTE** | ✅ Menos exclusão | 👁️ Visualização | ✅ Sim |
| **INSTRUTOR** | 👁️ Visualização | ❌ Nenhum | ❌ Não |
| **RECEPCIONISTA** | ✅ Menos exclusão | ❌ Nenhum | ❌ Não |

Para detalhes completos de permissões, consulte a documentação da API.

## 📝 Funcionalidades Implementadas

### Alunos
- ✅ Cadastro com validação completa
- ✅ Listagem de todos os alunos
- ✅ Busca por ID
- ✅ Atualização de dados
- ✅ Exclusão de registros
- ✅ Validação de email único

### Funcionários
- ✅ Cadastro com hash de senha
- ✅ Listagem de todos os funcionários
- ✅ Busca por ID
- ✅ Atualização de dados
- ✅ Exclusão de registros
- ✅ Validação de email e userName únicos
- ✅ Sistema de perfis e permissões

### Autenticação
- ✅ Login com JWT
- ✅ Bloqueio após 3 tentativas inválidas
- ✅ Controle de tentativas de login
- ✅ Reset automático de tentativas em login bem-sucedido
- ✅ Tokens com expiração de 24 horas

### Segurança
- ✅ Autenticação obrigatória em rotas protegidas
- ✅ Verificação de permissões por perfil
- ✅ Senhas hashadas
- ✅ Validação de dados de entrada
- ✅ CORS configurado

## 🎯 Próximos Passos

Possíveis melhorias futuras:
- [ ] Integração com banco de dados (PostgreSQL/MySQL)
- [ ] Sistema de recuperação de senha
- [ ] Geração de relatórios
- [ ] Interface web (frontend)
- [ ] Sistema de pagamentos
- [ ] Controle de planos e mensalidades
- [ ] Sistema de fichas de treino
- [ ] Notificações

## 🤝 Contribuindo

Este é um projeto didático desenvolvido para aprendizado. Sinta-se à vontade para:
- Estudar o código
- Propor melhorias
- Adaptar para suas necessidades
- Compartilhar conhecimento