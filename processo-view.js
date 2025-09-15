document.addEventListener('DOMContentLoaded', function() {

    // Carregar dados do processo ao inicializar
    carregarProcesso();

    // --- LÓGICA GERAL USANDO DELEGAÇÃO DE EVENTOS ---

    // Adiciona um único "ouvinte" de eventos para a página inteira
    document.addEventListener('click', function(event) {

        // Verifica se o elemento clicado (ou um de seus pais) é um botão para ABRIR modal
        const openButton = event.target.closest('.js-open-modal');
        if (openButton) {
            event.preventDefault(); // Previne a ação padrão de links
            const modalId = openButton.dataset.modalId;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('hidden');
            }
            return; // Encerra a função aqui para não continuar verificando
        }

        // Verifica se o elemento clicado (ou um de seus pais) é um botão para FECHAR modal
        const closeButton = event.target.closest('.js-close-modal, .close-button');
        if (closeButton) {
            const modal = closeButton.closest('.modal-overlay');
            if (modal) {
                modal.classList.add('hidden');
            }
            return; // Encerra a função
        }
    });

    // --- FUNÇÕES DE CARREGAMENTO DE DADOS ---

    // Função para carregar dados do processo
    async function carregarProcesso() {
        try {
            // Obter ID do processo da URL
            const urlParams = new URLSearchParams(window.location.search);
            const processoId = urlParams.get('id') || 1;
            
            // Carregar dados do processo
            const responseProcesso = await fetch(`http://localhost:3000/api/processos/${processoId}`);
            
            if (!responseProcesso.ok) {
                throw new Error('Processo não encontrado');
            }
            
            const processo = await responseProcesso.json();
            exibirDadosProcesso(processo);
            
            // Carregar documentos do processo
            await carregarDocumentos(processoId);
            
        } catch (error) {
            console.error('Erro ao carregar processo:', error);
            exibirErro('Erro ao carregar dados do processo');
        }
    }

    // Função para exibir dados do processo
    function exibirDadosProcesso(processo) {
        // Atualizar título da página
        const tituloProcesso = document.getElementById('processo-numero');
        if (tituloProcesso) {
            tituloProcesso.textContent = `Processo ${processo.numero_processo}`;
        }

        // Atualizar link de gerar documento
        const linkGerarDocumento = document.getElementById('link-gerar-documento');
        if (linkGerarDocumento) {
            linkGerarDocumento.href = `gerar-documento.html?processo_id=${processo.id}`;
        }

        // Atualizar informações do processo na interface
        const infoProcesso = document.getElementById('info-processo');
        if (infoProcesso) {
            infoProcesso.innerHTML = `
                <div class="info-item">
                    <strong>Tipo:</strong> ${processo.tipo_processo || 'N/A'}
                </div>
                <div class="info-item">
                    <strong>Interessado:</strong> ${processo.interessado || 'N/A'}
                </div>
                <div class="info-item">
                    <strong>Status:</strong> ${processo.tipo === 'recebido' ? 'Recebido' : 'Gerado'}
                </div>
                <div class="info-item">
                    <strong>Nível de Acesso:</strong> ${processo.nivel_acesso || 'N/A'}
                </div>
                <div class="info-item">
                    <strong>Data de Criação:</strong> ${new Date(processo.criado_em).toLocaleDateString('pt-BR')}
                </div>
            `;
        }
    }

    // Função para carregar documentos do processo
    async function carregarDocumentos(processoId) {
        try {
            const response = await fetch(`http://localhost:3000/api/documentos?processo_id=${processoId}`);
            
            if (!response.ok) {
                throw new Error('Erro ao carregar documentos');
            }
            
            const documentos = await response.json();
            exibirDocumentos(documentos);
            
        } catch (error) {
            console.error('Erro ao carregar documentos:', error);
            exibirErroDocumentos('Erro ao carregar documentos');
        }
    }

    // Função para exibir documentos na interface
    function exibirDocumentos(documentos) {
        const containerDocumentos = document.getElementById('documentos-lista');
        if (!containerDocumentos) return;

        if (documentos.length === 0) {
            containerDocumentos.innerHTML = '<p class="no-documents">Nenhum documento encontrado.</p>';
            return;
        }

        let html = '<div class="documentos-grid">';
        
        documentos.forEach(documento => {
            html += `
                <div class="documento-item">
                    <div class="documento-header">
                        <h4>${documento.titulo}</h4>
                        <span class="documento-tipo">${documento.tipo_documento}</span>
                    </div>
                    <div class="documento-content">
                        <p><strong>Nível de Acesso:</strong> ${documento.nivel_acesso}</p>
                        <p><strong>Criado em:</strong> ${new Date(documento.criado_em).toLocaleDateString('pt-BR')}</p>
                        ${documento.arquivo_path ? `<p><strong>Arquivo:</strong> ${documento.arquivo_path}</p>` : ''}
                    </div>
                    <div class="documento-actions">
                        <button class="btn btn-sm btn-primary" onclick="visualizarDocumento(${documento.id})">
                            <i class="fa-solid fa-eye"></i> Visualizar
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="editarDocumento(${documento.id})">
                            <i class="fa-solid fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="excluirDocumento(${documento.id})">
                            <i class="fa-solid fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        containerDocumentos.innerHTML = html;
    }

    // Função para exibir erro
    function exibirErro(mensagem) {
        const container = document.getElementById('info-processo');
        if (container) {
            container.innerHTML = `<p class="error-message">${mensagem}</p>`;
        }
    }

    // Função para exibir erro de documentos
    function exibirErroDocumentos(mensagem) {
        const container = document.getElementById('documentos-lista');
        if (container) {
            container.innerHTML = `<p class="error-message">${mensagem}</p>`;
        }
    }

    // --- LÓGICAS ESPECÍFICAS DE CADA MODAL ---

    // Modal: Sobrestar Processo
    const radioSimples = document.getElementById('tipo-somente-sobrestar');
    const radioVinculado = document.getElementById('tipo-sobrestar-vinculado');
    const campoProcessoVinculado = document.getElementById('campo-processo-vinculado');

    if (radioSimples && radioVinculado) {
        radioSimples.addEventListener('change', () => campoProcessoVinculado.classList.add('hidden'));
        radioVinculado.addEventListener('change', () => campoProcessoVinculado.classList.remove('hidden'));
    }

    // Modal: Relacionar Processo
    const btnPesquisarProcesso = document.getElementById('btn-pesquisar-processo');
    const inputTipoProcesso = document.getElementById('processo-destino-tipo');
    const btnAdicionarRelacionamento = document.getElementById('btn-adicionar-relacionamento');

    if (btnPesquisarProcesso) {
        btnPesquisarProcesso.addEventListener('click', () => {
            inputTipoProcesso.value = "Treinamento de usuários do SEI";
            btnAdicionarRelacionamento.disabled = false;
        });
    }

    // --- FUNÇÕES GLOBAIS PARA AÇÕES DE DOCUMENTOS ---

    window.visualizarDocumento = async function(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/documentos/${id}`);
            const documento = await response.json();
            
            // Abrir modal ou nova janela para visualizar documento
            const modal = document.getElementById('modal-visualizar-documento');
            if (modal) {
                document.getElementById('documento-titulo').textContent = documento.titulo;
                document.getElementById('documento-conteudo').textContent = documento.conteudo;
                modal.classList.remove('hidden');
            } else {
                // Fallback: mostrar em alert
                alert(`Título: ${documento.titulo}\n\nConteúdo:\n${documento.conteudo}`);
            }
        } catch (error) {
            console.error('Erro ao visualizar documento:', error);
            alert('Erro ao visualizar documento: ' + error.message);
        }
    };

    window.editarDocumento = function(id) {
        window.location.href = `gerar-documento.html?documento_id=${id}`;
    };

    window.excluirDocumento = async function(id) {
        if (confirm('Tem certeza que deseja excluir este documento?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/documentos/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Erro ao excluir documento');
                }

                alert('Documento excluído com sucesso!');
                carregarProcesso(); // Recarrega os dados
                
            } catch (error) {
                console.error('Erro ao excluir documento:', error);
                alert('Erro ao excluir documento: ' + error.message);
            }
        }
    };

});