const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');
const { body, validationResult } = require('express-validator');

// GET /api/processos - Buscar todos os processos com paginação
router.get('/', async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = parseInt(req.query.offset, 10) || 0;

        const totalResult = await db.query('SELECT COUNT(*) FROM processos');
        const total = parseInt(totalResult.rows[0].count, 10);

        const { rows } = await db.query(
            'SELECT * FROM processos ORDER BY criado_em DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        res.json({ data: rows, total, limit, offset });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: 'Erro no servidor' });
        next(err);
    }
});

// GET /api/processos/:id - Buscar processo específico
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM processos WHERE id = $1', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Processo não encontrado' });
        }

        res.json(rows[0]);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: 'Erro no servidor' });
        next(err);
    }
});

// POST /api/processos - Criar novo processo
router.post(
    '/',
    [
        body('numero_processo').notEmpty(),
        body('tipo_processo').notEmpty(),
        body('especificacao').notEmpty(),
        body('interessado').notEmpty(),
        body('nivel_acesso').notEmpty(),
        body('tipo').notEmpty(),
        body('protocolo_tipo').notEmpty()
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {
                numero_processo,
                tipo_processo,
                especificacao,
                interessado,
                observacoes,
                nivel_acesso,
                tipo,
                protocolo_tipo,
                protocolo_numero_manual,
                protocolo_data
            } = req.body;

            const query = `
                INSERT INTO processos (
                    numero_processo, tipo_processo, especificacao, interessado,
                    observacoes, nivel_acesso, tipo, protocolo_tipo,
                    protocolo_numero_manual, protocolo_data, criado_em
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
                RETURNING *
            `;

            const values = [
                numero_processo, tipo_processo, especificacao, interessado,
                observacoes, nivel_acesso, tipo, protocolo_tipo,
                protocolo_numero_manual, protocolo_data
            ];

            const { rows } = await db.query(query, values);
            res.status(201).json(rows[0]);
        } catch (err) {
            logger.error(err.message);
            res.status(500).json({ error: 'Erro ao criar processo' });
            next(err);
        }
    }
);

// PUT /api/processos/:id - Atualizar processo
router.put(
    '/:id',
    [
        body('numero_processo').notEmpty(),
        body('tipo_processo').notEmpty(),
        body('especificacao').notEmpty(),
        body('interessado').notEmpty(),
        body('nivel_acesso').notEmpty(),
        body('tipo').notEmpty()
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const {
                numero_processo,
                tipo_processo,
                especificacao,
                interessado,
                observacoes,
                nivel_acesso,
                tipo
            } = req.body;

            const query = `
                UPDATE processos SET
                    numero_processo = $1, tipo_processo = $2, especificacao = $3,
                    interessado = $4, observacoes = $5, nivel_acesso = $6, tipo = $7,
                    atualizado_em = NOW()
                WHERE id = $8
                RETURNING *
            `;

            const values = [
                numero_processo, tipo_processo, especificacao, interessado,
                observacoes, nivel_acesso, tipo, id
            ];

            const { rows } = await db.query(query, values);

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Processo não encontrado' });
            }

            res.json(rows[0]);
        } catch (err) {
            logger.error(err.message);
            res.status(500).json({ error: 'Erro ao atualizar processo' });
            next(err);
        }
    }
);

// DELETE /api/processos/:id - Excluir processo
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('DELETE FROM processos WHERE id = $1 RETURNING *', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Processo não encontrado' });
        }

        res.json({ message: 'Processo excluído com sucesso' });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: 'Erro ao excluir processo' });
        next(err);
    }
});

module.exports = router;

