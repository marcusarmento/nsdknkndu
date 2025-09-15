import '../../painel-de-controle.css';
import '../../exportar-processo.css';
import '../../bloco-view.css';
import '../../editor.css';
import '../../enviar-processo.css';
import '../../novo-contato.css';
import '../../contatos.css';
import '../../dashboard.css';
import '../../andamento.css';
import '../../gerar-documento.css';
import '../../modal-actions.css';
import '../../processo-view.css';
import '../../acompanhamento.css';
import '../../base-conhecimento.css';
import '../../blocos.css';
import '../../estatisticas.css';
import '../../iniciar-processo.css';
import '../../login.css';
import '../../pesquisa.css';
import '../../retorno-programado.css';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
