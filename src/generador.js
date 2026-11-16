// Generador de ciclos: arma rutinas y les asigna fechas.
//
// Reemplaza las ~86 fechas por usuario escritas a mano en `ensureCalendarOverrides()`.
//
// Lo que lo distingue de llenar circuitos al azar es que NO PUEDE construir un
// programa que viole la regla de adyacencia: cada ejercicio se consulta contra
// las cuatro rutinas vecinas antes de colocarse (ver adyacencia.js). Esa regla
// hasta ahora se verificaba a mano, después de los hechos.

import { EJERCICIOS_CATALOGO } from './ejercicios-catalogo.js';
import { estaDisponible } from './equipamiento.js';
import { getEquipoDeLugar } from './lugares.js';
import { familiaDe, vecinos } from './adyacencia.js';
import { formatDateISO, getISODayOfWeek } from './utils/calendar.js';

// Azar reproducible: el mismo programa con la misma semilla da el mismo
// resultado, lo que hace que la vista previa sea de fiar y que un bug se pueda
// repetir. Mulberry32.
function rng(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Plantillas de circuito ─────────────────────────────────────────────────
//
// Qué grupos musculares toca cada circuito según el foco del día. Salen de la
// forma que ya tienen las rutinas de casa, no de una teoría: press abre con
// tren inferior, sigue con empuje, y cierra con core; pull abre con tren
// inferior, sigue con tracción, y cierra con core.
export const PLANTILLAS = {
  press: [
    { nombre: 'PIERNAS·GLÚTEOS', grupos: ['Piernas', 'Glúteos'] },
    { nombre: 'PECHO·HOMBROS',   grupos: ['Pecho', 'Hombros'] },
    { nombre: 'HOMBROS·TRÍCEPS', grupos: ['Hombros', 'Brazos'] },
    { nombre: 'CORE·PIERNAS',    grupos: ['Core', 'Piernas', 'Glúteos'] },
  ],
  pull: [
    { nombre: 'PIERNAS·GLÚTEOS', grupos: ['Piernas', 'Glúteos'] },
    { nombre: 'PIERNAS·CORE',    grupos: ['Piernas', 'Glúteos', 'Core'] },
    { nombre: 'ESPALDA·BÍCEPS',  grupos: ['Espalda', 'Brazos'] },
    { nombre: 'CORE·TRÍCEPS',    grupos: ['Core', 'Brazos'] },
  ],
};

export const CIRCUITO_HIIT = { nombre: 'HIIT', grupos: ['HIIT'] };

export const CONFIG_POR_DEFECTO = {
  usuario: 'Lean',
  letras: 10,                    // A..J → 2 × letras rutinas
  alternancia: 'press_pull',
  dias: [1, 3, 5],               // ISO: 1=lunes
  lugarPorDia: {},               // { 1: 'CASA', ... }
  ejerciciosPorCircuito: 3,
  series: 2,
  reps: '12',
  hiit: { activo: true, series: 4, reps: '20', ejercicios: 3 },
  sesgo: {},                     // { 'Glúteos': 2 } multiplica la chance del grupo
  semilla: 1,
};

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// ── Armado del esqueleto ───────────────────────────────────────────────────

// El anillo de rutinas, en el orden en que rotan: Press A, Pull A, Press B, …
function esqueleto(cfg) {
  const out = [];
  for (let i = 0; i < cfg.letras; i++) {
    const L = LETRAS[i];
    if (cfg.alternancia === 'press_pull') {
      out.push({ letra: L, foco: 'press' });
      out.push({ letra: L, foco: 'pull' });
    } else {
      out.push({ letra: L, foco: 'full' });
    }
  }
  return out;
}

function circuitosDe(foco, cfg) {
  const base = PLANTILLAS[foco] || PLANTILLAS.press;
  return cfg.hiit?.activo ? [...base, CIRCUITO_HIIT] : [...base];
}

// ── Elección de ejercicios ─────────────────────────────────────────────────

// Candidatos para un circuito: del grupo que toca y hacibles en ese lugar.
function candidatos(grupos, equipo) {
  return EJERCICIOS_CATALOGO.filter(e =>
    grupos.includes(e.grupo) && (equipo === null || estaDisponible(e, equipo)));
}

export function generarPrograma(configParcial = {}) {
  const cfg = { ...CONFIG_POR_DEFECTO, ...configParcial,
                hiit: { ...CONFIG_POR_DEFECTO.hiit, ...(configParcial.hiit || {}) } };
  const azar = rng(cfg.semilla);
  const avisos = [];

  const plan = esqueleto(cfg);
  const n = plan.length;

  // Lugar de cada rutina del anillo. Las rutinas se reparten entre los lugares
  // elegidos siguiendo el orden de los días, porque la adyacencia se mide sobre
  // el anillo y no sobre el calendario.
  const lugares = cfg.dias.map(d => cfg.lugarPorDia[d]).filter(Boolean);
  const lugarDe = i => lugares.length ? lugares[i % lugares.length] : null;

  // familiasPorRutina[i] = Set de familias ya colocadas en esa rutina
  const familiasPorRutina = Array.from({ length: n }, () => new Set());
  const usos = new Map();        // nombre → cuántas veces se usó en todo el programa

  const rutinas = plan.map((p, i) => {
    const lugar = lugarDe(i);
    const equipo = lugar ? getEquipoDeLugar(lugar) : null;
    const circuitos = circuitosDe(p.foco, cfg).map((plant, ci) => {
      const esHiit = plant.nombre === 'HIIT';
      const cuantos = esHiit ? cfg.hiit.ejercicios : cfg.ejerciciosPorCircuito;
      const pool = candidatos(plant.grupos, equipo);
      const elegidos = [];

      for (let k = 0; k < cuantos; k++) {
        const viables = pool.filter(e =>
          !elegidos.some(x => x.nombre === e.nombre) &&
          puedeColocar(e.nombre, i, familiasPorRutina));

        if (!viables.length) {
          avisos.push({
            tipo: 'sin_candidatos',
            rutina: `${p.foco} ${p.letra}`, circuito: plant.nombre, lugar,
            detalle: `No quedaron ejercicios de ${plant.grupos.join('/')} que no choquen con las rutinas vecinas.`,
          });
          break;
        }

        // Menos usado primero, con el sesgo por grupo y un empujón al azar para
        // que dos programas con distinta semilla no salgan idénticos.
        const puntuado = viables.map(e => {
          const base = usos.get(e.nombre) || 0;
          const peso = cfg.sesgo[e.grupo] || 1;
          return { e, score: (base + azar() * 0.5) / peso };
        }).sort((a, b) => a.score - b.score);

        const elegido = puntuado[0].e;
        elegidos.push(elegido);
        familiasPorRutina[i].add(familiaDe(elegido.nombre));
        usos.set(elegido.nombre, (usos.get(elegido.nombre) || 0) + 1);
      }

      return {
        numero: ci + 1,
        nombre: plant.nombre,
        ejercicios: elegidos.map(e => ({
          nombre: e.nombre,
          series: esHiit ? cfg.hiit.series : cfg.series,
          reps: esHiit ? cfg.hiit.reps : cfg.reps,
        })),
      };
    });

    return {
      letra: p.letra, foco: p.foco, lugar,
      nombre: `${p.foco === 'press' ? 'Press' : p.foco === 'pull' ? 'Pull' : 'Full'} ${p.letra} — ${cfg.usuario}`,
      circuitos,
    };
  });

  return { rutinas, avisos, config: cfg };
}

// Igual que `puedeColocarse` de adyacencia.js, pero recibe los Sets ya armados.
function puedeColocar(nombre, i, familiasPorRutina) {
  const fam = familiaDe(nombre);
  if (familiasPorRutina[i].has(fam)) return false;
  return vecinos(i, familiasPorRutina.length).every(j => !familiasPorRutina[j].has(fam));
}

// ── Calendario ─────────────────────────────────────────────────────────────

// Recorre el período y le asigna a cada día de entrenamiento la rutina que le
// toca del anillo. Devuelve { 'YYYY-MM-DD': { rutinaIdx, lugar, foco } }.
export function asignarFechas(rutinas, cfg, desde, hasta) {
  const out = {};
  const d = new Date(desde + 'T00:00:00');
  const fin = new Date(hasta + 'T00:00:00');
  let idx = 0;
  while (d <= fin) {
    const dow = getISODayOfWeek(d);
    if (cfg.dias.includes(dow)) {
      const r = rutinas[idx % rutinas.length];
      out[formatDateISO(d)] = { rutinaIdx: idx % rutinas.length, lugar: r.lugar, foco: r.foco };
      idx++;
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}
