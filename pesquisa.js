document.addEventListener('DOMContentLoaded', function() {
    
    // --- Lógica para os filtros de data ---
    const dateExplicitRadio = document.getElementById('date-explicit');
    const otherDateRadios = document.querySelectorAll('input[name="date_filter"]:not(#date-explicit)');
    const dateFields = document.getElementById('date-explicit-fields');

    dateExplicitRadio.addEventListener('change', function() {
        if (this.checked) {
            dateFields.classList.remove('hidden');
        }
    });

    otherDateRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                dateFields.classList.add('hidden');
            }
        });
    });

    // --- Lógica para busca real ---
    const form = document.getElementById('form-pesquisa');
    const placeholder = document.getElementById('results-placeholder');
    const resultsList = document.getElementById('results-list');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Impede o envio real do formulário

        try {
            // Coleta os parâmetros de busca
            const formData = new FormData(form);
            const params = new URLSearchParams();
            
            if (formData.get('termo')) params.append('q', formData.get('termo'));
            if (formData.get('tipo')) params.append('tipo', formData.get('tipo'));
            if (formData.get('data_inicio')) params.append('data_inicio', formData.get('data_inicio'));
            if (formData.get('data_fim')) params.append('data_fim', formData.get('data_fim'));

            // Faz a busca na API
            const response = await fetch(`http://localhost:3000/api/pesquisa?${params}`);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const resultados = await response.json();
            
            // Esconde o placeholder e mostra os resultados
            placeholder.classList.add('hidden');
            resultsList.classList.remove('hidden');
            
            // Exibe os resultados
            exibirResultados(resultados);

        } catch (error) {
            console.error('Erro na busca:', error);
            exibirErro('Erro ao realizar busca: ' + error.message);
        }
    });

    // Função para exibir resultados da busca
    function exibirResultados(resultados) {
        const resultsContainer = document.getElementById('results-list');
        if (!resultsContainer) return;

        if (resultados.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">Nenhum processo encontrado.</p>';
            return;
        }

        let html = '<div class="results-grid">';
        
        resultados.forEach(processo => {
            html += `
                <div class="result-item">
                    <h3><a href="processo-view.html?id=${processo.id}">${processo.numero_processo}</a></h3>
                    <p><strong>Tipo:</strong> ${processo.tipo_processo || 'N/A'}</p>
                    <p><strong>Interessado:</strong> ${processo.interessado || 'N/A'}</p>
                    <p><strong>Data:</strong> ${new Date(processo.criado_em).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Status:</strong> ${processo.tipo === 'recebido' ? 'Recebido' : 'Gerado'}</p>
                    ${processo.especificacao ? `<p><strong>Especificação:</strong> ${processo.especificacao}</p>` : ''}
                </div>
            `;
        });
        
        html += '</div>';
        resultsContainer.innerHTML = html;
    }

    // Função para exibir erro
    function exibirErro(mensagem) {
        const resultsContainer = document.getElementById('results-list');
        if (resultsContainer) {
            resultsContainer.innerHTML = `<p class="error-message">${mensagem}</p>`;
        }
    }

});