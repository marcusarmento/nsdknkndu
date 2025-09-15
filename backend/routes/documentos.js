
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/documentos - Buscar todos os documentos
router.get('/', async (req, res) => {
    try {
        const { processo_id } = req.query;
        let query = 'SELECT * FROM documentos';
        const values = [];
        
        if (processo_id) {
            query += ' WHERE processo_id = $1';
            values.push(processo_id);
        }
        
        query += ' ORDER BY criado_em DESC';
        
        const { rows } = await db.query(query, values);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// GET /api/documentos/:id - Buscar documento específico
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM documentos WHERE id = $1', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Documento não encontrado' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// POST /api/documentos - Criar novo documento
router.post('/', async (req, res) => {
    try {
        const {
            processo_id,
            titulo,
            tipo_documento,
            conteudo,
            arquivo_path,
            nivel_acesso
        } = req.body;

        const query = `
            INSERT INTO documentos (
                processo_id, titulo, tipo_documento, conteudo, 
                arquivo_path, nivel_acesso, criado_em
            ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING *
        `;
        
        const values = [
            processo_id, titulo, tipo_documento, conteudo,
            arquivo_path, nivel_acesso
        ];

        const { rows } = await db.query(query, values);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao criar documento' });
    }
});

// PUT /api/documentos/:id - Atualizar documento
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            titulo,
            tipo_documento,
            conteudo,
            arquivo_path,
            nivel_acesso
        } = req.body;

        const query = `
            UPDATE documentos SET 
                titulo = $1, tipo_documento = $2, conteudo = $3,
                arquivo_path = $4, nivel_acesso = $5, atualizado_em = NOW()
            WHERE id = $6
            RETURNING *
        `;
        
        const values = [
            titulo, tipo_documento, conteudo, arquivo_path, nivel_acesso, id
        ];

        const { rows } = await db.query(query, values);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Documento não encontrado' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao atualizar documento' });
    }
});

// DELETE /api/documentos/:id - Excluir documento
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('DELETE FROM documentos WHERE id = $1 RETURNING *', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Documento não encontrado' });
        }
        
        res.json({ message: 'Documento excluído com sucesso' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao excluir documento' });
    }
});

module.exports = router;
