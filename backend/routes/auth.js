const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const TOKEN_EXPIRATION = '1h';

// Registro de novo usuário
router.post('/register', async (req, res) => {
  const { cpf, nome, email, senha } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const query = 'INSERT INTO usuarios (cpf, nome, email, senha_hash) VALUES ($1, $2, $3, $4) RETURNING id, cpf, nome, email';
    const values = [cpf, nome, email, hashedPassword];
    const { rows } = await db.query(query, values);
    const user = rows[0];
    const token = jwt.sign({ id: user.id, cpf: user.cpf }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Login de usuário existente
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const { rows } = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const user = rows[0];
    const match = await bcrypt.compare(senha, user.senha_hash);
    if (!match) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ id: user.id, cpf: user.cpf }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
    res.json({ user: { id: user.id, cpf: user.cpf, nome: user.nome, email: user.email }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

module.exports = router;
