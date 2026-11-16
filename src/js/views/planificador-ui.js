// Interfaz del planificador de meses.
//
// Reparte rutinas que YA EXISTEN sobre el calendario. No genera nada: si un
// lugar no tiene rutinas suficientes, lo avisa y ofrece ir al generador.
//
// Tres pasos: para quién y cuándo, los tramos, y la vista previa. No escribe
// nada hasta el último botón, así que salirse en el medio no deja nada.

import { openModal, closeModal } from '../components/modal.js';
import { showToast, showToastAction } from '../components/toast.js';
import { store } from '../../store.js';
import { getLugares, getLugar } from '../../lugares.js';
import { planificar, textoAviso, rutinasDeLugar, MINIMO_ROTACION } from '../../planificador.js';
import { formatDateISO } from '../../utils/calendar.js';

const DIAS = [
  { iso: 1, corto: 'L' }, { iso: 2, corto: 'M' }, { iso: 3, corto: 'X' },
  { iso: 4, corto: 'J' }, { iso: 5, corto: 'V' }, { iso: 6, corto: 'S' }, { iso: 7, corto: 'D' },
];

let P = null;

function hoy() { return formatDateISO(new Date()); }
function masMeses(n) {
  const d = new Date(); d.setMonth(d.getMonth() + n); return formatDateISO(d);
}

function usuariosConocidos() {
  const de = new Set(store.getAll(store.KEYS.rutinas).map(r => r.usuario).filter(Boolean));
  if (!de.size) { de.add('Lean'); de.add('Nat'); }
  return [...de];
}

// ── Render ─────────────────────────────────────────────────────────────────

function render() {
  const body = document.querySelector('#modal-overlay .modal-body');
  if (!body) return;
  const pasos = ['cuando', 'tramos', 'previa'];
  const paso = pasos[P.paso];

  const puntos = pasos.map((_, i) =>
    `<span class="wiz-dot ${i === P.paso ? 'actual' : (i < P.paso ? 'hecho' : '')}"></span>`).join('');

  const cuerpo = paso === 'cuando' ? pantallaCuando()
               : paso === 'tramos' ? pantallaTramos()
               : pantallaPrevia();

  const ultimo = P.paso === pasos.length - 1;
  body.innerHTML = `
    <div class="wiz">
      <div class="wiz-dots">${puntos}</div>
      <div class="wiz-content">${cuerpo}</div>
      <div class="wiz-nav">
        <button class="btn btn-secondary" data-plan="atras">${P.paso === 0 ? 'Cancelar' : 'Atrás'}</button>
        <button class="btn btn-primary" data-plan="${ultimo ? 'aplicar' : 'siguiente'}" ${puedeSeguir(paso) ? '' : 'disabled'}>
          ${ultimo ? 'Aplicar al calendario' : 'Siguiente'}
        </button>
      </div>
    </div>`;
  bind(body);
}

function puedeSeguir(paso) {
  if (paso === 'cuando') return P.usuario && P.desde && P.hasta && P.hasta >= P.desde;
  if (paso === 'tramos') return P.tramos.length > 0 && P.tramos.every(t => t.lugar && t.dias.length && t.desde && t.hasta);
  return Object.keys(P.resultado?.overrides || {}).length > 0;
}

function pantallaCuando() {
  const us = usuariosConocidos();
  return `
    <h3 class="wiz-titulo">¿Para quién?</h3>
    <div class="plan-usuarios">
      ${us.map(u => `<button class="plan-usuario ${P.usuario === u ? 'activo' : ''}" data-usuario="${u}">${u}</button>`).join('')}
    </div>

    <h3 class="wiz-titulo" style="margin-top:var(--space-lg);">¿Qué período?</h3>
    <div class="plan-fechas">
      <label>Desde <input type="date" id="plan-desde" value="${P.desde}"></label>
      <label>Hasta <input type="date" id="plan-hasta" value="${P.hasta}"></label>
    </div>
    <div class="plan-atajos">
      ${[['1 mes', 1], ['2 meses', 2], ['3 meses', 3]].map(([t, n]) =>
        `<button class="plan-atajo" data-meses="${n}">${t}</button>`).join('')}
    </div>
    <p class="wiz-ayuda">Después vas a poder partirlo en tramos, por ejemplo si te vas de viaje en el medio.</p>`;
}

