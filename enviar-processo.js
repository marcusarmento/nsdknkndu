document.addEventListener('DOMContentLoaded', function() {
    
    const unidadesInput = document.getElementById('unidades-input');
    const addUnidadeBtn = document.getElementById('btn-add-unidade');
    const unidadesList = document.getElementById('unidades-list');

    function adicionarUnidade() {
        const nomeUnidade = unidadesInput.value.trim().toUpperCase();
        if (nomeUnidade) {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = `${nomeUnidade} <button type="button" class="remove-tag" title="Remover">&times;</button>`;
            
            unidadesList.appendChild(tag);
            unidadesInput.value = "";

            // Adiciona evento para remover a tag ao clicar no botão 'x'
            tag.querySelector('.remove-tag').addEventListener('click', function() {
                tag.remove();
            });
        }
    }

    addUnidadeBtn.addEventListener('click', adicionarUnidade);

    // Opcional: Adiciona a unidade ao pressionar Enter
    unidadesInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Impede o envio do formulário
            adicionarUnidade();
        }
    });

});