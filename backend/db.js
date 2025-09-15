
// Importa a biblioteca do PostgreSQL
const { Pool } = require('pg');

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Configura o pool de conexões com o banco de dados
// As credenciais são lidas das variáveis de ambiente para maior segurança
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || 'sdi_db',
    password: process.env.DB_PASSWORD, // A senha vem do arquivo .env
    port: process.env.DB_PORT || 5432,
});

// Exporta uma função para executar consultas
module.exports = {
    query: (text, params) => pool.query(text, params),
};
