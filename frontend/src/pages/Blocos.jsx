
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

function Blocos() {
    const [blocos, setBlocos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBlocos = async () => {
        try {
            setLoading(true);
            const data = await api.blocos.getAll();
            setBlocos(data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Falha ao carregar blocos.');
            setBlocos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlocos();
    }, []);

    const handleDelete = async (blocoId) => {
        if (window.confirm('Tem certeza que deseja excluir este bloco?')) {
            try {
                await api.blocos.delete(blocoId);
                setBlocos(currentBlocos => currentBlocos.filter(b => b.id !== blocoId));
            } catch (err) {
                alert(`Falha ao excluir o bloco: ${err.message}`);
            }
        }
    };

    return (
        <>
            <header className="main-header">
                <div className="page-title">
                    <h2>Gerenciamento de Blocos</h2>
                    <p>Organize processos em blocos para assinatura, reunião ou organização interna.</p>
                </div>
                <div className="header-actions">
                    <Link to="/blocos/novo" className="btn btn-primary"><i className="fa-solid fa-plus"></i> Novo Bloco</Link>
                </div>
            </header>

            <section className="module-card">
                <div className="card-body">
                    {loading && <p>Carregando blocos...</p>}
                    {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
                    {!loading && !error && blocos.length === 0 && <p>Nenhum bloco encontrado.</p>}
                    {!loading && !error && blocos.length > 0 && (
                        <table className="stats-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Descrição</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blocos.map(bloco => (
                                    <tr key={bloco.id}>
                                        <td><Link to={`/bloco-view/${bloco.id}`}>{bloco.id}</Link></td>
                                        <td>{bloco.nome}</td>
                                        <td>{bloco.descricao}</td>
                                        <td className="actions-cell">
                                            <Link to={`/bloco-view/${bloco.id}`} className="action-btn" title="Visualizar Processos"><i className="fa-solid fa-folder-open"></i></Link>
                                            <button className="action-btn" title="Editar Bloco"><i className="fa-solid fa-pencil"></i></button>
                                            <button onClick={() => handleDelete(bloco.id)} className="action-btn" title="Excluir Bloco"><i className="fa-solid fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </>
    );
}

export default Blocos;
