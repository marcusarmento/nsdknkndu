import React from 'react';
import { Link } from 'react-router-dom';

function ProcessosTable({ processos, onDelete, pagination }) {
    const hasProcessos = processos && processos.length > 0;

    return (
        <>
            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" /></th>
                        <th>Processo</th>
                        <th>Interessado</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {hasProcessos ? (
                        processos.map(processo => (
                            <tr key={processo.id}>
                                <td><input type="checkbox" /></td>
                                <td>
                                    <Link to={`/processo/${processo.id}`} title="Abrir Processo">
                                        {processo.numero_processo}
                                    </Link>
                                </td>
                                <td>({processo.interessado || 'N/A'})</td>
                                <td className="actions-cell">
                                    <Link to={`/enviar-processo/${processo.id}`} className="action-btn" title="Enviar Processo">
                                        <i className="fa-solid fa-paper-plane"></i>
                                    </Link>
                                    <Link to={`/atribuir-processo/${processo.id}`} className="action-btn" title="Atribuir">
                                        <i className="fa-solid fa-user-tag"></i>
                                    </Link>
                                    <button onClick={() => onDelete(processo.id)} className="action-btn" title="Excluir">
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>Nenhum processo encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {pagination && (
                <div className="pagination-controls">
                    <button onClick={pagination.onPrev} disabled={pagination.offset === 0}>Anterior</button>
                    <span>
                        {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} de {pagination.total}
                    </span>
                    <button onClick={pagination.onNext} disabled={pagination.offset + pagination.limit >= pagination.total}>Próximo</button>
                </div>
            )}
        </>
    );
}

export default ProcessosTable;