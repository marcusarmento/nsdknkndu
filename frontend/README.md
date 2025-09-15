# Frontend SDI

Aplicação React com Vite que compõe a interface do Sistema de Documentos Integrado (SDI).

## Páginas
- **Dashboard** – painel inicial com processos recebidos e gerados.
- **Blocos** – gerenciamento de blocos de processos (listagem, criação e exclusão).
- **Estatísticas** – gráficos e indicadores de processos.
- **Pesquisa** – busca de processos cadastrados.
- **IniciarProcesso** – formulário para iniciar novo processo.
- **NovoBloco** – criação de blocos para organização interna.
- **ProcessoView** – visualização e ações sobre um processo.
- **StaticPage** – página estática de exemplo.

## Dependências principais
- [react](https://react.dev/)
- [react-dom](https://react.dev/)
- [react-router-dom](https://reactrouter.com/)
- [chart.js](https://www.chartjs.org/) e [react-chartjs-2](https://react-chartjs-2.js.org/)
- Vite e plugins de lint (`eslint`, `@vitejs/plugin-react`)

## Scripts
| Comando              | Descrição                                           |
|----------------------|-----------------------------------------------------|
| `npm install`        | instala dependências                                |
| `npm run dev`        | inicia servidor de desenvolvimento                  |
| `npm run build`      | gera build de produção                              |
| `npm run preview`    | pré-visualiza build gerado                          |
| `npm run lint`       | executa verificações de lint com ESLint             |
| `npm test`           | (sem testes configurados no momento)                |

## Integração com o backend
O backend Node/Express encontra-se em [../backend](../backend).

1. `cd backend && npm install`
2. `npm run dev` para iniciar o servidor (porta padrão **3000**)
3. No frontend, execute `npm run dev` – as requisições a `/api` serão proxyadas para `http://localhost:3000`.

## Variáveis de ambiente `VITE_*`
Vite expõe somente variáveis prefixadas com `VITE_` para o código do navegador.

Exemplo de configuração por ambiente:

- `.env.development`
  ```env
  VITE_API_URL=http://localhost:3000
  ```
- `.env.production`
  ```env
  VITE_API_URL=https://api.exemplo.com
  ```

No código, acesse-as com `import.meta.env.VITE_API_URL` e use para definir a URL base das requisições (ex.: em `src/api.js`).
