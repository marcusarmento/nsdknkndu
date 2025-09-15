
const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');

// GET /api/contatos - Buscar todos os contatos
router.get('/', async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT * FROM contatos ORDER BY nome ASC');
        res.json(rows);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: 'Erro no servidor' });
        next(err);
    }
});

// GET /api/contatos/:id - Buscar contato específico
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM contatos WHERE id = $1', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Contato não encontrado' });
        }

        res.json(rows[0]);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: 'Erro no servidor' });
        next(err);
    }
});

// POST /api/contatos - Criar novo contato
router.post('/', async (req, res, next) => {
    try {
        const {
            natureza_contato, nome, sigla, cpf, rg, data_nascimento,
            email, telefone_fixo, telefone_celular, cep, endereco,
            bairro, cidade, uf
        } = req.body;

        const query = `
            INSERT INTO contatos (
                natureza_contato, nome, sigla, cpf, rg, data_nascimento,
                email, telefone_fixo, telefone_celular, cep, endereco,
                bairro, cidade, uf, criado_em
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
            RETURNING *
        `;

        const values = [
            natureza_contato, nome, sigla, cpf, rg, data_nascimento,
            email, telefone_fixo, telefone_celular, cep, endereco,
            bairro, cidade, uf
        ];

        const { rows } = await db.query(query, values);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar contato' });
});

// PUT /api/contatos/:id - Atualizar contato
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            natureza_contato, nome, sigla, cpf, rg, data_nascimento,
            email, telefone_fixo, telefone_celular, cep, endereco,
            bairro, cidade, uf
        } = req.body;

        const query = `
            UPDATE contatos SET
                natureza_contato = $1, nome = $2, sigla = $3, cpf = $4, rg = $5,
                data_nascimento = $6, email = $7, telefone_fixo = $8, telefone_celular = $9,
                cep = $10, endereco = $11, bairro = $12, cidade = $13, uf = $14,
                atualizado_em = NOW()
            WHERE id = $15
            RETURNING *
        `;

        const values = [
            natureza_contato, nome, sigla, cpf, rg, data_nascimento,
            email, telefone_fixo, telefone_celular, cep, endereco,
            bairro, cidade, uf, id
        ];

        const { rows } = await db.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Contato não encontrado' });
        }

        res.json(rows[0]);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: 'Erro ao atualizar contato' });
        next(err);
    }
});

// DELETE /api/contatos/:id - Excluir contato
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('DELETE FROM contatos WHERE id = $1 RETURNING *', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Contato não encontrado' });
        }

        res.json({ message: 'Contato excluído com sucesso' });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: 'Erro ao excluir contato' });
        next(err);
    }
});

module.exports = router;

