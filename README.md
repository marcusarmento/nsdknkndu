# SDI - Sistema de Documentos Internos

Sistema web para gestão de processos e documentos internos, desenvolvido com Node.js, Express, PostgreSQL e frontend vanilla JavaScript.

Após clonar o repositório, execute `npm install` para instalar as dependências.

## 🚀 Funcionalidades

- **Gestão de Processos**: Criação, visualização, edição e exclusão de processos
- **Gestão de Contatos**: Cadastro de pessoas físicas e jurídicas
- **Blocos de Assinatura**: Organização de processos para assinatura em lote
- **Pesquisa Avançada**: Busca de processos por diversos critérios
- **Estatísticas**: Gráficos e relatórios de performance
- **Dashboard**: Visão geral dos processos e atividades

## 📋 Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **PostgreSQL** (versão 12 ou superior)
- **npm** (gerenciador de pacotes do Node.js)

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd sdi-sistema
```

### 2. Instale as dependências
```bash
cd backend
npm install

cd ../frontend
npm install
cd ..
```

### 3. Instale o PostgreSQL

#### Windows:
```bash
# Usando Chocolatey
choco install postgresql

# Ou baixe do site oficial: https://www.postgresql.org/download/windows/
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

#### macOS:
```bash
# Usando Homebrew
brew install postgresql
```

### 4. Configure o banco de dados

```bash
# Conecte ao PostgreSQL como superusuário
sudo -u postgres psql

# Crie o banco de dados
CREATE DATABASE sdi_db;
CREATE USER postgres WITH PASSWORD 'ASUHFfDFJDF';
GRANT ALL PRIVILEGES ON DATABASE sdi_db TO postgres;
\q
```

### 4. Configure o backend

```bash
cd backend
npm install
cp .env.example .env
# Preencha o arquivo .env com os valores reais
```

Em seguida, edite o arquivo `.env` preenchendo as credenciais e configurações do seu ambiente.

### 5. Execute o script de criação do banco

```bash
# Execute o script SQL para criar as tabelas
psql -U postgres -d sdi_db -f database.sql
```

### 6. Inicie o servidor

```bash
# Inicie o servidor backend
npm start

# Ou para desenvolvimento com auto-reload
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

### 7. Acesse o sistema

Abra o arquivo `dashboard.html` em seu navegador ou configure um servidor web local para servir os arquivos HTML.

## 📁 Estrutura do Projeto

```
sdi-sistema/
├── backend/
│   ├── server.js          # Servidor Express com APIs
│   ├── database.sql       # Script de criação do banco
│   ├── package.json       # Dependências do Node.js
│   └── node_modules/      # Dependências instaladas
├── frontend/
│   └── src/
│       ├── styles/        # Estilos CSS da aplicação
│       └── ...            # Demais arquivos React
├── *.html                 # Páginas do frontend legado
├── *.js                   # Scripts JavaScript do frontend legado
└── README.md             # Este arquivo
```

Os estilos CSS da aplicação agora residem em `frontend/src/styles/`.

## 🔧 APIs Disponíveis

### Processos
- `GET /api/processos` - Listar todos os processos
- `GET /api/processos/:id` - Buscar processo específico
- `POST /api/processos` - Criar novo processo
- `PUT /api/processos/:id` - Atualizar processo
- `DELETE /api/processos/:id` - Excluir processo

### Contatos
- `GET /api/contatos` - Listar todos os contatos
- `GET /api/contatos/:id` - Buscar contato específico
- `POST /api/contatos` - Criar novo contato
- `PUT /api/contatos/:id` - Atualizar contato
- `DELETE /api/contatos/:id` - Excluir contato

### Blocos
- `GET /api/blocos` - Listar todos os blocos
- `POST /api/blocos` - Criar novo bloco

### Estatísticas
- `GET /api/estatisticas/processos-por-tipo` - Processos por tipo
- `GET /api/estatisticas/tempo-medio` - Tempo médio de tramitação

### Pesquisa
- `GET /api/pesquisa` - Pesquisar processos

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

- **processos**: Dados dos processos
- **contatos**: Cadastro de pessoas físicas e jurídicas
- **blocos**: Blocos de assinatura
- **documentos**: Documentos anexados aos processos
- **usuarios**: Usuários do sistema (para autenticação futura)

## 🔒 Configurações de Segurança

⚠️ **IMPORTANTE**: Antes de usar em produção, considere:

1. **Alterar senhas padrão** no arquivo `server.js`
2. **Usar variáveis de ambiente** para configurações sensíveis
3. **Implementar autenticação** e autorização
4. **Configurar HTTPS** para comunicação segura
5. **Implementar validação** de entrada mais robusta

## 🚀 Scripts Disponíveis

```bash
# Iniciar servidor
npm start

# Desenvolvimento com auto-reload
npm run dev

# Criar banco de dados
npm run db:create

# Configurar banco de dados
npm run db:setup
```

## 🧪 Testes

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

## 🐛 Solução de Problemas

### Erro de conexão com PostgreSQL
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `server.js`
- Verifique se o banco `sdi_db` foi criado

### Erro de CORS
- O CORS está configurado para aceitar todas as origens
- Para produção, configure domínios específicos

### Erro 404 nas APIs
- Verifique se o servidor está rodando na porta 3000
- Confirme se as rotas estão corretas no frontend

## 📝 Próximos Passos

- [ ] Implementar sistema de autenticação
- [ ] Adicionar validação de dados mais robusta
- [ ] Implementar logs de auditoria
- [ ] Adicionar testes automatizados
- [ ] Configurar CI/CD
- [ ] Implementar cache para melhor performance

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato com a equipe de desenvolvimento ou abra uma issue no repositório.
