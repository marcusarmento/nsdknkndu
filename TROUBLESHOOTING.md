# Guia de Solução de Problemas - SDI

## Erro: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

Este erro indica que o servidor está retornando HTML em vez de JSON. Aqui estão as possíveis causas e soluções:

### 1. Servidor não está rodando

**Sintomas:**
- Erro de conexão
- Resposta HTML de "Cannot GET /api/processos"

**Solução:**
```bash
cd backend
npm start
```

Verifique se aparece a mensagem:
```
Servidor rodando com sucesso na porta 3000
APIs disponíveis:
- GET /api/processos
- POST /api/processos
...
```

### 2. Banco de dados não configurado

**Sintomas:**
- Erro 500 no servidor
- Mensagem de erro de conexão com PostgreSQL

**Solução:**
```bash
# 1. Verificar se PostgreSQL está rodando
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS

# 2. Criar o banco de dados
psql -U postgres -c "CREATE DATABASE sdi_db;"

# 3. Executar o script de criação
psql -U postgres -d sdi_db -f backend/database.sql
```

### 3. Dependências não instaladas

**Sintomas:**
- Erro "Cannot find module 'express'"
- Erro ao iniciar o servidor

**Solução:**
```bash
cd backend
npm install
```

### 4. Porta 3000 ocupada

**Sintomas:**
- Erro "EADDRINUSE: address already in use :::3000"

**Solução:**
```bash
# Encontrar processo usando a porta 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Matar o processo
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### 5. Problema de CORS

**Sintomas:**
- Erro de CORS no navegador
- Requisições bloqueadas

**Solução:**
O CORS já está configurado no servidor. Se ainda houver problemas, verifique se está acessando via `http://localhost` e não `file://`.

### 6. Teste de Conectividade

Execute o script de teste:

```bash
# Instalar node-fetch se necessário
npm install node-fetch

# Executar teste
node test-server.js
```

### 7. Verificação Manual

1. **Teste o servidor diretamente:**
   ```bash
   curl http://localhost:3000/api/processos
   ```

2. **Verifique os logs do servidor:**
   - Abra o terminal onde o servidor está rodando
   - Tente criar um processo e veja as mensagens de erro

3. **Verifique o console do navegador:**
   - Abra as Ferramentas de Desenvolvedor (F12)
   - Vá para a aba Console
   - Tente criar um processo e veja os erros

### 8. Problemas Comuns

**Erro de senha do PostgreSQL:**
- Verifique se a senha no `server.js` está correta
- Teste a conexão: `psql -U postgres -h localhost -d sdi_db`

**Erro de permissões:**
- Verifique se o usuário `postgres` tem permissões no banco
- Execute: `GRANT ALL PRIVILEGES ON DATABASE sdi_db TO postgres;`

**Erro de tabela não existe:**
- Execute o script `database.sql` novamente
- Verifique se as tabelas foram criadas: `\dt` no psql

### 9. Logs de Debug

Adicione logs temporários no `server.js`:

```javascript
// Adicione no início das rotas
app.post('/api/processos', async (req, res) => {
    console.log('Recebida requisição POST para /api/processos');
    console.log('Body:', req.body);
    // ... resto do código
});
```

### 10. Contato

Se o problema persistir, verifique:
1. Versão do Node.js: `node --version`
2. Versão do PostgreSQL: `psql --version`
3. Logs completos do servidor
4. Mensagens de erro no console do navegador
