document.addEventListener('DOMContentLoaded', function() {
    let limit = 10;
    let offset = 0;
    let total = 0;

    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const infoSpan = document.getElementById('pagination-info');

    carregarContatos();

    async function carregarContatos() {
        try {
            const response = await fetch(`http://localhost:3000/api/contatos?limit=${limit}&offset=${offset}`);

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

            const resultado = await response.json();
            total = resultado.total;
            limit = resultado.limit;
            offset = resultado.offset;

            exibirContatos(resultado.data);
            atualizarControlesPaginacao();
        } catch (error) {
            console.error('Erro ao carregar contatos:', error);
            exibirErro('Erro ao carregar contatos');
        }
    }

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

    function exibirErro(mensagem) {
        const tabelaBody = document.getElementById('tabela-contatos-body');
        if (tabelaBody) {
            tabelaBody.innerHTML = `<tr><td colspan="7" class="text-center">${mensagem}</td></tr>`;
        }
    }

    function atualizarControlesPaginacao() {
        if (infoSpan) {
            const inicio = total === 0 ? 0 : offset + 1;
            const fim = Math.min(offset + limit, total);
            infoSpan.textContent = `${inicio}-${fim} de ${total}`;
        }
        if (prevBtn) prevBtn.disabled = offset === 0;
        if (nextBtn) nextBtn.disabled = offset + limit >= total;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            offset = Math.max(offset - limit, 0);
            carregarContatos();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (offset + limit < total) {
                offset += limit;
                carregarContatos();
            }
        });
    }

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
                carregarContatos();
            } catch (error) {
                console.error('Erro ao excluir contato:', error);
                alert('Erro ao excluir contato: ' + error.message);
            }
        }
    };
});