function pantallaTramos() {
  return `
    <h3 class="wiz-titulo">Tramos</h3>
    <p class="wiz-ayuda">Cada tramo tiene su lugar y sus días. Si te vas de viaje, agregá uno con esas fechas.</p>
    <div class="plan-tramos">
      ${P.tramos.map((t, i) => tarjetaTramo(t, i)).join('')}
    </div>
    <button class="btn btn-secondary" data-plan="agregar-tramo" style="width:100%;margin-top:var(--space-sm);">
      <i class="ph ph-plus"></i> Agregar tramo
    </button>`;
}

function tarjetaTramo(t, i) {
  const lugares = getLugares();
  const cuantas = t.lugar ? rutinasDeLugar(store.getAll(store.KEYS.rutinas), P.usuario, t.lugar).length : 0;
  const corto = t.lugar && cuantas > 0 && cuantas < MINIMO_ROTACION;
  const vacio = t.lugar && cuantas === 0;
  return `
    <div class="plan-tramo" data-i="${i}">
      <div class="plan-tramo-top">
        <span class="plan-tramo-num">${i + 1}</span>
        ${P.tramos.length > 1 ? `<button class="plan-tramo-quitar" data-quitar="${i}" title="Quitar"><i class="ph ph-x"></i></button>` : ''}
      </div>
      <div class="plan-fechas">
        <label>Desde <input type="date" data-campo="desde" data-i="${i}" value="${t.desde}"></label>
        <label>Hasta <input type="date" data-campo="hasta" data-i="${i}" value="${t.hasta}"></label>
      </div>
      <div class="plan-dias">
        ${DIAS.map(d => `<button class="plan-dia ${t.dias.includes(d.iso) ? 'activo' : ''}" data-dia="${d.iso}" data-i="${i}">${d.corto}</button>`).join('')}
      </div>
      <div class="plan-lugares">
        ${lugares.map(l => `<button class="lugar-chip ${t.lugar === l.id ? 'active' : ''}" data-lugar="${l.id}" data-i="${i}">${l.corto}</button>`).join('')}
      </div>
      ${vacio ? `<div class="plan-alerta">
          Este lugar todavía no tiene rutinas de ${P.usuario}.
          <button class="plan-link" data-generar="${t.lugar}">Generar rutinas</button>
        </div>`
      : corto ? `<div class="plan-alerta suave">
          Sólo ${cuantas} rutina${cuantas > 1 ? 's' : ''}. Con menos de ${MINIMO_ROTACION} vas a repetir ejercicios de un día para el otro.
        </div>`
      : t.lugar ? `<div class="plan-ok">${cuantas} rutinas disponibles</div>` : ''}
    </div>`;
}

