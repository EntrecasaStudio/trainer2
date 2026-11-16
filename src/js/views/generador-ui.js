// Interfaz del generador de rutinas.
//
// Arma rutinas nuevas para un lugar. No toca el calendario: eso es del
// planificador. Se usa cuando aparece un lugar nuevo, o cuando se quiere una
// tanda fresca para uno que ya existe.
//
// Cinco pasos: lugar, cuántas, forma del día, énfasis y vista previa. No
// escribe nada hasta el último botón.

import { openModal, closeModal } from '../components/modal.js';
import { showToast, showToastAction } from '../components/toast.js';
import { store } from '../../store.js';
import { getLugares, getLugar, getEquipoDeLugar } from '../../lugares.js';
import { EJERCICIOS_CATALOGO, GRUPOS_MUSCULARES } from '../../ejercicios-catalogo.js';
import { estaDisponible } from '../../equipamiento.js';
import { generarPrograma, letrasSugeridas, MINIMO_ANILLO } from '../../generador.js';
import { auditarAdyacencia } from '../../adyacencia.js';
import { rutinasDeLugar } from '../../planificador.js';

let G = null;

function usuariosConocidos() {
  const de = new Set(store.getAll(store.KEYS.rutinas).map(r => r.usuario).filter(Boolean));
  if (!de.size) { de.add('Lean'); de.add('Nat'); }
  return [...de];
}

function disponiblesEn(lugarId) {
  const eq = getEquipoDeLugar(lugarId);
  return EJERCICIOS_CATALOGO.filter(e => eq === null || estaDisponible(e, eq));
}

// ── Render ─────────────────────────────────────────────────────────────────

const PASOS = ['lugar', 'cuantas', 'forma', 'enfasis', 'previa'];

function render() {
  const body = document.querySelector('#modal-overlay .modal-body');
  if (!body) return;
  const paso = PASOS[G.paso];
  const puntos = PASOS.map((_, i) =>
    `<span class="wiz-dot ${i === G.paso ? 'actual' : (i < G.paso ? 'hecho' : '')}"></span>`).join('');

  const cuerpo = { lugar: pLugar, cuantas: pCuantas, forma: pForma, enfasis: pEnfasis, previa: pPrevia }[paso]();
  const ultimo = G.paso === PASOS.length - 1;

  body.innerHTML = `
    <div class="wiz">
      <div class="wiz-dots">${puntos}</div>
      <div class="wiz-content">${cuerpo}</div>
      <div class="wiz-nav">
        <button class="btn btn-secondary" data-gen="atras">${G.paso === 0 ? 'Cancelar' : 'Atrás'}</button>
        <button class="btn btn-primary" data-gen="${ultimo ? 'crear' : 'siguiente'}" ${puedeSeguir(paso) ? '' : 'disabled'}>
          ${ultimo ? `Crear ${G.resultado?.rutinas.length || ''} rutinas` : 'Siguiente'}
        </button>
      </div>
    </div>`;
  bind(body);
}

function puedeSeguir(paso) {
  if (paso === 'lugar') return !!G.lugar && !!G.usuario;
  if (paso === 'cuantas') return G.letras >= 1;
  return true;
}

function pLugar() {
  const us = usuariosConocidos();
  return `
    <h3 class="wiz-titulo">¿Para quién?</h3>
    <div class="plan-usuarios">
      ${us.map(u => `<button class="plan-usuario ${G.usuario === u ? 'activo' : ''}" data-usuario="${u}">${u}</button>`).join('')}
    </div>
    <h3 class="wiz-titulo" style="margin-top:var(--space-lg);">¿Dónde?</h3>
    <div class="lugares-lista">
      ${getLugares().map(l => {
        const ej = disponiblesEn(l.id).length;
        const ya = G.usuario ? rutinasDeLugar(store.getAll(store.KEYS.rutinas), G.usuario, l.id).length : 0;
        return `<button class="lugares-fila ${G.lugar === l.id ? 'elegida' : ''}" data-lugar="${l.id}">
          <span class="lugares-punto" style="background:${l.color};"><i class="ph ${l.icono}"></i></span>
          <span class="lugares-texto">
            <span class="lugares-nombre">${l.nombre}</span>
            <span class="lugares-detalle">${ej} ejercicios · ${ya} rutinas de ${G.usuario || '—'}</span>
          </span>
        </button>`;
      }).join('')}
    </div>`;
}

