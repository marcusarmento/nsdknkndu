
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/pesquisa - Pesquisar processos
router.get('/', async (req, res, next) => {
    try {
        const { q, tipo, data_inicio, data_fim } = req.query;

        let query = 'SELECT * FROM processos WHERE 1=1';
        const values = [];
        let paramCount = 0;

        if (q) {
            paramCount++;
            query += ` AND (numero_processo ILIKE $${paramCount} OR interessado ILIKE $${paramCount} OR especificacao ILIKE $${paramCount})`;
            values.push(`%${q}%`);
        }

        if (tipo) {
            paramCount++;
            query += ` AND tipo = $${paramCount}`;
            values.push(tipo);
        }

        if (data_inicio) {
            paramCount++;
            query += ` AND criado_em >= $${paramCount}`;
            values.push(data_inicio);
        }

        if (data_fim) {
            paramCount++;
            query += ` AND criado_em <= $${paramCount}`;
            values.push(data_fim);
        }

        query += ' ORDER BY criado_em DESC';

        const { rows } = await db.query(query, values);
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
