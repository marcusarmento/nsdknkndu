// 1. Importar dependências
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 2. Importar rotas
const processosRouter = require('./routes/processos');
const contatosRouter = require('./routes/contatos');
const documentosRouter = require('./routes/documentos');
const blocosRouter = require('./routes/blocos');
const estatisticasRouter = require('./routes/estatisticas');
const pesquisaRouter = require('./routes/pesquisa');

// 3. Inicializar o aplicativo Express
const app = express();
const PORT = process.env.PORT || 3000;

// 4. Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Usar as rotas da API
app.use('/api/processos', processosRouter);
app.use('/api/contatos', contatosRouter);
app.use('/api/documentos', documentosRouter);
app.use('/api/blocos', blocosRouter);
app.use('/api/estatisticas', estatisticasRouter);
app.use('/api/pesquisa', pesquisaRouter);

// 6. Rota raiz para teste
app.get('/', (req, res) => {
    res.send('API do SDI está no ar!');
});

// 7. Middleware para rota não encontrada
app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada' }));

// 8. Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
});

// 9. Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});
