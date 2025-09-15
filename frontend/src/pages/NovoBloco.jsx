
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

function NovoBloco() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
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
            await api.blocos.create(formData);
            alert('Bloco criado com sucesso!');
            navigate('/blocos'); // Redireciona para a lista de blocos
        } catch (err) {
            setError(err.message || 'Falha ao criar bloco.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h2>Criar Novo Bloco</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label htmlFor="nome">Nome do Bloco</label>
                    <input 
                        type="text" 
                        id="nome" 
                        name="nome" 
                        value={formData.nome} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="descricao">Descrição</label>
                    <textarea 
                        id="descricao" 
                        name="descricao" 
                        value={formData.descricao} 
                        onChange={handleChange} 
                    ></textarea>
                </div>
                
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Criando...' : 'Criar Bloco'}
                </button>
            </form>
        </div>
    );
}

export default NovoBloco;
