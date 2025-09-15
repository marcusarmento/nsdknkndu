import './styles/App.css';
import './styles/Layout.css';
import './styles/painel-de-controle.css';
import './styles/exportar-processo.css';
import './styles/bloco-view.css';
import './styles/editor.css';
import './styles/enviar-processo.css';
import './styles/novo-contato.css';
import './styles/contatos.css';
import './styles/dashboard.css';
import './styles/andamento.css';
import './styles/gerar-documento.css';
import './styles/modal-actions.css';
import './styles/processo-view.css';
import './styles/acompanhamento.css';
import './styles/base-conhecimento.css';
import './styles/blocos.css';
import './styles/estatisticas.css';
import './styles/iniciar-processo.css';
import './styles/login.css';
import './styles/pesquisa.css';
import './styles/retorno-programado.css';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
