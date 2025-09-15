
import React, { useState, useEffect } from 'react';

function StaticPage({ htmlFileName }) {
    const [htmlContent, setHtmlContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHtml = async () => {
            try {
                setLoading(true);
                // O caminho para o arquivo HTML original na raiz do projeto
                const response = await fetch(`/${htmlFileName}`);
                if (!response.ok) {
                    throw new Error(`Falha ao carregar ${htmlFileName}: ${response.statusText}`);
                }
                const text = await response.text();
                setHtmlContent(text);
                setError(null);
            } catch (err) {
                setError(err.message);
                setHtmlContent('');
            } finally {
                setLoading(false);
            }
        };

        fetchHtml();
    }, [htmlFileName]); // Re-executa se o nome do arquivo HTML mudar

    if (loading) {
        return <p>Carregando conteúdo da página...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>Erro: {error}</p>;
    }

    // Renderiza o HTML bruto. CUIDADO: Use apenas com HTML de confiança.
    return (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
}

export default StaticPage;
