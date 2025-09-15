
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

// Estilos simples para a página de visualização
const viewStyle = { padding: '1rem', background: '#fff', borderRadius: '8px' };
const detailGrid = { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem' };
const detailLabel = { fontWeight: 'bold', color: '#555' };

function ProcessoView() {
    const { id } = useParams(); // Pega o :id da URL
    const [processo, setProcesso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProcesso = async () => {
            try {
                setLoading(true);
                const data = await api.processos.getById(id);
                setProcesso(data);
                setError(null);
            } catch (err) {
                setError(err.message || `Falha ao carregar o processo ${id}.`);
                setProcesso(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProcesso();
    }, [id]); // Re-executa o efeito se o ID na URL mudar

    if (loading) {
        return <p>Carregando detalhes do processo...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>Erro: {error}</p>;
    }

    if (!processo) {
        return <p>Processo não encontrado.</p>;
    }

    return (
        <div style={viewStyle}>
            <h2>Detalhes do Processo</h2>
            <div style={detailGrid}>
                <span style={detailLabel}>Número:</span>
                <span>{processo.numero_processo}</span>

                <span style={detailLabel}>Interessado:</span>
                <span>{processo.interessado}</span>

                <span style={detailLabel}>Tipo:</span>
                <span>{processo.tipo_processo}</span>

                <span style={detailLabel}>Especificação:</span>
                <span>{processo.especificacao}</span>

                <span style={detailLabel}>Nível de Acesso:</span>
                <span>{processo.nivel_acesso}</span>

                <span style={detailLabel}>Observações:</span>
                <span>{processo.observacoes}</span>

                <span style={detailLabel}>Criado em:</span>
                <span>{new Date(processo.criado_em).toLocaleString('pt-BR')}</span>
            </div>
            <br />
            <Link to="/">Voltar para o Dashboard</Link>
        </div>
    );
}

export default ProcessoView;
