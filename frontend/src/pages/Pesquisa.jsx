
import React, { useState } from 'react';
import { api } from '../api';
import ProcessosTable from '../components/ProcessosTable';

// Estilos (podem ser movidos para um CSS)
const formStyle = { display: 'flex', gap: '1rem', marginBottom: '2rem' };
const inputStyle = { flexGrow: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' };
const buttonStyle = { padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: '#4f46e5', color: 'white', cursor: 'pointer' };

function Pesquisa() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return; // Não busca se o campo estiver vazio

        setLoading(true);
        setSearched(true);
        setError(null);
        try {
            const data = await api.processos.search({ q: query });
            setResults(data);
        } catch (err) {
            setError(err.message || 'Falha na busca.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    // A função de exclusão para passar para a tabela
    // Isso garante que a UI seja atualizada após a exclusão na página de pesquisa
    const handleDelete = async (processoId) => {
        if (window.confirm('Tem certeza que deseja excluir este processo?')) {
            try {
                await api.processos.delete(processoId);
                setResults(results.filter(p => p.id !== processoId));
            } catch (err) {
                alert(`Falha ao excluir o processo: ${err.message}`);
            }
        }
    };

    return (
        <div>
            <h2>Pesquisa de Processos</h2>
            <form onSubmit={handleSearch} style={formStyle}>
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Digite um número de processo, interessado ou especificação..."
                    style={inputStyle}
                />
                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? 'Buscando...' : 'Pesquisar'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

            {searched && !loading && (
                <div>
                    <h3>Resultados da Busca</h3>
                    <ProcessosTable processos={results} onDelete={handleDelete} />
                </div>
            )}
        </div>
    );
}

export default Pesquisa;
