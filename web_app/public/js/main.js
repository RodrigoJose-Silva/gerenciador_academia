/**
 * Arquivo JavaScript principal para a aplicação web
 * Contém funções utilitárias e inicializações
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa os componentes interativos
  initializeComponents();
  
  // Adiciona listeners para formulários
  setupFormValidation();
});

/**
 * Inicializa componentes interativos da interface
 */
function initializeComponents() {
  // Inicializa os modais
  const modals = document.querySelectorAll('.modal');
  if (modals.length > 0) {
    modals.forEach(modal => {
      const modalTriggers = document.querySelectorAll(`[data-target="${modal.id}"]`);
      const modalCloses = modal.querySelectorAll('.modal-close, .modal-background, .modal-card-head .delete, .cancel-button');
      
      modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
          modal.classList.add('is-active');
        });
      });
      
      modalCloses.forEach(close => {
        close.addEventListener('click', () => {
          modal.classList.remove('is-active');
        });
      });
    });
  }
  
  // Inicializa as notificações
  const notifications = document.querySelectorAll('.notification .delete');
  if (notifications.length > 0) {
    notifications.forEach(notification => {
      notification.addEventListener('click', () => {
        notification.parentNode.remove();
      });
    });
  }
  
  // Inicializa os dropdowns
  const dropdowns = document.querySelectorAll('.dropdown');
  if (dropdowns.length > 0) {
    dropdowns.forEach(dropdown => {
      dropdown.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdown.classList.toggle('is-active');
      });
    });
    
    document.addEventListener('click', () => {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('is-active');
      });
    });
  }
}

/**
 * Configura validação de formulários
 */
function setupFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (event) => {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('is-danger');
          
          // Adiciona mensagem de erro se não existir
          const fieldContainer = field.closest('.field');
          if (fieldContainer && !fieldContainer.querySelector('.help.is-danger')) {
            const helpText = document.createElement('p');
            helpText.className = 'help is-danger';
            helpText.textContent = 'Este campo é obrigatório';
            fieldContainer.appendChild(helpText);
          }
        } else {
          field.classList.remove('is-danger');
          
          // Remove mensagem de erro se existir
          const fieldContainer = field.closest('.field');
          const errorMessage = fieldContainer ? fieldContainer.querySelector('.help.is-danger') : null;
          if (errorMessage) {
            errorMessage.remove();
          }
        }
      });
      
      if (!isValid) {
        event.preventDefault();
      }
    });
    
    // Remove classes de erro ao digitar
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          input.classList.remove('is-danger');
          
          // Remove mensagem de erro se existir
          const fieldContainer = input.closest('.field');
          const errorMessage = fieldContainer ? fieldContainer.querySelector('.help.is-danger') : null;
          if (errorMessage) {
            errorMessage.remove();
          }
        }
      });
    });
  });
}

/**
 * Exibe uma mensagem de erro
 * @param {string} message - Mensagem de erro a ser exibida
 */
function showError(message) {
  const container = document.querySelector('.container');
  
  const notification = document.createElement('div');
  notification.className = 'notification is-danger';
  
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete';
  deleteButton.addEventListener('click', () => {
    notification.remove();
  });
  
  notification.appendChild(deleteButton);
  notification.appendChild(document.createTextNode(message));
  
  container.insertBefore(notification, container.firstChild);
}

/**
 * Exibe uma mensagem de sucesso
 * @param {string} message - Mensagem de sucesso a ser exibida
 */
function showSuccess(message) {
  const container = document.querySelector('.container');
  
  const notification = document.createElement('div');
  notification.className = 'notification is-success';
  
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete';
  deleteButton.addEventListener('click', () => {
    notification.remove();
  });
  
  notification.appendChild(deleteButton);
  notification.appendChild(document.createTextNode(message));
  
  container.insertBefore(notification, container.firstChild);
}