function pCuantas() {
  const rutinas = G.letras * 2;
  return `
    <h3 class="wiz-titulo">¿Cuántas sesiones vas a hacer ahí?</h3>
    <p class="wiz-ayuda">De acá sale cuántas rutinas generar. No tiene sentido armar veinte para dos semanas de viaje.</p>
    <div class="plan-atajos" style="flex-wrap:wrap;">
      ${[['6 (2 semanas)', 6], ['12 (1 mes)', 12], ['24 (2 meses)', 24], ['36 (3 meses)', 36]].map(([t, n]) =>
        `<button class="plan-atajo ${G.sesiones === n ? 'activo' : ''}" data-sesiones="${n}" style="flex:1 1 46%;">${t}</button>`).join('')}
    </div>

    <div class="gen-letras">
      <span>Rutinas a generar</span>
      <div class="gen-stepper">
        <button data-letras="-1">−</button>
        <strong>${rutinas}</strong>
        <button data-letras="1">+</button>
      </div>
    </div>
    <p class="wiz-ayuda">${G.letras} letras × press y pull. Cada rutina vuelve cada ${rutinas} sesiones.</p>
    ${rutinas < MINIMO_ANILLO ? `<div class="plan-alerta suave">
      Con menos de ${MINIMO_ANILLO} rutinas cada una es vecina de todas y la regla de adyacencia deja de tener sentido: vas a repetir ejercicios de un día para el otro.
    </div>` : ''}`;
}

function pForma() {
  return `
    <h3 class="wiz-titulo">¿Cómo es un día?</h3>
    ${[['circuitos', 'Circuitos por día', 2, 6],
       ['ejerciciosPorCircuito', 'Ejercicios por circuito', 2, 5]].map(([k, label, min, max]) => `
      <div class="gen-letras">
        <span>${label}</span>
        <div class="gen-stepper">
          <button data-campo="${k}" data-delta="-1" ${G[k] <= min ? 'disabled' : ''}>−</button>
          <strong>${G[k]}</strong>
          <button data-campo="${k}" data-delta="1" ${G[k] >= max ? 'disabled' : ''}>+</button>
        </div>
      </div>`).join('')}

    <div class="gen-letras">
      <span>Cierra con HIIT</span>
      <button class="gen-toggle ${G.hiit ? 'activo' : ''}" data-gen="hiit">${G.hiit ? 'Sí' : 'No'}</button>
    </div>

    <div class="gen-letras">
      <span>Series · reps por defecto</span>
      <div class="gen-stepper">
        <button data-campo="series" data-delta="-1" ${G.series <= 1 ? 'disabled' : ''}>−</button>
        <strong>${G.series}×${G.reps}</strong>
        <button data-campo="series" data-delta="1" ${G.series >= 5 ? 'disabled' : ''}>+</button>
      </div>
    </div>
    <p class="wiz-ayuda">Son ${G.circuitos * G.ejerciciosPorCircuito} ejercicios por día${G.hiit ? ', contando el circuito de HIIT' : ''}.</p>`;
}

function pEnfasis() {
  const eq = getEquipoDeLugar(G.lugar);
  const disp = disponiblesEn(G.lugar);
  return `
    <h3 class="wiz-titulo">¿Algún grupo con más peso?</h3>
    <p class="wiz-ayuda">Opcional. Sube la chance de que ese grupo salga elegido, hasta donde el catálogo del lugar lo permita.</p>
    <div class="gen-enfasis">
      ${GRUPOS_MUSCULARES.map(g => {
        const n = disp.filter(e => e.grupo === g).length;
        const v = G.sesgo[g] || 1;
        return `<button class="gen-grupo ${v > 1 ? 'activo' : ''}" data-grupo="${g}" ${n === 0 ? 'disabled' : ''}>
          <span class="gen-grupo-nombre">${g}</span>
          <span class="gen-grupo-n">${n} ej.</span>
          ${v > 1 ? `<span class="gen-grupo-x">×${v}</span>` : ''}
        </button>`;
      }).join('')}
    </div>
    <p class="wiz-ayuda">Tocá una vez para ×2, de nuevo para ×3, otra vez para sacarlo.</p>`;
}