function pantallaPrevia() {
  const rutinas = store.getAll(store.KEYS.rutinas);
  const overridesTodos = store.getObj(store.KEYS.overrides);
  P.resultado = planificar({
    usuario: P.usuario, tramos: P.tramos, rutinas,
    overridesActuales: overridesTodos[P.usuario] || {},
  });
  const { overrides, conflictos, respetados, avisos, resumen } = P.resultado;
  const fechas = Object.keys(overrides).sort();
  const nombreDe = id => rutinas.find(r => r.id === id)?.nombre || id;

  return `
    <h3 class="wiz-titulo">Vista previa</h3>
    <div class="plan-total"><strong>${fechas.length}</strong> días de entrenamiento para ${P.usuario}</div>

    <div class="plan-resumen">
      ${resumen.map(r => {
        const l = getLugar(r.lugar);
        return `<div class="plan-resumen-fila">
          <span class="lugares-punto" style="background:${l.color};width:26px;height:26px;font-size:13px;"><i class="ph ${l.icono}"></i></span>
          <span class="plan-resumen-txt"><strong>${l.corto}</strong> · ${r.desde} → ${r.hasta}</span>
          <span class="plan-resumen-num">${r.dias} días</span>
        </div>`;
      }).join('')}
    </div>

    ${avisos.length ? `<div class="wiz-aviso"><ul>${avisos.map(a => `<li>${textoAviso(a)}</li>`).join('')}</ul></div>` : ''}

    ${respetados.length ? `<div class="plan-nota">
      <i class="ph ph-lock-simple"></i> ${respetados.length} día${respetados.length > 1 ? 's' : ''} que asignaste a mano queda${respetados.length > 1 ? 'n' : ''} como está${respetados.length > 1 ? 'n' : ''}.
    </div>` : ''}

    ${conflictos.length ? `<div class="plan-nota aviso">
      <i class="ph ph-arrows-clockwise"></i> ${conflictos.length} día${conflictos.length > 1 ? 's' : ''} que ya tenía${conflictos.length > 1 ? 'n' : ''} rutina del plan anterior se va${conflictos.length > 1 ? 'n' : ''} a reemplazar.
    </div>` : ''}

    <div class="plan-listado">
      ${fechas.slice(0, 10).map(f => `<div class="plan-dia-fila">
        <span class="plan-dia-fecha">${f}</span>
        <span class="plan-dia-rutina">${nombreDe(overrides[f].rutinaId)}</span>
      </div>`).join('')}
      ${fechas.length > 10 ? `<div class="plan-dia-mas">y ${fechas.length - 10} días más</div>` : ''}
    </div>`;
}

// ── Eventos ────────────────────────────────────────────────────────────────

function bind(body) {
  body.querySelectorAll('[data-usuario]').forEach(b => b.addEventListener('click', () => {
    P.usuario = b.dataset.usuario; render();
  }));
  body.querySelector('#plan-desde')?.addEventListener('change', e => { P.desde = e.target.value; sincronizarTramoUnico(); });
  body.querySelector('#plan-hasta')?.addEventListener('change', e => { P.hasta = e.target.value; sincronizarTramoUnico(); });
  body.querySelectorAll('[data-meses]').forEach(b => b.addEventListener('click', () => {
    P.desde = hoy(); P.hasta = masMeses(+b.dataset.meses); sincronizarTramoUnico(); render();
  }));

  body.querySelectorAll('[data-campo]').forEach(inp => inp.addEventListener('change', () => {
    P.tramos[+inp.dataset.i][inp.dataset.campo] = inp.value; render();
  }));
  body.querySelectorAll('[data-dia]').forEach(b => b.addEventListener('click', () => {
    const t = P.tramos[+b.dataset.i], d = +b.dataset.dia;
    const k = t.dias.indexOf(d);
    if (k >= 0) t.dias.splice(k, 1); else t.dias.push(d);
    t.dias.sort(); render();
  }));
  body.querySelectorAll('.plan-lugares [data-lugar]').forEach(b => b.addEventListener('click', () => {
    P.tramos[+b.dataset.i].lugar = b.dataset.lugar; render();
  }));
  body.querySelectorAll('[data-quitar]').forEach(b => b.addEventListener('click', () => {
    P.tramos.splice(+b.dataset.quitar, 1); render();
  }));
  // Agregar un tramo PARTE EL ÚLTIMO en dos, no agrega uno después del final:
  // si arrancara el día siguiente al último, terminaría antes de empezar. Y el
  // caso real es recortarle días al tramo largo para meter el viaje adentro.
  body.querySelector('[data-plan="agregar-tramo"]')?.addEventListener('click', () => {
    const ult = P.tramos[P.tramos.length - 1];
    const a = new Date(ult.desde + 'T00:00:00');
    const b = new Date(ult.hasta + 'T00:00:00');
    const medio = new Date((a.getTime() + b.getTime()) / 2);
    const finPrimero = new Date(medio); finPrimero.setDate(finPrimero.getDate() - 1);
    const sePuedePartir = finPrimero >= a;
    // Si el tramo dura un solo día no hay nada que partir: el nuevo arranca el
    // mismo día y el usuario lo acomoda.
    const nuevoDesde = sePuedePartir ? formatDateISO(medio) : ult.desde;
    if (sePuedePartir) ult.hasta = formatDateISO(finPrimero);
    P.tramos.push({ desde: nuevoDesde, hasta: formatDateISO(b), dias: [...ult.dias], lugar: null });
    render();
  });
  body.querySelectorAll('[data-generar]').forEach(b => b.addEventListener('click', () => {
    showToast('El generador de rutinas todavía no está. Por ahora, elegí un lugar que ya tenga rutinas.');
  }));

  body.querySelector('[data-plan="atras"]')?.addEventListener('click', () => {
    if (P.paso === 0) { closeModal(); return; }
    P.paso--; render();
  });
  body.querySelector('[data-plan="siguiente"]')?.addEventListener('click', () => {
    P.paso++; render();
    document.querySelector('#modal-overlay .modal-body')?.scrollTo({ top: 0 });
  });
  body.querySelector('[data-plan="aplicar"]')?.addEventListener('click', aplicar);
}

