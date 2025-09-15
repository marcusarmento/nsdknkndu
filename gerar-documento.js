document.addEventListener('DOMContentLoaded', function() {
    
    // Carregar dados do processo
    carregarProcesso();
    
    // Função para carregar dados do processo
    async function carregarProcesso() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const processoId = urlParams.get('processo_id') || 1;
            
            const response = await fetch(`http://localhost:3000/api/processos/${processoId}`);
            
            if (response.ok) {
                const processo = await response.json();
                const display = document.getElementById('processo-numero-display');
                if (display) {
                    display.textContent = processo.numero_processo;
                }
            }
        } catch (error) {
            console.error('Erro ao carregar processo:', error);
        }
    }
    
    // Elementos da tela
    const escolhaCard = document.getElementById('escolha-tipo-card');
    const formularioCard = document.getElementById('formulario-documento-card');
    const botoesTipo = document.querySelectorAll('.tipo-documento-item');
    const botaoVoltar = document.getElementById('voltar-selecao');
    
    // Campos que mudam
    const formTitle = document.getElementById('form-title');
    const campoAnexar = document.getElementById('campo-anexar-arquivo');
    const campoTextoInicial = document.getElementById('campo-texto-inicial');

    // Quando um tipo de documento é escolhido
    botoesTipo.forEach(botao => {
        botao.addEventListener('click', () => {
            const tipo = botao.dataset.tipo;
            const nomeDocumento = botao.querySelector('span').textContent;

            // Altera o título do formulário
            formTitle.textContent = "Novo " + nomeDocumento;

            // Esconde a seleção e mostra o formulário
            escolhaCard.classList.add('hidden');
            formularioCard.classList.remove('hidden');

            // Mostra/esconde campos com base no tipo
            if (tipo === 'externo') {
                campoAnexar.classList.remove('hidden');
                campoTextoInicial.classList.add('hidden');
            } else {
                campoAnexar.classList.add('hidden');
                campoTextoInicial.classList.remove('hidden');
            }
        });
    });

    // Quando o usuário quer voltar para a seleção de tipo
    botaoVoltar.addEventListener('click', () => {
        escolhaCard.classList.remove('hidden');
        formularioCard.classList.add('hidden');
    });

    // --- Lógica do Painel de Nível de Acesso ---
    const radiosAcessoDoc = document.querySelectorAll('input[name="acesso_doc"]');
    function atualizarAcessoDoc() {
        document.getElementById('doc-explanation-publico').classList.add('hidden');
        document.getElementById('doc-explanation-restrito').classList.add('hidden');
        document.getElementById('doc-explanation-sigiloso').classList.add('hidden');

        if (document.getElementById('doc-acesso-publico').checked) {
            document.getElementById('doc-explanation-publico').classList.remove('hidden');
        } else if (document.getElementById('doc-acesso-restrito').checked) {
            document.getElementById('doc-explanation-restrito').classList.remove('hidden');
        } else if (document.getElementById('doc-acesso-sigiloso').checked) {
            document.getElementById('doc-explanation-sigiloso').classList.remove('hidden');
        }
    }
    radiosAcessoDoc.forEach(radio => radio.addEventListener('change', atualizarAcessoDoc));
    atualizarAcessoDoc(); // Estado inicial

    // --- Lógica de Envio do Formulário de Documento ---
    const formDocumento = document.getElementById('form-gerar-documento');
    
    formDocumento.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        try {
            // Obter ID do processo da URL ou usar um padrão
            const urlParams = new URLSearchParams(window.location.search);
            const processoId = urlParams.get('processo_id') || 1; // Fallback para processo 1
            
            // Coletar dados do formulário
            const formData = {
                processo_id: parseInt(processoId),
                titulo: document.getElementById('descricao').value || 'Documento sem título',
                tipo_documento: formTitle.textContent.replace('Novo ', ''),
                conteudo: gerarConteudoDocumento(),
                arquivo_path: null, // Para documentos internos
                nivel_acesso: document.querySelector('input[name="acesso_doc"]:checked')?.value || 'publico'
            };

            // Se for documento externo, processar arquivo
            const arquivoInput = document.getElementById('anexar-arquivo');
            if (arquivoInput && arquivoInput.files.length > 0) {
                const arquivo = arquivoInput.files[0];
                formData.arquivo_path = `uploads/${arquivo.name}`;
                formData.titulo = arquivo.name;
            }

            // Validação básica
            if (!formData.titulo) {
                alert('Por favor, preencha a descrição do documento.');
                return;
            }

            // Enviar para a API
            const response = await fetch('http://localhost:3000/api/documentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                let errorMessage = 'Erro ao criar documento';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const novoDocumento = await response.json();
            
            // Sucesso - redireciona para visualização do processo
            alert('Documento criado com sucesso!');
            window.location.href = `processo-view.html?id=${processoId}`;
            
        } catch (error) {
            console.error('Erro ao criar documento:', error);
            alert('Erro ao criar documento: ' + error.message);
        }
    });

    // Função para gerar conteúdo do documento baseado no tipo
    function gerarConteudoDocumento() {
        const tipoDocumento = formTitle.textContent.replace('Novo ', '');
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        
        switch (tipoDocumento) {
            case 'Memorando':
                return `MEMORANDO Nº 001/2024

De: Secretaria de Tecnologia da Informação
Para: [Destinatário]
Assunto: [Assunto do memorando]

Prezado(a) Senhor(a),

[Conteúdo do memorando]

Atenciosamente,

[Assinatura]
Data: ${dataAtual}`;

            case 'Ofício':
                return `OFÍCIO Nº 001/2024

De: Secretaria de Tecnologia da Informação
Para: [Destinatário]
Assunto: [Assunto do ofício]

Prezado(a) Senhor(a),

[Conteúdo do ofício]

Atenciosamente,

[Assinatura]
Data: ${dataAtual}`;

            case 'Documento Externo':
                return `DOCUMENTO EXTERNO

Título: [Título do documento]
Origem: [Origem do documento]
Data: ${dataAtual}

[Conteúdo do documento externo]`;

            default:
                return `DOCUMENTO

Título: ${document.getElementById('descricao').value || 'Documento sem título'}
Data: ${dataAtual}

[Conteúdo do documento]`;
        }
    }
});