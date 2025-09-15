import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ProcessosTable from '../components/ProcessosTable';

function Dashboard() {
    const [processos, setProcessos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProcessos = async () => {
            try {
                setLoading(true);
                const data = await api.processos.getAll();
                setProcessos(data);
                setError(null);
            } catch (err) {
                setError(err.message || 'Falha ao carregar processos.');
                setProcessos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProcessos();
    }, []);

    const handleDelete = async (processoId) => {
        if (window.confirm('Tem certeza que deseja excluir este processo?')) {
            try {
                await api.processos.delete(processoId);
                setProcessos(currentProcessos => currentProcessos.filter(p => p.id !== processoId));
            } catch (err) {
                alert(`Falha ao excluir o processo: ${err.message}`);
            }
        }
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
                        {!loading && !error && 
                            <ProcessosTable processos={processosRecebidos} onDelete={handleDelete} />
                        }
                    </div>
                </section>

                <section className="module-card">
                    <div className="card-header"><h3><i className="fa-solid fa-arrow-up-long"></i> Gerados</h3></div>
                    <div className="card-body">
                        {loading && <p>Carregando...</p>}
                        {error && <p style={{color: 'red'}}>{error}</p>}
                        {!loading && !error && 
                            <ProcessosTable processos={processosGerados} onDelete={handleDelete} />
                        }
                    </div>
                </section>
            </div>
        </>
    );
}

export default Dashboard;