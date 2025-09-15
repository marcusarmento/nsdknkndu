document.addEventListener('DOMContentLoaded', function() {

    // Carregar estatísticas ao inicializar
    carregarEstatisticas();

    // Função para carregar estatísticas da API
    async function carregarEstatisticas() {
        try {
            // Carregar dados de processos por tipo
            const responseProcessos = await fetch('http://localhost:3000/api/estatisticas/processos-por-tipo');
            const processosPorTipo = await responseProcessos.json();

            // Carregar dados de tempo médio
            const responseTempo = await fetch('http://localhost:3000/api/estatisticas/tempo-medio');
            const tempoMedio = await responseTempo.json();

            // Criar gráficos com dados reais
            criarGraficoProcessosPorTipo(processosPorTipo);
            criarGraficoTempoMedio(tempoMedio);

        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            // Usar dados de exemplo em caso de erro
            criarGraficoProcessosPorTipo([
                { tipo_processo: 'ferias', quantidade: 2 },
                { tipo_processo: 'abono', quantidade: 5 },
                { tipo_processo: 'adicional', quantidade: 3 },
                { tipo_processo: 'outro', quantidade: 1 }
            ]);
            criarGraficoTempoMedio([
                { mes: '2024-01-01', tempo_medio_dias: 5.5 },
                { mes: '2024-02-01', tempo_medio_dias: 6.2 },
                { mes: '2024-03-01', tempo_medio_dias: 5.1 },
                { mes: '2024-04-01', tempo_medio_dias: 7.0 },
                { mes: '2024-05-01', tempo_medio_dias: 6.5 }
            ]);
        }
    }

    // Função para criar gráfico de processos por tipo
    function criarGraficoProcessosPorTipo(dados) {
        const ctxGerados = document.getElementById('chartProcessosGerados');
        if (!ctxGerados) return;

        const labels = dados.map(item => {
            const tipos = {
                'ferias': 'Férias',
                'abono': 'Abono',
                'adicional': 'Adicional Noturno',
                'outro': 'Outros'
            };
            return tipos[item.tipo_processo] || item.tipo_processo;
        });
        
        const valores = dados.map(item => item.quantidade);

        new Chart(ctxGerados, {
            type: 'bar', 
            data: {
                labels: labels, 
                datasets: [{
                    label: 'Nº de Processos Gerados',
                    data: valores, 
                    backgroundColor: 'rgba(25, 118, 210, 0.7)',
                    borderColor: 'rgba(25, 118, 210, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                }
            }
        });
    }

    // Função para criar gráfico de tempo médio
    function criarGraficoTempoMedio(dados) {
        const ctxTempo = document.getElementById('chartTempoMedio');
        if (!ctxTempo) return;

        const labels = dados.map(item => {
            const data = new Date(item.mes);
            return data.toLocaleDateString('pt-BR', { month: 'long' });
        });
        
        const valores = dados.map(item => parseFloat(item.tempo_medio_dias).toFixed(1));

        new Chart(ctxTempo, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tempo Médio em Dias',
                    data: valores,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false
                    }
                }
            }
        });
    }

});