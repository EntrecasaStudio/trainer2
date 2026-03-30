let activeModal = null;

export function openModal(title, contentHTML, options = {}) {
  closeModal();

  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  overlay.innerHTML = `
    <div class="modal-sheet" role="dialog" aria-label="${title}">
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button class="modal-close" aria-label="Cerrar">&times;</button>
      </div>
      <div class="modal-body">${contentHTML}</div>
    </div>
  `;

  const close = overlay.querySelector('.modal-close');
  close.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  activeModal = overlay;

  if (options.onMount) {
    options.onMount(overlay.querySelector('.modal-body'));
  }
}

export function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
  }
  activeModal = null;
}
