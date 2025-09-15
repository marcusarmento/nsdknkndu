document.addEventListener('DOMContentLoaded', function() {
    const radioSimples = document.getElementById('tipo-somente-sobrestar');
    const radioVinculado = document.getElementById('tipo-sobrestar-vinculado');
    const campoProcessoVinculado = document.getElementById('campo-processo-vinculado');

    radioSimples.addEventListener('change', () => {
        campoProcessoVinculado.classList.add('hidden');
    });
    radioVinculado.addEventListener('change', () => {
        campoProcessoVinculado.classList.remove('hidden');
    });
});