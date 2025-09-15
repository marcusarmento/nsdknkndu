import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ProcessosTable from '../components/ProcessosTable';

function Dashboard() {
    const [processos, setProcessos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [limit] = useState(10);
    const [offset, setOffset] = useState(0);

    const fetchProcessos = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.processos.getAll({ limit, offset });
            setProcessos(data.data);
            setTotal(data.total);
            setError(null);
        } catch (err) {
            setError(err.message || 'Falha ao carregar processos.');
            setProcessos([]);
        } finally {
            setLoading(false);
        }
    }, [limit, offset]);

    useEffect(() => {
        fetchProcessos();
    }, [fetchProcessos]);

    const handleDelete = async (processoId) => {
        if (window.confirm('Tem certeza que deseja excluir este processo?')) {
            try {
                await api.processos.delete(processoId);
                fetchProcessos();
            } catch (err) {
                alert(`Falha ao excluir o processo: ${err.message}`);
            }
        }
    };

    const handlePrevPage = () => {
        setOffset(current => Math.max(current - limit, 0));
    };

    const handleNextPage = () => {
        setOffset(current => (current + limit < total ? current + limit : current));
    };

    const processosRecebidos = processos.filter(p => p.tipo === 'recebido');
    const processosGerados = processos.filter(p => p.tipo === 'gerado');

    return (
        <>
            <section className="toolbar">
                <Link to="/anotacoes" className="tool-button" title="Inserir Anotações">
                    <i className="fa-solid fa-note-sticky"></i> Anotações
                </Link>
                <Link to="/concluir-processo" className="tool-button" title="Concluir Processo na Unidade">
                    <i className="fa-solid fa-check-double"></i> Concluir
                </Link>
            </section>

            <div className="content-modules">
                <section className="module-card">
                    <div className="card-header"><h3><i className="fa-solid fa-arrow-down-long"></i> Recebidos</h3></div>
                    <div className="card-body">
                        {loading && <p>Carregando...</p>}
                        {error && <p style={{color: 'red'}}>{error}</p>}
                        {!loading && !error && (
                            <ProcessosTable
                                processos={processosRecebidos}
                                onDelete={handleDelete}
                                pagination={{ total, limit, offset, onPrev: handlePrevPage, onNext: handleNextPage }}
                            />
                        )}
                    </div>
                </section>

                <section className="module-card">
                    <div className="card-header"><h3><i className="fa-solid fa-arrow-up-long"></i> Gerados</h3></div>
                    <div className="card-body">
                        {loading && <p>Carregando...</p>}
                        {error && <p style={{color: 'red'}}>{error}</p>}
                        {!loading && !error && (
                            <ProcessosTable processos={processosGerados} onDelete={handleDelete} />
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}

export default Dashboard;