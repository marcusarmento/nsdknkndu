
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

// Estilos simples para o formulário (podem ser movidos para um CSS)
const formStyle = { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '1rem', 
    maxWidth: '600px', 
    margin: '0 auto' 
};
const inputStyle = { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' };
const buttonStyle = { padding: '0.75rem', borderRadius: '4px', border: 'none', backgroundColor: '#4f46e5', color: 'white', cursor: 'pointer' };

function IniciarProcesso() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        numero_processo: '',
        tipo_processo: '',
        especificacao: '',
        interessado: '',
        observacoes: '',
        nivel_acesso: 'publico', // Valor padrão
        tipo: 'gerado', // Valor padrão
    });
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await api.processos.create(formData);
            alert('Processo iniciado com sucesso!');
            navigate('/'); // Redireciona para o Dashboard
        } catch (err) {
            setError(err.message || 'Falha ao criar processo.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h2>Iniciar Novo Processo</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                <input 
                    type="text" 
                    name="numero_processo" 
                    value={formData.numero_processo} 
                    onChange={handleChange} 
                    placeholder="Número do Processo" 
                    style={inputStyle} 
                    required 
                />
                <input 
                    type="text" 
                    name="interessado" 
                    value={formData.interessado} 
                    onChange={handleChange} 
                    placeholder="Interessado" 
                    style={inputStyle} 
                    required 
                />
                <input 
                    type="text" 
                    name="tipo_processo" 
                    value={formData.tipo_processo} 
                    onChange={handleChange} 
                    placeholder="Tipo de Processo (ex: férias, abono)" 
                    style={inputStyle} 
                />
                <textarea 
                    name="especificacao" 
                    value={formData.especificacao} 
                    onChange={handleChange} 
                    placeholder="Especificação"
                    style={inputStyle}
                ></textarea>
                <select name="nivel_acesso" value={formData.nivel_acesso} onChange={handleChange} style={inputStyle}>
                    <option value="publico">Público</option>
                    <option value="restrito">Restrito</option>
                    <option value="sigiloso">Sigiloso</option>
                </select>
                
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit" style={buttonStyle} disabled={submitting}>
                    {submitting ? 'Enviando...' : 'Iniciar Processo'}
                </button>
            </form>
        </div>
    );
}

export default IniciarProcesso;
