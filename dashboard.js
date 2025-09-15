document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA PARA O DROPDOWN DE USUÁRIO (continua a mesma) ---
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenuDropdown = document.getElementById('user-menu-dropdown');

    if (userMenuButton) {
        userMenuButton.addEventListener('click', function(event) {
            event.stopPropagation();
            userMenuDropdown.classList.toggle('hidden');
        });
    }
    window.addEventListener('click', function() {
        if (userMenuDropdown && !userMenuDropdown.classList.contains('hidden')) {
            userMenuDropdown.classList.add('hidden');
        }
    });


    // --- NOVA LÓGICA GENÉRICA PARA ABRIR E FECHAR MODAIS ---
    
    // Para abrir qualquer modal
    const openModalButtons = document.querySelectorAll('.js-open-modal');
    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modalId;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('hidden');
            }
        });
    });

    // Para fechar qualquer modal
    const closeModalButtons = document.querySelectorAll('.js-close-modal, .close-button');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modalId;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });

// Função para buscar os processos no back-end
    async function carregarProcessos() {
        try {
            // 1. Faz a chamada para a nossa API
            const response = await fetch('http://localhost:3000/api/processos');
            
            if (!response.ok) {
                let errorMessage = 'Erro ao carregar processos';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }
            
            const processos = await response.json(); // Converte a resposta para JSON

            // 2. Seleciona os corpos das tabelas no HTML
            const tabelaRecebidos = document.getElementById('tabela-recebidos');
            const tabelaGerados = document.getElementById('tabela-gerados');
            
            // Limpa qualquer conteúdo que já exista nas tabelas
            tabelaRecebidos.innerHTML = '';
            tabelaGerados.innerHTML = '';

            // 3. Itera sobre cada processo recebido da API
            processos.forEach(processo => {
                // Cria uma nova linha <tr> na tabela
                const linha = document.createElement('tr');

                // Monta o HTML para o conteúdo da linha
                linha.innerHTML = `
                    <td><input type="checkbox"></td>
                    <td><a href="processo-view.html?id=${processo.id}" title="Abrir Processo">${processo.numero_processo}</a></td>
                    <td>(${processo.interessado || 'N/A'})</td>
                    <td class="actions-cell">
                        <a href="enviar-processo.html?id=${processo.id}" class="action-btn" title="Enviar Processo"><i class="fa-solid fa-paper-plane"></i></a>
                        <a href="atribuir-processo.html?id=${processo.id}" class="action-btn" title="Atribuir"><i class="fa-solid fa-user-tag"></i></a>
                    </td>
                `;

                // 4. Adiciona a nova linha na tabela correta (Recebidos ou Gerados)
                if (processo.tipo === 'recebido') {
                    tabelaRecebidos.appendChild(linha);
                } else if (processo.tipo === 'gerado') {
                    tabelaGerados.appendChild(linha);
                }
            });

        } catch (error) {
            console.error('Falha ao buscar processos:', error);
            // Mostrar mensagem de erro para o usuário
            const tabelaRecebidos = document.getElementById('tabela-recebidos');
            const tabelaGerados = document.getElementById('tabela-gerados');
            
            if (tabelaRecebidos) {
                tabelaRecebidos.innerHTML = '<tr><td colspan="4" class="text-center">Erro ao carregar processos</td></tr>';
            }
            if (tabelaGerados) {
                tabelaGerados.innerHTML = '<tr><td colspan="4" class="text-center">Erro ao carregar processos</td></tr>';
            }
            // Opcional: Mostrar uma mensagem de erro na tela para o usuário
        }
    }

    // Chama a função para carregar os processos assim que a página for carregada
    carregarProcessos();


});