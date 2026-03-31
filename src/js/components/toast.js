export function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

export function showToastAction(message, actionLabel, onAction, duration = 6000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast toast-action';
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-undo">${actionLabel}</button>
  `;
  container.appendChild(toast);

  const btn = toast.querySelector('.toast-undo');
  btn.addEventListener('click', () => {
    onAction();
    toast.remove();
  });

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