// Mientras haya un solo tramo, sigue al período: es el caso normal y no tiene
// sentido pedir las mismas fechas dos veces.
function sincronizarTramoUnico() {
  if (P.tramos.length === 1) { P.tramos[0].desde = P.desde; P.tramos[0].hasta = P.hasta; }
}

function aplicar() {
  const nuevos = P.resultado?.overrides || {};
  const todos = store.getObj(store.KEYS.overrides);
  const previo = { ...(todos[P.usuario] || {}) };

  // Planificar un período lo REEMPLAZA, no se superpone. Si no, cambiar los
  // días de lunes/miércoles/viernes a martes/jueves/sábado dejaría los seis:
  // los nuevos se agregan y los viejos siguen ahí.
  //
  // Lo que el usuario eligió a mano sobrevive: una rutina puesta a dedo
  // (`manual`) o un día de descanso (`rest`).
  const resultante = {};
  for (const [fecha, ov] of Object.entries(previo)) {
    const dentro = P.tramos.some(t => fecha >= t.desde && fecha <= t.hasta);
    if (!dentro || ov?.manual || ov?.rest) resultante[fecha] = ov;
  }
  Object.assign(resultante, nuevos);

  todos[P.usuario] = resultante;
  store.set(store.KEYS.overrides, todos);

  const n = Object.keys(nuevos).length;
  closeModal();
  showToastAction(`${n} días planificados para ${P.usuario}`, '↺ Deshacer', () => {
    const t = store.getObj(store.KEYS.overrides);
    t[P.usuario] = previo;
    store.set(store.KEYS.overrides, t);
    showToast('Plan deshecho');
    P.alTerminar?.();
  });
  P.alTerminar?.();
}

// ── Entrada pública ────────────────────────────────────────────────────────

export function openPlanificador({ usuario, alTerminar } = {}) {
  const us = usuariosConocidos();
  const desde = hoy(), hasta = masMeses(2);
  P = {
    paso: 0,
    usuario: usuario || store.getActiveUser?.() || us[0],
    desde, hasta,
    tramos: [{ desde, hasta, dias: [1, 3, 5], lugar: null }],
    resultado: null,
    alTerminar,
  };
  openModal('Planificar meses', '<div class="wiz"></div>', { onMount: render });
}
