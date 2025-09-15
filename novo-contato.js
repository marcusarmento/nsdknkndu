document.addEventListener('DOMContentLoaded', function() {
    
    // Seleciona os elementos
    const radioPf = document.getElementById('natureza-pf');
    const radioPj = document.getElementById('natureza-pj');
    const camposPf = document.getElementById('campos-pf');

    // Função para mostrar/esconder os campos de Pessoa Física
    function toggleCamposPf() {
        if (radioPf.checked) {
            camposPf.classList.remove('hidden');
        } else {
            camposPf.classList.add('hidden');
        }
    }

    // Adiciona o evento de clique nos botões de rádio
    radioPf.addEventListener('change', toggleCamposPf);
    radioPj.addEventListener('change', toggleCamposPf);

    // Garante o estado inicial correto ao carregar a página
    toggleCamposPf();

    // Verificar se é edição (ID na URL)
    const urlParams = new URLSearchParams(window.location.search);
    const contatoId = urlParams.get('id');
    
    if (contatoId) {
        carregarContatoParaEdicao(contatoId);
    }

    // Lógica de envio do formulário
    const form = document.getElementById('form-novo-contato');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        try {
            const formData = coletarDadosFormulario();
            
            // Validação básica
            if (!formData.nome) {
                alert('Por favor, preencha o nome/razão social.');
                return;
            }

            const url = contatoId ? 
                `http://localhost:3000/api/contatos/${contatoId}` : 
                'http://localhost:3000/api/contatos';
            
            const method = contatoId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                let errorMessage = 'Erro ao salvar contato';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const contatoSalvo = await response.json();
            
            alert(contatoId ? 'Contato atualizado com sucesso!' : 'Contato criado com sucesso!');
            window.location.href = 'contatos.html';
            
        } catch (error) {
            console.error('Erro ao salvar contato:', error);
            alert('Erro ao salvar contato: ' + error.message);
        }
    });

    // Função para carregar contato para edição
    async function carregarContatoParaEdicao(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/contatos/${id}`);
            
            if (!response.ok) {
                throw new Error('Erro ao carregar contato');
            }
            
            const contato = await response.json();
            preencherFormulario(contato);
            
        } catch (error) {
            console.error('Erro ao carregar contato:', error);
            alert('Erro ao carregar contato: ' + error.message);
        }
    }

    // Função para preencher formulário com dados do contato
    function preencherFormulario(contato) {
        document.getElementById('natureza-pf').checked = contato.natureza_contato === 'pf';
        document.getElementById('natureza-pj').checked = contato.natureza_contato === 'pj';
        document.getElementById('contato-nome').value = contato.nome || '';
        document.getElementById('contato-sigla').value = contato.sigla || '';
        document.getElementById('contato-cpf').value = contato.cpf || '';
        document.getElementById('contato-rg').value = contato.rg || '';
        document.getElementById('contato-nascimento').value = contato.data_nascimento || '';
        document.getElementById('contato-email').value = contato.email || '';
        document.getElementById('contato-tel-fixo').value = contato.telefone_fixo || '';
        document.getElementById('contato-tel-cel').value = contato.telefone_celular || '';
        document.getElementById('contato-cep').value = contato.cep || '';
        document.getElementById('contato-endereco').value = contato.endereco || '';
        document.getElementById('contato-bairro').value = contato.bairro || '';
        document.getElementById('contato-cidade').value = contato.cidade || '';
        document.getElementById('contato-uf').value = contato.uf || '';

        // Atualiza a exibição dos campos PF
        toggleCamposPf();
    }

    // Função para coletar dados do formulário
    function coletarDadosFormulario() {
        return {
            natureza_contato: document.querySelector('input[name="natureza_contato"]:checked').value,
            nome: document.getElementById('contato-nome').value,
            sigla: document.getElementById('contato-sigla').value,
            cpf: document.getElementById('contato-cpf').value,
            rg: document.getElementById('contato-rg').value,
            data_nascimento: document.getElementById('contato-nascimento').value,
            email: document.getElementById('contato-email').value,
            telefone_fixo: document.getElementById('contato-tel-fixo').value,
            telefone_celular: document.getElementById('contato-tel-cel').value,
            cep: document.getElementById('contato-cep').value,
            endereco: document.getElementById('contato-endereco').value,
            bairro: document.getElementById('contato-bairro').value,
            cidade: document.getElementById('contato-cidade').value,
            uf: document.getElementById('contato-uf').value
        };
    }

});