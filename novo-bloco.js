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

            tag.querySelector('.remove-tag').addEventListener('click', function() {
                tag.remove();
            });
        }
    }

    if(addUnidadeBtn) {
        addUnidadeBtn.addEventListener('click', adicionarUnidade);
    }
    
    if(unidadesInput) {
        unidadesInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                adicionarUnidade();
            }
        });
    }
});