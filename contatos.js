document.addEventListener('DOMContentLoaded', function() {
    
    // Carregar contatos ao inicializar a página
    carregarContatos();

    // Função para carregar contatos da API
    async function carregarContatos() {
        try {
            const response = await fetch('http://localhost:3000/api/contatos');
            
            if (!response.ok) {
                let errorMessage = 'Erro ao carregar contatos';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }
            
            const contatos = await response.json();
            exibirContatos(contatos);
            
        } catch (error) {
            console.error('Erro ao carregar contatos:', error);
            exibirErro('Erro ao carregar contatos');
        }
    }

    // Função para exibir contatos na tabela
    function exibirContatos(contatos) {
        const tabelaBody = document.getElementById('tabela-contatos-body');
        if (!tabelaBody) return;

        tabelaBody.innerHTML = '';

        contatos.forEach(contato => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td><input type="checkbox"></td>
                <td>${contato.nome}</td>
                <td>${contato.natureza_contato === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}</td>
                <td>${contato.cpf || contato.sigla || 'N/A'}</td>
                <td>${contato.email || 'N/A'}</td>
                <td>${contato.telefone_celular || contato.telefone_fixo || 'N/A'}</td>
                <td class="actions-cell">
                    <button class="action-btn" onclick="editarContato(${contato.id})" title="Editar"><i class="fa-solid fa-edit"></i></button>
                    <button class="action-btn" onclick="excluirContato(${contato.id})" title="Excluir"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tabelaBody.appendChild(linha);
        });
    }

    // Função para exibir erro
    function exibirErro(mensagem) {
        const tabelaBody = document.getElementById('tabela-contatos-body');
        if (tabelaBody) {
            tabelaBody.innerHTML = `<tr><td colspan="7" class="text-center">${mensagem}</td></tr>`;
        }
    }

    // Função para filtrar contatos
    const filtroInput = document.getElementById('filtro-contatos');
    if (filtroInput) {
        filtroInput.addEventListener('input', function() {
            const termo = this.value.toLowerCase();
            const linhas = document.querySelectorAll('#tabela-contatos-body tr');
            
            linhas.forEach(linha => {
                const texto = linha.textContent.toLowerCase();
                linha.style.display = texto.includes(termo) ? '' : 'none';
            });
        });
    }

    // Funções globais para ações
    window.editarContato = function(id) {
        window.location.href = `novo-contato.html?id=${id}`;
    };

    window.excluirContato = async function(id) {
        if (confirm('Tem certeza que deseja excluir este contato?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/contatos/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Erro ao excluir contato');
                }

                alert('Contato excluído com sucesso!');
                carregarContatos(); // Recarrega a lista
                
            } catch (error) {
                console.error('Erro ao excluir contato:', error);
                alert('Erro ao excluir contato: ' + error.message);
            }
        }
    };

});