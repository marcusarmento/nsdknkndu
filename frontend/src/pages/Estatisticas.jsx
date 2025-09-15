
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Registrar os componentes do Chart.js que vamos usar
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

function Estatisticas() {
    const [processosData, setProcessosData] = useState(null);
    const [tempoMedioData, setTempoMedioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEstatisticas = async () => {
            try {
                setLoading(true);
                // Busca os dois endpoints em paralelo
                const [processosRes, tempoMedioRes] = await Promise.all([
                    api.estatisticas.getProcessosPorTipo(),
                    api.estatisticas.getTempoMedio(),
                ]);

                // Formata dados para o gráfico de barras
                setProcessosData({
                    labels: processosRes.map(p => p.tipo_processo),
                    datasets: [{
                        label: 'Nº de Processos Gerados',
                        data: processosRes.map(p => p.quantidade),
                        backgroundColor: 'rgba(25, 118, 210, 0.7)',
                    }]
                });

                // Formata dados para o gráfico de linha
                setTempoMedioData({
                    labels: tempoMedioRes.map(t => new Date(t.mes).toLocaleDateString('pt-BR', { month: 'long' })),
                    datasets: [{
                        label: 'Tempo Médio em Dias',
                        data: tempoMedioRes.map(t => parseFloat(t.tempo_medio_dias).toFixed(1)),
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                });

                setError(null);
            } catch (err) {
                setError(err.message || 'Falha ao carregar estatísticas.');
            } finally {
                setLoading(false);
            }
        };

        fetchEstatisticas();
    }, []);

    const barOptions = { responsive: true, plugins: { legend: { position: 'top' } } };
    const lineOptions = { responsive: true };

    return (
        <>
            <div className="stats-grid">
                <section className="module-card">
                    <div className="card-header">
                        <h3>Processos Gerados no Período (por tipo)</h3>
                    </div>
                    <div className="card-body">
                        {loading && <p>Carregando gráfico...</p>}
                        {error && <p style={{color: 'red'}}>{error}</p>}
                        {processosData && <Bar options={barOptions} data={processosData} />}
                    </div>
                </section>

                <section className="module-card">
                    <div className="card-header">
                        <h3>Tempo Médio de Tramitação</h3>
                    </div>
                    <div className="card-body">
                        {loading && <p>Carregando gráfico...</p>}
                        {error && <p style={{color: 'red'}}>{error}</p>}
                        {tempoMedioData && <Line options={lineOptions} data={tempoMedioData} />}
                    </div>
                </section>

                {/* A tabela estática pode ser adicionada aqui se necessário */}
            </div>
        </>
    );
}

export default Estatisticas;
