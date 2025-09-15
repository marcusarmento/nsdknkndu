document.addEventListener('DOMContentLoaded', function() {

    // --- Lógica do Protocolo ---
    const radioAutomatico = document.getElementById('protocolo-automatico');
    const radioInformado = document.getElementById('protocolo-informado');
    const protocoloCampos = document.getElementById('protocolo-informado-campos');

    radioAutomatico.addEventListener('change', () => {
        protocoloCampos.classList.add('hidden');
    });
    radioInformado.addEventListener('change', () => {
        protocoloCampos.classList.remove('hidden');
    });


    // --- Lógica do Nível de Acesso ---
    const radiosAcesso = document.querySelectorAll('input[name="nivel_acesso"]');
    const explanationPublico = document.getElementById('explanation-publico');
    const explanationRestrito = document.getElementById('explanation-restrito');
    const explanationSigiloso = document.getElementById('explanation-sigiloso');
    const sigilosoOptionsDiv = document.getElementById('sigiloso-options');

    function atualizarAcesso() {
        // Primeiro, esconde tudo
        explanationPublico.classList.add('hidden');
        explanationRestrito.classList.add('hidden');
        explanationSigiloso.classList.add('hidden');
        sigilosoOptionsDiv.classList.add('hidden');

        // Depois, mostra o correto com base no que está selecionado
        if (document.getElementById('acesso-publico').checked) {
            explanationPublico.classList.remove('hidden');
        } else if (document.getElementById('acesso-restrito').checked) {
            explanationRestrito.classList.remove('hidden');
        } else if (document.getElementById('acesso-sigiloso').checked) {
            explanationSigiloso.classList.remove('hidden');
            sigilosoOptionsDiv.classList.remove('hidden');
        }
    }

    radiosAcesso.forEach(radio => {
        radio.addEventListener('change', atualizarAcesso);
    });

    atualizarAcesso();

    // --- Lógica de Adicionar Interessados ---
    const interessadosInput = document.getElementById('interessados-input');
    const interessadosList = document.getElementById('interessados-list');
    
    // ATENÇÃO: Há dois botões "Adicionar" na tela. Precisamos ser específicos.
    // Este seletor pega o botão DENTRO do card de "Dados do Processo".
    const addButtonInteressados = document.querySelector('.card-dados-processo .interactive-input .add-button');

    if(addButtonInteressados) {
        addButtonInteressados.addEventListener('click', function() {
            const nome = interessadosInput.value.trim();
            if (nome) {
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.innerHTML = `${nome} <button type="button" title="Remover">&times;</button>`;
                interessadosList.appendChild(tag);
                interessadosInput.value = "";
                tag.querySelector('button').addEventListener('click', function() { tag.remove(); });
            }
        });
    }

    // --- Lógica de Envio do Formulário ---
    const form = document.querySelector('.process-form-container');
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        try {
            // Coleta os dados do formulário
            const formData = {
                numero_processo: gerarNumeroProcesso(),
                tipo_processo: document.getElementById('tipo-processo').value,
                especificacao: document.getElementById('especificacao').value,
                interessado: coletarInteressados(),
                observacoes: document.getElementById('observacoes').value,
                nivel_acesso: document.querySelector('input[name="nivel_acesso"]:checked').value,
                tipo: 'gerado', // Processos iniciados são sempre gerados
                protocolo_tipo: document.querySelector('input[name="protocolo_tipo"]:checked').value,
                protocolo_numero_manual: document.getElementById('protocolo-numero-manual').value || null,
                protocolo_data: document.getElementById('protocolo-data').value || null
            };

            // Validação básica
            if (!formData.tipo_processo) {
                alert('Por favor, selecione um tipo de processo.');
                return;
            }

            // Envia os dados para a API
            const response = await fetch('http://localhost:3000/api/processos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                let errorMessage = 'Erro ao criar processo';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    // Se não conseguir fazer parse do JSON, usar o status da resposta
                    errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const novoProcesso = await response.json();
            
            // Sucesso - redireciona para o dashboard
            alert('Processo criado com sucesso!');
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            console.error('Erro ao criar processo:', error);
            alert('Erro ao criar processo: ' + error.message);
        }
    });

    // Função para gerar número de processo automático
    function gerarNumeroProcesso() {
        const protocoloTipo = document.querySelector('input[name="protocolo_tipo"]:checked').value;
        
        if (protocoloTipo === 'informado') {
            return document.getElementById('protocolo-numero-manual').value;
        } else {
            // Gera número automático baseado na data atual
            const agora = new Date();
            const ano = agora.getFullYear();
            const mes = String(agora.getMonth() + 1).padStart(2, '0');
            const dia = String(agora.getDate()).padStart(2, '0');
            const timestamp = Date.now().toString().slice(-6);
            
            return `12500.${ano}${mes}${dia}/${timestamp}`;
        }
    }

    // Função para coletar interessados das tags
    function coletarInteressados() {
        const tags = document.querySelectorAll('#interessados-list .tag');
        const interessados = [];
        
        tags.forEach(tag => {
            const nome = tag.textContent.replace('×', '').trim();
            if (nome) {
                interessados.push(nome);
            }
        });
        
        return interessados.join(', ');
    }

}); // FIM DO CÓDIGO. NÃO HÁ NADA DEPOIS DESTA LINHA.