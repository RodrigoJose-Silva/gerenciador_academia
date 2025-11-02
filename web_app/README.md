# Gerenciador de Academia - Aplicação Web

## Descrição

Interface web para o sistema de gerenciamento de academia, desenvolvida para integrar com a API REST existente. Esta aplicação permite o gerenciamento completo de alunos, funcionários, planos e check-ins de uma academia.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript server-side
- **Express**: Framework web para Node.js
- **EJS**: Template engine para gerar HTML com JavaScript
- **Bulma CSS**: Framework CSS para estilização
- **Axios**: Cliente HTTP para comunicação com a API
- **Jest**: Framework de testes
- **Nock**: Biblioteca para mock de requisições HTTP em testes

## Arquitetura

A aplicação segue uma arquitetura MVC (Model-View-Controller) adaptada para aplicações web:

- **Models**: Representações dos dados da aplicação
- **Views**: Templates EJS para renderização das páginas HTML
- **Controllers**: Lógica de negócio e manipulação de requisições
- **Services**: Serviços para comunicação com a API e outras funcionalidades
- **Routes**: Definição das rotas da aplicação
- **Middlewares**: Funções intermediárias para processamento de requisições
- **Utils**: Funções utilitárias

## Estrutura de Diretórios

```
web_app/
├── public/               # Arquivos estáticos
│   ├── css/              # Estilos CSS
│   ├── js/               # Scripts JavaScript
│   └── img/              # Imagens
├── src/                  # Código-fonte
│   ├── app.js            # Arquivo principal
│   ├── controllers/      # Controladores
│   ├── middlewares/      # Middlewares
│   ├── models/           # Modelos
│   ├── routes/           # Rotas
│   ├── services/         # Serviços
│   ├── utils/            # Utilitários
│   └── views/            # Templates EJS
│       ├── layouts/      # Layouts base
│       ├── pages/        # Páginas
│       └── partials/     # Componentes parciais
└── test/                 # Testes
    └── data/             # Dados para testes
```

## Funcionalidades

- **Autenticação**: Login e logout de usuários
- **Gestão de Alunos**: Cadastro, edição, visualização e exclusão de alunos
- **Gestão de Funcionários**: Cadastro, edição, visualização e exclusão de funcionários
- **Gestão de Planos**: Cadastro, edição, visualização e exclusão de planos
- **Gestão de Check-ins**: Registro e visualização de check-ins

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/gerenciador_academia.git
cd gerenciador_academia/web_app
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
PORT=4000
API_URL=http://localhost:3000
```

4. Inicie a aplicação:
```bash
npm start
```

Para desenvolvimento com recarga automática:
```bash
npm run dev
```

## Testes

Para executar os testes:
```bash
npm test
```

Os testes utilizam mocks para isolar a aplicação web da API, garantindo que os testes sejam rápidos e confiáveis.

## Integração com a API

A aplicação web se comunica com a API REST através do serviço ApiService, que utiliza Axios para fazer requisições HTTP. Todas as operações de CRUD são realizadas através deste serviço.

## Tratamento de Erros

A aplicação possui um sistema robusto de tratamento de erros, que captura erros da API e os exibe de forma amigável para o usuário. Os erros são tratados em diferentes níveis:

1. **Nível de Serviço**: Erros de comunicação com a API
2. **Nível de Controlador**: Erros de lógica de negócio
3. **Nível de Aplicação**: Erros gerais da aplicação

## Estilização

A interface utiliza o framework Bulma CSS para estilização, com personalizações adicionais para criar uma experiência de usuário agradável. O design é responsivo e se adapta a diferentes tamanhos de tela.

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request