function pPrevia() {
  G.resultado = generarPrograma({
    usuario: G.usuario, letras: G.letras,
    lugarPorDia: { 1: G.lugar }, dias: [1],
    ejerciciosPorCircuito: G.ejerciciosPorCircuito,
    series: G.series, reps: G.reps,
    hiit: { activo: G.hiit, series: 4, reps: '20', ejercicios: G.ejerciciosPorCircuito },
    sesgo: G.sesgo, semilla: G.semilla,
  });
  const { rutinas, avisos } = G.resultado;
  const paraAuditar = rutinas.map(r => ({
    nombre: `${r.foco === 'press' ? 'Press' : 'Pull'} ${r.letra}`, foco: r.foco, circuitos: r.circuitos,
  }));
  const choques = auditarAdyacencia(paraAuditar).choques.length;

  const slots = rutinas.flatMap(r => r.circuitos.flatMap(c => c.ejercicios.map(e => e.nombre)));
  const grupoDe = Object.fromEntries(EJERCICIOS_CATALOGO.map(e => [e.nombre, e.grupo]));
  const cuenta = {};
  slots.forEach(n => { const g = grupoDe[n] || '?'; cuenta[g] = (cuenta[g] || 0) + 1; });
  const max = Math.max(...Object.values(cuenta), 1);
  const l = getLugar(G.lugar);

  return `
    <h3 class="wiz-titulo">Vista previa</h3>
    <div class="plan-total"><strong>${rutinas.length}</strong> rutinas para ${G.usuario} en ${l.corto}, ${slots.length} ejercicios en total</div>

    <div class="plan-nota ${choques ? 'aviso' : ''}">
      <i class="ph ${choques ? 'ph-warning' : 'ph-check-circle'}"></i>
      ${choques ? `${choques} choques de adyacencia` : 'Ningún ejercicio se repite en rutinas vecinas'}
    </div>

    <div class="wiz-barras" style="margin-top:var(--space-md);">
      ${GRUPOS_MUSCULARES.map(g => {
        const n = cuenta[g] || 0;
        return `<div class="wiz-barra">
          <span class="wiz-barra-label">${g}</span>
          <span class="wiz-barra-track"><span class="wiz-barra-fill" style="width:${Math.round(n / max * 100)}%"></span></span>
          <span class="wiz-barra-num">${n}</span>
        </div>`;
      }).join('')}
    </div>

    ${avisos.length ? `<div class="wiz-aviso"><ul>${[...new Set(avisos.map(a => a.detalle))].slice(0, 4).map(d => `<li>${d}</li>`).join('')}</ul></div>` : ''}

    <div class="gen-muestra">
      <div class="gen-muestra-tit">${rutinas[0]?.foco === 'press' ? 'Press' : 'Pull'} A, como ejemplo
        <button class="plan-link" data-gen="otra">otra variante</button>
      </div>
      ${(rutinas[0]?.circuitos || []).map(c => `
        <div class="gen-circ"><strong>${c.nombre}</strong>: ${c.ejercicios.map(e => `${e.nombre} (${e.series}×${e.reps})`).join(', ')}</div>
      `).join('')}
    </div>`;
}

// ── Eventos ────────────────────────────────────────────────────────────────

