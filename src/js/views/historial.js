import { store } from '../../store.js';
import { formatDateLong, formatDuration, getLugarBadge, formatSetsReps, getCircuitColor } from '../../utils/format.js';
import { openModal, closeModal } from '../components/modal.js';
import { showToast, showToastAction } from '../components/toast.js';

let _container = null;
let _currentUser = '';

export function mountHistorial(container) {
  _container = container;
  _currentUser = store.getActiveUser();

  container.innerHTML = `
    <div class="rutinas-header">
      <h1 style="font-size:var(--text-xl);font-weight:var(--fw-bold);">Historial</h1>
      <div class="user-toggle" style="margin:0;">
        <button class="user-toggle-btn ${_currentUser === 'Lean' ? 'active' : ''}" data-usuario="Lean">Lean</button>
        <button class="user-toggle-btn ${_currentUser === 'Nat' ? 'active' : ''}" data-usuario="Nat">Nat</button>
      </div>
    </div>
    <div id="historial-list"></div>
  `;

  container.querySelectorAll('.user-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _currentUser = btn.dataset.usuario;
      store.setActiveUser(_currentUser);
      container.querySelectorAll('.user-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderList();
    });
  });

  renderList();
}

function renderList() {
  const listEl = document.getElementById('historial-list');
  if (!listEl) return;

  const sesiones = store.getAll(store.KEYS.sesiones)
    .filter(s => s.usuario === _currentUser)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  if (sesiones.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><i class="ph-light ph-chart-bar" style="font-size:48px;"></i></div>
        <div class="empty-state-text">Sin sesiones registradas</div>
      </div>
    `;
    return;
  }

  listEl.innerHTML = sesiones.map(s => {
    const totalSeries = (s.circuitos || []).reduce((sum, c) =>
      sum + (c.ejercicios || []).reduce((s2, e) =>
        s2 + (e.seriesData || []).filter(sr => sr.done).length, 0), 0);

    return `
      <div class="historial-item" data-id="${s.id}" style="cursor:pointer;">
        <div class="historial-date">${formatDateLong(new Date(s.fecha))}</div>
        <div class="historial-name">${s.rutinaNombre || 'Sesión'}</div>
        <div class="historial-stats">
          <span><i class="ph-light ph-timer" style="font-size:14px;"></i> ${formatDuration(s.duracion || 0)}</span>
          <span><i class="ph-light ph-barbell" style="font-size:14px;"></i> ${totalSeries} series</span>
          ${s.calorias ? `<span><i class="ph-light ph-fire" style="font-size:14px;"></i> ${s.calorias} kcal</span>` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Bind click to open detail/edit
  listEl.querySelectorAll('.historial-item').forEach(item => {
    item.addEventListener('click', () => {
      const sesion = sesiones.find(s => s.id === item.dataset.id);
      if (sesion) openSesionDetail(sesion);
    });
  });
}

function openSesionDetail(sesion) {
  const totalSeries = (sesion.circuitos || []).reduce((sum, c) =>
    sum + (c.ejercicios || []).reduce((s2, e) =>
      s2 + (e.seriesData || []).filter(sr => sr.done).length, 0), 0);
  const minutes = Math.floor((sesion.duracion || 0) / 60);

  // Build circuits detail
  const circuitsHTML = (sesion.circuitos || []).map(c => {
    const color = getCircuitColor(c.nombre || '');
    return `
      <div class="hist-circuit">
        <div style="font-size:var(--text-sm);font-weight:var(--fw-semibold);color:${color};margin-bottom:var(--space-xs);">
          ${c.nombre || 'Circuito'}
        </div>
        ${(c.ejercicios || []).map(e => {
          const doneSeries = (e.seriesData || []).filter(s => s.done);
          const maxPeso = doneSeries.length > 0 ? Math.max(...doneSeries.map(s => s.peso || 0)) : 0;
          return `
            <div class="hist-ej-row" data-ej-nombre="${e.nombre}" data-circuit-nombre="${c.nombre || ''}">
              <div style="flex:1;min-width:0;">
                <div style="font-size:var(--text-sm);">${e.nombre}</div>
                <div style="font-size:var(--text-xs);color:var(--color-text-muted);">
                  ${doneSeries.length}/${(e.seriesData || []).length} series${maxPeso > 0 ? ` · ${maxPeso}kg` : ''}
                </div>
              </div>
              <i class="ph ph-caret-right" style="font-size:14px;color:var(--color-text-muted);"></i>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }).join('');

  const contentHTML = `
    <div style="display:flex;flex-direction:column;gap:var(--space-md);">
      <div style="display:flex;gap:var(--space-md);flex-wrap:wrap;">
        <div class="edit-field" style="flex:1;min-width:120px;">
          <label class="edit-label">Fecha</label>
          <input type="date" class="edit-input" id="hist-fecha" value="${sesion.fecha}">
        </div>
        <div class="edit-field" style="width:100px;">
          <label class="edit-label">Duración (min)</label>
          <input type="number" class="edit-input" id="hist-duracion" value="${minutes}" inputmode="numeric" style="text-align:center;">
        </div>
        <div class="edit-field" style="width:100px;">
          <label class="edit-label">Calorías</label>
          <input type="number" class="edit-input" id="hist-calorias" value="${sesion.calorias || ''}" placeholder="kcal" inputmode="numeric" style="text-align:center;">
        </div>
      </div>
      <div style="border-top:1px solid var(--color-border);padding-top:var(--space-md);">
        ${circuitsHTML}
      </div>
      <div style="display:flex;gap:var(--space-sm);">
        <button class="btn btn-primary btn-lg" id="hist-save" style="flex:1;">Guardar</button>
        <button class="btn btn-lg" id="hist-delete" style="color:var(--color-danger);">
          <i class="ph ph-trash" style="font-size:18px;"></i>
        </button>
      </div>
    </div>
  `;

  openModal(sesion.rutinaNombre || 'Sesión', contentHTML, {
    onMount(body) {
      // Save
      body.querySelector('#hist-save').addEventListener('click', () => {
        const sesiones = store.getAll(store.KEYS.sesiones);
        const idx = sesiones.findIndex(s => s.id === sesion.id);
        if (idx === -1) return;

        const newFecha = body.querySelector('#hist-fecha').value;
        const newMin = parseInt(body.querySelector('#hist-duracion').value, 10) || 0;
        const newKcal = parseInt(body.querySelector('#hist-calorias').value, 10) || 0;

        sesiones[idx].fecha = newFecha;
        sesiones[idx].duracion = newMin * 60;
        if (newKcal > 0) sesiones[idx].calorias = newKcal;
        else delete sesiones[idx].calorias;

        store.set(store.KEYS.sesiones, sesiones);
        closeModal();
        renderList();
        showToast('Sesión actualizada');
      });

      // Delete
      body.querySelector('#hist-delete').addEventListener('click', () => {
        const sesiones = store.getAll(store.KEYS.sesiones);
        const removed = sesiones.find(s => s.id === sesion.id);
        store.set(store.KEYS.sesiones, sesiones.filter(s => s.id !== sesion.id));
        closeModal();
        renderList();
        showToastAction('Sesión eliminada', 'Deshacer', () => {
          const current = store.getAll(store.KEYS.sesiones);
          current.push(removed);
          store.set(store.KEYS.sesiones, current);
          renderList();
        });
      });

      // Exercise row click — open series editor
      body.querySelectorAll('.hist-ej-row').forEach(row => {
        row.addEventListener('click', () => {
          const ejNombre = row.dataset.ejNombre;
          const circuitNombre = row.dataset.circuitNombre;
          openSeriesEditor(sesion, circuitNombre, ejNombre);
        });
      });
    }
  });
}

function openSeriesEditor(sesion, circuitNombre, ejNombre) {
  // Find the exercise in the session
  const circuit = (sesion.circuitos || []).find(c => (c.nombre || '') === circuitNombre);
  if (!circuit) return;
  const ej = (circuit.ejercicios || []).find(e => e.nombre === ejNombre);
  if (!ej) return;

  const seriesData = ej.seriesData || [];

  const seriesHTML = seriesData.map((s, i) => `
    <div class="hist-series-row" style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-sm);">
      <span style="font-size:var(--text-sm);color:var(--color-text-muted);min-width:24px;">S${i + 1}</span>
      <input type="number" class="edit-input hist-peso" data-idx="${i}" value="${s.peso || ''}" placeholder="kg" inputmode="decimal"
        style="width:70px;text-align:center;">
      <span style="font-size:var(--text-xs);color:var(--color-text-muted);">kg</span>
      <input type="number" class="edit-input hist-reps" data-idx="${i}" value="${s.reps || ''}" placeholder="reps" inputmode="numeric"
        style="width:60px;text-align:center;">
      <span style="font-size:var(--text-xs);color:var(--color-text-muted);">reps</span>
      <label style="display:flex;align-items:center;gap:4px;cursor:pointer;">
        <input type="checkbox" class="hist-done" data-idx="${i}" ${s.done ? 'checked' : ''}>
        <i class="ph ${s.done ? 'ph-check-circle' : 'ph-circle'}" style="font-size:20px;color:${s.done ? 'var(--color-accent)' : 'var(--color-text-muted)'};"></i>
      </label>
    </div>
  `).join('');

  const contentHTML = `
    <div>
      <div style="margin-bottom:var(--space-md);">
        ${seriesHTML}
      </div>
      <button class="btn btn-primary btn-lg" id="series-save" style="width:100%;">Guardar series</button>
    </div>
  `;

  openModal(ejNombre, contentHTML, {
    onMount(body) {
      // Toggle check icon on checkbox change
      body.querySelectorAll('.hist-done').forEach(cb => {
        cb.addEventListener('change', () => {
          const icon = cb.parentElement.querySelector('i');
          icon.className = cb.checked ? 'ph ph-check-circle' : 'ph ph-circle';
          icon.style.color = cb.checked ? 'var(--color-accent)' : 'var(--color-text-muted)';
        });
      });

      body.querySelector('#series-save').addEventListener('click', () => {
        // Gather updated values
        body.querySelectorAll('.hist-series-row').forEach(row => {
          const idx = parseInt(row.querySelector('.hist-peso').dataset.idx, 10);
          const peso = parseFloat(row.querySelector('.hist-peso').value) || 0;
          const reps = parseInt(row.querySelector('.hist-reps').value, 10) || 0;
          const done = row.querySelector('.hist-done').checked;
          seriesData[idx] = { ...seriesData[idx], peso, reps, done };
        });

        // Save back to store
        const sesiones = store.getAll(store.KEYS.sesiones);
        const idx = sesiones.findIndex(s => s.id === sesion.id);
        if (idx !== -1) {
          const c = (sesiones[idx].circuitos || []).find(c => (c.nombre || '') === circuitNombre);
          if (c) {
            const e = (c.ejercicios || []).find(e => e.nombre === ejNombre);
            if (e) e.seriesData = seriesData;
          }
          store.set(store.KEYS.sesiones, sesiones);
        }

        closeModal();
        // Reopen the session detail to reflect changes
        const updatedSesiones = store.getAll(store.KEYS.sesiones);
        const updated = updatedSesiones.find(s => s.id === sesion.id);
        if (updated) openSesionDetail(updated);
        else renderList();
      });
    }
  });
}
