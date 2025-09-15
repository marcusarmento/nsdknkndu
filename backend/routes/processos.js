
const express = require('express');
const router = express.Router();
const db = require('../db');
const { body, validationResult } = require('express-validator');

// GET /api/processos - Buscar todos os processos
router.get('/', async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT * FROM processos ORDER BY criado_em DESC');
        res.json(rows);
    } catch (err) {
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
    async (req, res) => {
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
            console.error(err.message);
            res.status(500).json({ error: 'Erro ao criar processo' });
        }
router.post('/', async (req, res, next) => {
    try {
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
        next(err);
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
    async (req, res) => {
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
            console.error(err.message);
            res.status(500).json({ error: 'Erro ao atualizar processo' });
        }
router.put('/:id', async (req, res, next) => {
    try {
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
        next(err);
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
        next(err);
    }
});

module.exports = router;