function bind(body) {
  body.querySelectorAll('[data-usuario]').forEach(b => b.addEventListener('click', () => {
    G.usuario = b.dataset.usuario; render();
  }));
  body.querySelectorAll('.lugares-fila[data-lugar]').forEach(b => b.addEventListener('click', () => {
    G.lugar = b.dataset.lugar; render();
  }));
  body.querySelectorAll('[data-sesiones]').forEach(b => b.addEventListener('click', () => {
    G.sesiones = +b.dataset.sesiones;
    G.letras = letrasSugeridas(G.sesiones);
    render();
  }));
  body.querySelectorAll('[data-letras]').forEach(b => b.addEventListener('click', () => {
    G.letras = Math.max(1, Math.min(13, G.letras + +b.dataset.letras));
    G.sesiones = null; render();
  }));
  body.querySelectorAll('[data-campo]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.campo;
    G[k] = Math.max(1, G[k] + +b.dataset.delta);
    render();
  }));
  body.querySelector('[data-gen="hiit"]')?.addEventListener('click', () => { G.hiit = !G.hiit; render(); });
  body.querySelectorAll('[data-grupo]').forEach(b => b.addEventListener('click', () => {
    const g = b.dataset.grupo;
    const v = G.sesgo[g] || 1;
    if (v >= 3) delete G.sesgo[g]; else G.sesgo[g] = v + 1;
    render();
  }));
  body.querySelector('[data-gen="otra"]')?.addEventListener('click', () => { G.semilla++; render(); });

  body.querySelector('[data-gen="atras"]')?.addEventListener('click', () => {
    if (G.paso === 0) { closeModal(); return; }
    G.paso--; render();
  });
  body.querySelector('[data-gen="siguiente"]')?.addEventListener('click', () => {
    G.paso++; render();
    document.querySelector('#modal-overlay .modal-body')?.scrollTo({ top: 0 });
  });
  body.querySelector('[data-gen="crear"]')?.addEventListener('click', crear);
}

// ── Escritura ──────────────────────────────────────────────────────────────

// Las letras arrancan después de las que el lugar ya tiene, para no pisar
// "Casa Press A" con una recién generada.
function primeraLetraLibre(usuario, lugar) {
  const nombres = new Set(store.getAll(store.KEYS.rutinas)
    .filter(r => r.usuario === usuario && r.lugar === lugar).map(r => r.nombre));
  const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const corto = getLugar(lugar).corto;
  for (let i = 0; i < L.length; i++) {
    if (!nombres.has(`${corto} Press ${L[i]} — ${usuario}`) && !nombres.has(`${corto} Pull ${L[i]} — ${usuario}`)) return i;
  }
  return 0;
}

function crear() {
  const { rutinas } = G.resultado;
  const corto = getLugar(G.lugar).corto;
  const offset = primeraLetraLibre(G.usuario, G.lugar);
  const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const ahora = new Date().toISOString();

  const nuevas = rutinas.map((r, i) => {
    const letra = L[(L.indexOf(r.letra) + offset) % L.length];
    const nombre = `${corto} ${r.foco === 'press' ? 'Press' : 'Pull'} ${letra} — ${G.usuario}`;
    return {
      id: crypto.randomUUID(),
      numero: `#G${String(i + 1).padStart(2, '0')}`,
      nombre, usuario: G.usuario, lugar: G.lugar,
      tipo: 'cross', foco: r.foco, semana_ciclo: (i % 2) + 1,
      circuitos: r.circuitos.map((c, ci) => ({
        id: crypto.randomUUID(), numero: ci + 1, nombre: c.nombre,
        ejercicios: c.ejercicios.map(e => ({
          id: crypto.randomUUID(), nombre: e.nombre, series: e.series, reps: e.reps, tipo: 'fuerza',
        })),
      })),
      generada: true, creadaEn: ahora,
      updatedAt: ahora, pendingSync: false,
    };
  });

  const previo = store.getAll(store.KEYS.rutinas);
  store.set(store.KEYS.rutinas, [...previo, ...nuevas]);
  closeModal();
  showToastAction(`${nuevas.length} rutinas creadas en ${corto}`, '↺ Deshacer', () => {
    const ids = new Set(nuevas.map(r => r.id));
    store.set(store.KEYS.rutinas, store.getAll(store.KEYS.rutinas).filter(r => !ids.has(r.id)));
    showToast('Rutinas descartadas');
    G.alTerminar?.();
  });
  G.alTerminar?.();
}

// ── Entrada pública ────────────────────────────────────────────────────────

export function openGenerador({ usuario, lugar = null, alTerminar } = {}) {
  const us = usuariosConocidos();
  G = {
    paso: 0,
    usuario: usuario || store.getActiveUser?.() || us[0],
    lugar,
    sesiones: 24, letras: letrasSugeridas(24),
    circuitos: 5, ejerciciosPorCircuito: 3,
    hiit: true, series: 2, reps: '12',
    sesgo: {}, semilla: 1,
    resultado: null, alTerminar,
  };
  openModal('Generar rutinas', '<div class="wiz"></div>', { onMount: render });
}
