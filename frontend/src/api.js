
// A URL base da nossa API backend
const API_BASE_URL = '/api';

/**
 * Função genérica para fazer requisições à API.
 * @param {string} endpoint - O endpoint da API a ser chamado (ex: '/processos').
 * @param {object} options - Opções para a função fetch (method, headers, body, etc.).
 * @returns {Promise<any>} - A resposta da API em formato JSON.
 */
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            // Tenta extrair uma mensagem de erro do corpo da resposta
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.error || `Erro HTTP: ${response.status}`;
            throw new Error(errorMessage);
        }

        // Se a resposta não tiver conteúdo (ex: DELETE), retorna um objeto de sucesso
        if (response.status === 204) {
            return { success: true };
        }

        return response.json();

    } catch (error) {
        console.error('Erro na requisição da API:', error);
        // Re-lança o erro para que o componente que chamou possa tratá-lo
        throw error;
    }
}

// Funções específicas para cada recurso da API

export const api = {
    processos: {
        getAll: (params = {}) => {
            const query = new URLSearchParams(params).toString();
            return request(`/processos${query ? `?${query}` : ''}`);
        },
        getById: (id) => request(`/processos/${id}`),
        create: (data) => request('/processos', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => request(`/processos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => request(`/processos/${id}`, { method: 'DELETE' }),
        search: (params) => {
            const query = new URLSearchParams(params).toString();
            return request(`/pesquisa?${query}`);
        },
    },
    contatos: {
        getAll: (params = {}) => {
            const query = new URLSearchParams(params).toString();
            return request(`/contatos${query ? `?${query}` : ''}`);
        },
        getById: (id) => request(`/contatos/${id}`),
        create: (data) => request('/contatos', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => request(`/contatos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => request(`/contatos/${id}`, { method: 'DELETE' }),
    },
    estatisticas: {
        getProcessosPorTipo: () => request('/estatisticas/processos-por-tipo'),
        getTempoMedio: () => request('/estatisticas/tempo-medio'),
    },
    blocos: {
        getAll: () => request('/blocos'),
        create: (data) => request('/blocos', { method: 'POST', body: JSON.stringify(data) }),
        delete: (id) => request(`/blocos/${id}`, { method: 'DELETE' }),
    },
    // Adicione outros recursos da API aqui conforme necessário (blocos, documentos, etc.)
};
