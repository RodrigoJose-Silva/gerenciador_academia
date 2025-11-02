/**
 * Script específico para a página de login
 * Gerencia interações e validações do formulário de login
 */

document.addEventListener('DOMContentLoaded', () => {
    // Fecha a notificação de erro quando clicar no botão de fechar
    const notification = document.querySelector('.notification');
    const deleteButton = notification?.querySelector('.delete');

    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            notification.remove();
        });
    }

    // Remove a classe is-danger dos inputs quando o usuário começar a digitar
    const inputs = document.querySelectorAll('.input.is-danger');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('is-danger');
        });
    });
});