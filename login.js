// Aguarda o carregamento completo do documento HTML
document.addEventListener('DOMContentLoaded', function() {

    // Seleciona o ícone do olho e o campo de senha
    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#senha');

    // Adiciona um evento de "clique" ao ícone
    togglePassword.addEventListener('click', function() {
        // Verifica o tipo do campo de senha (password ou text)
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Altera o ícone do olho (aberto/fechado)
        this.classList.toggle('fa-eye-slash');
    });
});