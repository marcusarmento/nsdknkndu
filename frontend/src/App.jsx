
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import IniciarProcesso from './pages/IniciarProcesso';
import ProcessoView from './pages/ProcessoView';
import Pesquisa from './pages/Pesquisa';
import Estatisticas from './pages/Estatisticas';
import Blocos from './pages/Blocos';
import NovoBloco from './pages/NovoBloco';
import StaticPage from './pages/StaticPage';

// Placeholder para outras páginas que ainda não criamos
const Placeholder = ({ title }) => <h2>{title}</h2>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Todas as rotas dentro de Layout terão o sidebar e header */}
        <Route path="/" element={<Layout />}>
          {/* A rota inicial (index) será o Dashboard */}
          <Route index element={<Dashboard />} />
          
          {/* Adicionando rotas placeholder para os outros links */}
          <Route path="/iniciar-processo" element={<IniciarProcesso />} />
          <Route path="/retorno-programado" element={<Placeholder title="Retorno Programado" />} />
          <Route path="/pesquisa" element={<Pesquisa />} />
          <Route path="/base-conhecimento" element={<Placeholder title="Base de Conhecimento" />} />
          <Route path="/textos-padrao" element={<Placeholder title="Textos Padrão" />} />
          <Route path="/modelos" element={<Placeholder title="Modelos" />} />
          <Route path="/acompanhamento" element={<StaticPage htmlFileName="acompanhamento.html" />} />
          <Route path="/blocos" element={<Blocos />} />
          <Route path="/blocos/novo" element={<NovoBloco />} />
          <Route path="/estatisticas" element={<Estatisticas />} />
          <Route path="/processo/:id" element={<ProcessoView />} />

          {/* Rota para qualquer caminho não encontrado */}
          <Route path="*" element={<Placeholder title="Página não encontrada" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
