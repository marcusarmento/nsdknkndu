
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/blocos - Buscar todos os blocos
router.get('/', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM blocos ORDER BY nome ASC');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// POST /api/blocos - Criar novo bloco
router.post('/', async (req, res) => {
    try {
        const { nome, descricao } = req.body;

        const query = `
            INSERT INTO blocos (nome, descricao, criado_em)
            VALUES ($1, $2, NOW())
            RETURNING *
        `;
        
        const { rows } = await db.query(query, [nome, descricao]);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao criar bloco' });
    }
});

module.exports = router;
