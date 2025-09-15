
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/estatisticas/processos-por-tipo - Estatísticas de processos por tipo
router.get('/processos-por-tipo', async (req, res, next) => {
    try {
        const { rows } = await db.query(`
            SELECT tipo_processo, COUNT(*) as quantidade
            FROM processos
            WHERE tipo = 'gerado'
            GROUP BY tipo_processo
            ORDER BY quantidade DESC
        `);
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// GET /api/estatisticas/tempo-medio - Tempo médio de tramitação
router.get('/tempo-medio', async (req, res, next) => {
    try {
        const { rows } = await db.query(`
            SELECT
                DATE_TRUNC('month', criado_em) as mes,
                AVG(EXTRACT(DAYS FROM (COALESCE(atualizado_em, NOW()) - criado_em))) as tempo_medio_dias
            FROM processos
            WHERE criado_em >= NOW() - INTERVAL '6 months'
            GROUP BY DATE_TRUNC('month', criado_em)
            ORDER BY mes
        `);
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
