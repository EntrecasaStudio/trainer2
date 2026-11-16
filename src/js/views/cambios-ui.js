// Vista del registro de cambios de rutina.
//
// Línea de tiempo agrupada por día. Agrupar importa: una tanda de 19 cambios
// del mismo día es un bloque que se evalúa junto, no 19 entradas sueltas.
//
// El filtro por ejercicio es el que contesta la pregunta que motivó todo esto:
// "me empezó a molestar el hombro hace tres meses, ¿qué cambié en esa época?".

import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { store } from '../../store.js';
import { porDia, textoCambio, ponerMotivo } from '../../cambios.js';
import { formatDateLong } from '../../utils/format.js';

let F = { usuario: null, ejercicio: '' };

function pintar() {
  const body = document.querySelector('#modal-overlay .modal-body');
  if (!body) return;

  const usuarios = [...new Set(store.getAll(store.KEYS.cambios).map(c => c.usuario).filter(Boolean))];
  const dias = porDia({ usuario: F.usuario, ejercicio: F.ejercicio || null });
  const total = dias.reduce((n, d) => n + d.cambios.length, 0);

  body.innerHTML = `
    ${usuarios.length > 1 ? `<div class="plan-usuarios" style="margin-bottom:var(--space-sm);">
      <button class="plan-usuario ${!F.usuario ? 'activo' : ''}" data-u="">Todos</button>
      ${usuarios.map(u => `<button class="plan-usuario ${F.usuario === u ? 'activo' : ''}" data-u="${u}">${u}</button>`).join('')}
    </div>` : ''}

    <input type="text" class="search-input" id="cambios-buscar" placeholder="Filtrar por ejercicio…"
           value="${(F.ejercicio || '').replace(/"/g, '&quot;')}" autocomplete="off"
           style="width:100%;box-sizing:border-box;margin-bottom:var(--space-sm);">

    ${!total ? `<p class="wiz-ayuda">${F.ejercicio
        ? 'Ningún cambio registrado con ese ejercicio.'
        : 'Todavía no hay cambios registrados. Se anotan solos cuando cambiás un ejercicio de una rutina y la guardás.'}</p>`
    : `<div class="cambios-total">${total} cambio${total > 1 ? 's' : ''} en ${dias.length} día${dias.length > 1 ? 's' : ''}</div>
       <div class="cambios-timeline">
        ${dias.map(d => `
          <div class="cambios-dia">
            <div class="cambios-fecha">${formatDateLong(d.fecha)} <span>${d.cambios.length}</span></div>
            ${d.cambios.map(c => `
              <div class="cambios-item" data-id="${c.id}">
                <div class="cambios-linea">
                  <span class="cambios-rutina">${(c.rutina || '').replace(/ — .*/, '')}</span>
                  <span class="cambios-circ">${c.circuito || ''}</span>
                </div>
                <div class="cambios-txt ${c.tipo}">${textoCambio(c)}</div>
                ${c.motivo
                  ? `<div class="cambios-motivo">“${c.motivo}”</div>`
                  : `<button class="plan-link cambios-agregar" data-motivo="${c.id}">¿por qué?</button>`}
              </div>`).join('')}
          </div>`).join('')}
       </div>`}`;

  body.querySelectorAll('[data-u]').forEach(b => b.addEventListener('click', () => {
    F.usuario = b.dataset.u || null; pintar();
  }));
  const buscar = body.querySelector('#cambios-buscar');
  if (buscar) {
    let t;
    buscar.addEventListener('input', e => {
      clearTimeout(t);
      const v = e.target.value;
      t = setTimeout(() => { F.ejercicio = v; pintar(); body.querySelector('#cambios-buscar')?.focus(); }, 350);
    });
  }
  body.querySelectorAll('[data-motivo]').forEach(b => b.addEventListener('click', () => {
    // El motivo se agrega DESPUÉS, que es cuando uno se entera de que importaba.
    const motivo = prompt('¿Por qué lo cambiaste? (molestaba, aburría, no tenía el equipo…)');
    if (motivo && motivo.trim()) {
      ponerMotivo(b.dataset.motivo, motivo.trim());
      showToast('Motivo guardado');
      pintar();
    }
  }));
}

export function openCambiosSheet() {
  F = { usuario: null, ejercicio: '' };
  openModal('Cambios en las rutinas', '<div></div>', { onMount: pintar });
}
