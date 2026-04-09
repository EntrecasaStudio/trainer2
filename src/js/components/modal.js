let activeModal = null;
let _onCloseCallback = null;

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

export function openModal(title, contentHTML, options = {}) {
  closeModal(true); // suppress onClose when replacing modal

  _onCloseCallback = options.onClose || null;

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

  overlay.querySelector('.modal-close').addEventListener('click', () => closeModal());
  overlay.removeEventListener('click', handleOverlayClick);
  overlay.addEventListener('click', handleOverlayClick);

  activeModal = overlay;

  if (options.onMount) {
    options.onMount(overlay.querySelector('.modal-body'));
  }
}

export function closeModal(_suppress) {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
  }
  activeModal = null;
  const cb = _onCloseCallback;
  _onCloseCallback = null;
  if (!_suppress && cb) cb();
}
