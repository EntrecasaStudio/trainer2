// Wizard para crear o editar un lugar de entrenamiento.
//
// Seis pasos: nombre y preset, una pantalla por categoría de equipamiento, y un
// resumen. No se guarda nada hasta el último paso, así que salirse en el medio
// no deja basura.
//
// El paso final hace algo que Fitbod, MacroFactor y GymBook no hacen: decir qué
// NO vas a poder entrenar con lo que marcaste, y con qué se arregla. Medido
// sobre el catálogo, un lugar sin nada para traccionar da 65 ejercicios pero
// uno solo de espalda. Dejar armar eso en silencio es dejar armar un lugar
// inservible.

import { openModal, closeModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { CATEGORIAS_EQUIPO, PRESETS_EQUIPO, EQUIPO_INDEX, EQUIPO_KEYS, estaDisponible } from '../../equipamiento.js';
import { EJERCICIOS_CATALOGO, GRUPOS_MUSCULARES } from '../../ejercicios-catalogo.js';
import { getLugares, getLugar, addLugar, updateLugar, deleteLugar, colorLibre, COLORES_LUGAR, ICONOS_LUGAR, abreviarNombre } from '../../lugares.js';

const MINIMO_POR_GRUPO = 3;   // menos que esto en un grupo es un lugar cojo

// ── Cobertura ──────────────────────────────────────────────────────────────

function disponiblesCon(equipo) {
  return EJERCICIOS_CATALOGO.filter(e => estaDisponible(e, equipo));
}

function porGrupo(equipo) {
  const cuenta = Object.fromEntries(GRUPOS_MUSCULARES.map(g => [g, 0]));
  for (const e of disponiblesCon(equipo)) if (e.grupo in cuenta) cuenta[e.grupo]++;
  return cuenta;
}

// Qué ítem suelto arreglaría mejor un grupo flojo. Se prueba agregando cada uno
// y se mide cuánto sube ese grupo: 28 × 227 comparaciones, nada.
function queLeFalta(grupo, equipo) {
  const actual = disponiblesCon(equipo).filter(e => e.grupo === grupo).length;
  let mejor = null;
  for (const k of EQUIPO_KEYS) {
    if (equipo.includes(k)) continue;
    const n = disponiblesCon([...equipo, k]).filter(e => e.grupo === grupo).length;
    if (n > actual && (!mejor || n > mejor.n)) mejor = { key: k, n };
  }
  return mejor;
}

// ── Estado del wizard ──────────────────────────────────────────────────────

let W = null;

function pasos() {
  return ['nombre', ...CATEGORIAS_EQUIPO.map(c => c.key), 'resumen'];
}

function tiene(k) { return W.equipo.has(k); }

function alternar(k) {
  if (W.equipo.has(k)) W.equipo.delete(k); else W.equipo.add(k);
}

// ── Render ─────────────────────────────────────────────────────────────────

function render() {
  const body = document.querySelector('#modal-overlay .modal-body');
  if (!body) return;
  const lista = pasos();
  const paso = lista[W.paso];

  const puntos = lista.map((_, i) =>
    `<span class="wiz-dot ${i === W.paso ? 'actual' : (i < W.paso ? 'hecho' : '')}"></span>`).join('');

  // Al llegar al resumen se precarga la etiqueta con la derivada del nombre: si
  // el campo quedara vacío mostrando sólo un placeholder, el preview diría una
  // cosa y el campo otra.
  if (paso === 'resumen' && !W.badge.trim()) W.badge = abreviarNombre(W.nombre, 6).toUpperCase();

  let contenido = '';
  if (paso === 'nombre') contenido = pantallaNombre();
  else if (paso === 'resumen') contenido = pantallaResumen();
  else contenido = pantallaCategoria(CATEGORIAS_EQUIPO.find(c => c.key === paso));

  const ultimo = W.paso === lista.length - 1;
  const puedeSeguir = paso !== 'nombre' || W.nombre.trim().length > 0;

  body.innerHTML = `
    <div class="wiz">
      <div class="wiz-dots">${puntos}</div>
      <div class="wiz-content">${contenido}</div>
      <div class="wiz-nav">
        <button class="btn btn-secondary" data-wiz="atras" ${W.paso === 0 ? 'disabled' : ''}>
          ${W.paso === 0 ? 'Cancelar' : 'Atrás'}
        </button>
        <button class="btn btn-primary" data-wiz="${ultimo ? 'guardar' : 'siguiente'}" ${puedeSeguir ? '' : 'disabled'}>
          ${ultimo ? (W.editando ? 'Guardar' : 'Crear lugar') : 'Siguiente'}
        </button>
      </div>
    </div>
  `;
  bind(body);
}

function pantallaNombre() {
  return `
    <h3 class="wiz-titulo">¿Cómo se llama?</h3>
    <input type="text" class="search-input wiz-input" id="wiz-nombre" placeholder="Gimnasio del barrio"
           value="${escaparAtributo(W.nombre)}" autocomplete="off" maxlength="40">

    <h3 class="wiz-titulo" style="margin-top:var(--space-lg);">¿A qué se parece?</h3>
    <p class="wiz-ayuda">Elegí lo más cercano y después lo ajustás paso a paso. Podés saltearlo.</p>
    <div class="wiz-presets">
      ${PRESETS_EQUIPO.map(p => `
        <button class="wiz-preset ${W.preset === p.key ? 'activo' : ''}" data-preset="${p.key}">
          <i class="ph ${p.icono}"></i>
          <span class="wiz-preset-nombre">${p.label}</span>
          <span class="wiz-preset-detalle">${p.detalle}</span>
        </button>
      `).join('')}
    </div>`;
}

function pantallaCategoria(cat) {
  const marcados = cat.items.filter(i => tiene(i.key)).length;
  return `
    <h3 class="wiz-titulo"><i class="ph ${cat.icono}"></i> ${cat.label}</h3>
    <p class="wiz-ayuda">${cat.descripcion}${marcados ? ` · ${marcados} marcado${marcados > 1 ? 's' : ''}` : ''}</p>
    <div class="wiz-items">
      ${cat.items.map(i => `
        <button class="wiz-item ${tiene(i.key) ? 'marcado' : ''}" data-equipo="${i.key}"
                role="checkbox" aria-checked="${tiene(i.key)}">
          <span class="wiz-check"><i class="ph ${tiene(i.key) ? 'ph-check' : ''}"></i></span>
          <span class="wiz-item-texto">
            <span class="wiz-item-nombre">${i.label}</span>
            ${i.ayuda ? `<span class="wiz-item-ayuda">${i.ayuda}</span>` : ''}
          </span>
        </button>
      `).join('')}
    </div>`;
}

function pantallaResumen() {
  const equipo = [...W.equipo];
  const total = disponiblesCon(equipo).length;
  const cuenta = porGrupo(equipo);
  const flojos = GRUPOS_MUSCULARES.filter(g => cuenta[g] < MINIMO_POR_GRUPO);

  const avisos = flojos.map(g => {
    const f = queLeFalta(g, equipo);
    return `<li>
      <strong>${g}</strong>: ${cuenta[g]} ejercicio${cuenta[g] === 1 ? '' : 's'}.
      ${f ? `Con <strong>${EQUIPO_INDEX[f.key]?.label || f.key}</strong> pasarías a ${f.n}.`
          : 'No hay nada en la lista que lo mejore.'}
    </li>`;
  }).join('');

  return `
    <h3 class="wiz-titulo">Listo</h3>

    <div class="wiz-identidad">
      <div class="badge badge-lugar wiz-badge-preview" style="--badge-color:${W.color};">${(W.badge || abreviarNombre(W.nombre, 6)).toUpperCase()}</div>
      <input type="text" class="search-input" id="wiz-badge" maxlength="7"
             placeholder="Etiqueta" value="${escaparAtributo(W.badge)}" autocomplete="off">
    </div>
    <p class="wiz-ayuda">La etiqueta es lo que aparece al lado del número de rutina, como CASA o RÍO.</p>

    <div class="wiz-colores">
      ${COLORES_LUGAR.map(c => `<button class="wiz-color ${W.color === c ? 'activo' : ''}" data-color="${c}" style="background:${c};" aria-label="Color ${c}"></button>`).join('')}
    </div>
    <div class="wiz-iconos">
      ${ICONOS_LUGAR.map(ic => `<button class="wiz-icono ${W.icono === ic ? 'activo' : ''}" data-icono="${ic}"><i class="ph ${ic}"></i></button>`).join('')}
    </div>

    <div class="wiz-cobertura">
      <div class="wiz-total"><strong>${total}</strong> de ${EJERCICIOS_CATALOGO.length} ejercicios disponibles acá</div>
      <div class="wiz-barras">
        ${GRUPOS_MUSCULARES.map(g => {
          const n = cuenta[g];
          const max = Math.max(...Object.values(cuenta), 1);
          return `<div class="wiz-barra ${n < MINIMO_POR_GRUPO ? 'flojo' : ''}">
            <span class="wiz-barra-label">${g}</span>
            <span class="wiz-barra-track"><span class="wiz-barra-fill" style="width:${Math.round(n / max * 100)}%"></span></span>
            <span class="wiz-barra-num">${n}</span>
          </div>`;
        }).join('')}
      </div>
      ${avisos ? `<div class="wiz-aviso">
        <p><i class="ph ph-warning"></i> Con este equipamiento te quedan grupos casi sin cubrir:</p>
        <ul>${avisos}</ul>
        <p class="wiz-ayuda">Podés crearlo igual y agregarle equipamiento después.</p>
      </div>` : `<div class="wiz-ok"><i class="ph ph-check-circle"></i> Cubre todos los grupos musculares.</div>`}
    </div>

    ${W.editando && !getLugar(W.editando)?.builtin ? `
      <button class="btn btn-secondary wiz-borrar" data-wiz="borrar">
        <i class="ph ph-trash"></i> Eliminar este lugar
      </button>` : ''}`;
}

// ── Eventos ────────────────────────────────────────────────────────────────

function bind(body) {
  body.querySelector('#wiz-nombre')?.addEventListener('input', (e) => {
    W.nombre = e.target.value;
    const btn = body.querySelector('[data-wiz="siguiente"]');
    if (btn) btn.disabled = !W.nombre.trim();
  });

  body.querySelectorAll('[data-preset]').forEach(b => b.addEventListener('click', () => {
    const p = PRESETS_EQUIPO.find(x => x.key === b.dataset.preset);
    if (!p) return;
    // Volver a tocar el preset activo lo desmarca y vacía la selección.
    if (W.preset === p.key) { W.preset = null; W.equipo = new Set(); }
    else { W.preset = p.key; W.equipo = new Set(p.equipo); }
    render();
  }));

  body.querySelectorAll('[data-equipo]').forEach(b => b.addEventListener('click', () => {
    alternar(b.dataset.equipo);
    W.preset = null;   // ya no es el preset tal cual
    render();
  }));

  body.querySelector('#wiz-badge')?.addEventListener('input', (e) => {
    W.badge = e.target.value;
    const prev = body.querySelector('.wiz-badge-preview');
    if (prev) prev.textContent = (W.badge || abreviarNombre(W.nombre, 6)).toUpperCase();
  });

  body.querySelectorAll('[data-color]').forEach(b => b.addEventListener('click', () => {
    W.color = b.dataset.color; render();
  }));
  body.querySelectorAll('[data-icono]').forEach(b => b.addEventListener('click', () => {
    W.icono = b.dataset.icono; render();
  }));

  body.querySelector('[data-wiz="atras"]')?.addEventListener('click', () => {
    if (W.paso === 0) { closeModal(); return; }
    W.paso--; render();
  });
  body.querySelector('[data-wiz="siguiente"]')?.addEventListener('click', () => {
    W.paso++; render();
    document.querySelector('#modal-overlay .modal-body')?.scrollTo({ top: 0 });
  });
  body.querySelector('[data-wiz="guardar"]')?.addEventListener('click', guardar);
  body.querySelector('[data-wiz="borrar"]')?.addEventListener('click', () => {
    const l = getLugar(W.editando);
    deleteLugar(W.editando);
    closeModal();
    showToast(`${l?.nombre || 'Lugar'} eliminado`);
    W.alTerminar?.();
  });
}

function guardar() {
  const datos = {
    nombre: W.nombre.trim(),
    equipo: [...W.equipo],
    color: W.color,
    icono: W.icono,
    badge: W.badge.trim() || undefined,
  };
  const lugar = W.editando ? updateLugar(W.editando, datos) : addLugar(datos);
  const cb = W.alTerminar;
  closeModal();
  showToast(W.editando ? `${lugar.nombre} actualizado` : `${lugar.nombre} creado`);
  cb?.();
}

function escaparAtributo(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

// ── Entradas públicas ──────────────────────────────────────────────────────

export function openLugarWizard({ lugarId = null, alTerminar } = {}) {
  const base = lugarId ? getLugar(lugarId) : null;
  W = {
    paso: 0,
    editando: lugarId,
    nombre: base?.nombre || '',
    badge: base?.badge || '',
    color: base?.color || colorLibre(),
    icono: base?.icono || 'ph-map-pin',
    equipo: new Set(base?.equipo || []),
    preset: null,
    alTerminar,
  };
  openModal(lugarId ? 'Editar lugar' : 'Lugar nuevo', '<div class="wiz"></div>', { onMount: render });
}

// Hoja previa: la lista de lugares con su cobertura, para editar uno o crear
// otro. Entrar directo al wizard escondería que el equipamiento de Casa también
// se puede corregir desde acá.
export function openLugaresSheet({ alTerminar } = {}) {
  const pintar = () => {
    const filas = getLugares().map(l => {
      const n = l.equipo ? disponiblesCon(l.equipo).length : EJERCICIOS_CATALOGO.length;
      const items = l.equipo ? l.equipo.length : 0;
      return `
        <button class="lugares-fila" data-lugar="${l.id}">
          <span class="lugares-punto" style="background:${l.color};"><i class="ph ${l.icono}"></i></span>
          <span class="lugares-texto">
            <span class="lugares-nombre">${l.nombre}</span>
            <span class="lugares-detalle">${items} ítems · ${n} ejercicios</span>
          </span>
          <i class="ph ph-caret-right lugares-flecha"></i>
        </button>`;
    }).join('');

    openModal('Lugares', `
      <div class="lugares-lista">${filas}</div>
      <button class="btn btn-primary" id="btn-lugar-nuevo" style="width:100%;margin-top:var(--space-md);">
        <i class="ph ph-plus"></i> Lugar nuevo
      </button>
    `, { onMount: (body) => {
      body.querySelectorAll('[data-lugar]').forEach(b => b.addEventListener('click', () => {
        openLugarWizard({ lugarId: b.dataset.lugar, alTerminar });
      }));
      body.querySelector('#btn-lugar-nuevo').addEventListener('click', () => {
        openLugarWizard({ alTerminar });
      });
    } });
  };
  pintar();
}
