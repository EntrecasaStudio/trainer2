// Generador de rutinas: arma rutinas nuevas para un lugar.
//
// Sólo rutinas. El calendario lo arma planificador.js.
//
// Lo que lo distingue de llenar circuitos al azar es que NO PUEDE construir un
// programa que viole la regla de adyacencia: cada ejercicio se consulta contra
// las cuatro rutinas vecinas antes de colocarse (ver adyacencia.js). Esa regla
// hasta ahora se verificaba a mano, después de los hechos.

import { EJERCICIOS_CATALOGO } from './ejercicios-catalogo.js';
import { estaDisponible } from './equipamiento.js';
import { getEquipoDeLugar } from './lugares.js';
import { familiaDe, vecinos } from './adyacencia.js';

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
    // `minimos` existe por un problema medido: sin él, espalda quedaba en 5%,
    // por debajo del 7% que es el piso para no romper el balance empuje/tirón.
    // Es el único circuito que la incluye y ahí compite con brazos, que tiene
    // muchos más ejercicios en el catálogo y se los llevaba casi todos.
    { nombre: 'ESPALDA·BÍCEPS',  grupos: ['Espalda', 'Brazos'], minimos: { Espalda: 2 } },
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
  // Cuántos ejercicios ANCLA reservar. Un ancla se coloca varias veces en el
  // anillo, lo más espaciada posible, en vez de repartirlo todo fino.
  //
  // Sale de una medición sobre rutinas reales: un tercio de los ejercicios
  // aparecía UNA sola vez en el ciclo, o sea que se entrenaba una vez cada 7
  // semanas y nunca llegaba a progresar. Elegir siempre "el menos usado",
  // que era lo que hacía antes, maximiza la variedad y mata la progresión.
  //
  // La regla de adyacencia no se opone: prohíbe ±1 y ±2, así que un ejercicio
  // puede aparecer hasta 6 veces en un anillo de 20 si está BIEN ESPACIADO.
  anclas: 6,
  aparicionesPorAncla: 4,
  // Cuántos ejercicios DISTINTOS puede usar todo el programa. Sin tope, el
  // generador dibuja del catálogo entero y la mitad de los ejercicios termina
  // apareciendo una sola vez en el ciclo: 2 series cada 7 semanas, que no
  // alcanza para progresar en nada. 'auto' lo calcula para que cada ejercicio
  // salga unas 3 veces en promedio.
  repertorio: 'auto',
  semilla: 1,
};

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Cuántas letras generar para un lugar donde vas a hacer `sesiones` sesiones.
//
// Para dos semanas de viaje a 3 por semana son 6 sesiones: generar 20 rutinas
// es absurdo, y además el catálogo de ese lugar puede no dar para tantas sin
// repetirse. Pero hay un piso: con menos de 5 rutinas en el anillo cada una es
// vecina de todas (la regla mira ±2) y la adyacencia deja de significar algo.
export function letrasSugeridas(sesiones, alternancia = 'press_pull') {
  const porLetra = alternancia === 'press_pull' ? 2 : 1;
  const rutinas = Math.max(MINIMO_ANILLO, Math.ceil(sesiones || 0));
  return Math.max(3, Math.ceil(rutinas / porLetra));
}

// Mismo umbral que usa el planificador; se repite acá para que el generador no
// dependa de él.
export const MINIMO_ANILLO = 5;

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
function candidatos(grupos, equipo, repertorio = null) {
  return EJERCICIOS_CATALOGO.filter(e =>
    grupos.includes(e.grupo) &&
    (equipo === null || estaDisponible(e, equipo)) &&
    (!repertorio || repertorio.has(e.nombre)));
}

// Elige el repertorio: qué ejercicios distintos puede usar el programa entero.
// Se reparte por grupo en proporción a cuántos slots va a necesitar cada uno,
// para no quedarse sin candidatos en los grupos chicos del catálogo.
function elegirRepertorio(cfg, equipo, slotsPorGrupo, azar) {
  const total = cfg.repertorio === 'auto'
    ? Math.max(20, Math.round(Object.values(slotsPorGrupo).reduce((a, b) => a + b, 0) / 3))
    : cfg.repertorio;
  const slots = Object.values(slotsPorGrupo).reduce((a, b) => a + b, 0) || 1;
  const set = new Set();
  for (const [grupo, n] of Object.entries(slotsPorGrupo)) {
    const pool = EJERCICIOS_CATALOGO
      .filter(e => e.grupo === grupo && (equipo === null || estaDisponible(e, equipo)));
    // mezcla reproducible
    const mezcla = pool.map(e => ({ e, k: azar() })).sort((a, b) => a.k - b.k).map(x => x.e);
    // cuota proporcional, pero nunca menos de lo que hace falta para llenar
    // un circuito sin repetir dentro de él
    const cuota = Math.max(cfg.ejerciciosPorCircuito, Math.round(total * n / slots));
    mezcla.slice(0, cuota).forEach(e => set.add(e.nombre));
  }
  return set;
}

// Grupos de los que vale la pena sacar anclas: los compuestos, donde la
// progresión de carga tiene sentido. Core y HIIT no entran: ahí la variedad
// rinde más que repetir.
const GRUPOS_ANCLA = ['Piernas', 'Glúteos', 'Espalda', 'Pecho', 'Hombros'];
// Un ancla tiene que poder cargarse más con el tiempo, si no no hay qué
// progresar. Peso corporal y banda no sirven de ancla.
const CARGABLE = ['mancuernas', 'kettlebell', 'discos', 'barra', 'barra_z',
                  'maquina_fuerza', 'polea', 'chaleco', 'smith'];

function esCargable(e) {
  return (e.equipo || []).some(g => g.some(k => CARGABLE.includes(k)));
}

// Elige los ejercicios que van a repetirse espaciados. Uno por grupo primero,
// para que el anclaje no se concentre en piernas, y después los que sobren.
export function elegirAnclas(equipo, cuantos, sesgo = {}) {
  const pool = EJERCICIOS_CATALOGO
    .filter(e => GRUPOS_ANCLA.includes(e.grupo))
    .filter(e => esCargable(e))
    .filter(e => equipo === null || estaDisponible(e, equipo));

  const porGrupo = {};
  for (const e of pool) (porGrupo[e.grupo] ||= []).push(e);

  // Los grupos con más sesgo primero, y dentro de cada uno el que más músculos
  // compuestos toca (más nombres en `musculos` = más multiarticular).
  const grupos = GRUPOS_ANCLA
    .filter(g => porGrupo[g]?.length)
    .sort((a, b) => (sesgo[b] || 1) - (sesgo[a] || 1));
  for (const g of grupos) {
    porGrupo[g].sort((a, b) =>
      (b.musculos || '').split(',').length - (a.musculos || '').split(',').length);
  }

  // Dos anclas no pueden ser el mismo movimiento. Sin esto salían "Peso muerto
  // sumo" y "Peso muerto sumo con elevación frontal" como anclas distintas, que
  // desperdicia la mitad del anclaje en repetir el mismo patrón.
  const out = [];
  const familiasUsadas = new Set();
  let vuelta = 0;
  const hayMas = () => grupos.some(g => porGrupo[g].length > vuelta);
  while (out.length < cuantos && hayMas()) {
    for (const g of grupos) {
      if (out.length >= cuantos) break;
      const e = porGrupo[g][vuelta];
      if (!e) continue;
      const f = familiaDe(e.nombre);
      if (familiasUsadas.has(f)) continue;
      familiasUsadas.add(f);
      out.push(e);
    }
    vuelta++;
  }
  return out;
}

export function generarPrograma(configParcial = {}) {
  const cfg = { ...CONFIG_POR_DEFECTO, ...configParcial,
                hiit: { ...CONFIG_POR_DEFECTO.hiit, ...(configParcial.hiit || {}) } };
  const azar = rng(cfg.semilla);
  const avisos = [];

  const plan = esqueleto(cfg);
  const n = plan.length;

  const lugares = cfg.dias.map(d => cfg.lugarPorDia[d]).filter(Boolean);
  const lugarDe = i => lugares.length ? lugares[i % lugares.length] : null;
  const equipoDe = i => { const l = lugarDe(i); return l ? getEquipoDeLugar(l) : null; };

  const familiasPorRutina = Array.from({ length: n }, () => new Set());
  const usos = new Map();

  // Cuántos slots va a pedir cada grupo en todo el programa, para repartir el
  // repertorio en proporción y no quedarse corto en los grupos chicos.
  const slotsPorGrupo = {};
  for (const p of plan) {
    for (const plant of circuitosDe(p.foco, cfg)) {
      const cupo = plant.nombre === 'HIIT' ? cfg.hiit.ejercicios : cfg.ejerciciosPorCircuito;
      for (const g of plant.grupos) slotsPorGrupo[g] = (slotsPorGrupo[g] || 0) + cupo / plant.grupos.length;
    }
  }
  const repertorio = cfg.repertorio ? elegirRepertorio(cfg, equipoDe(0), slotsPorGrupo, rng(cfg.semilla + 1)) : null;

  // Grilla de circuitos vacíos. Hace falta armarla antes de llenar nada para
  // poder colocar los anclas espaciados: si se fuera rutina por rutina, cuando
  // se llega a la última ya no queda dónde ponerlos.
  const grilla = plan.map(p => circuitosDe(p.foco, cfg).map(plant => ({
    plant,
    esHiit: plant.nombre === 'HIIT',
    cupo: plant.nombre === 'HIIT' ? cfg.hiit.ejercicios : cfg.ejerciciosPorCircuito,
    ejercicios: [],
  })));

  const colocar = (i, circ, e) => {
    circ.ejercicios.push(e);
    familiasPorRutina[i].add(familiaDe(e.nombre));
    usos.set(e.nombre, (usos.get(e.nombre) || 0) + 1);
  };
  const entra = (i, circ, e) =>
    circ.ejercicios.length < circ.cupo &&
    !circ.ejercicios.some(x => x.nombre === e.nombre) &&
    circ.plant.grupos.includes(e.grupo) &&
    puedeColocar(e.nombre, i, familiasPorRutina);

  // ── Fase 1: los anclas, lo más espaciados que la adyacencia permita ──
  const anclas = cfg.anclas > 0
    ? elegirAnclas(equipoDe(0), cfg.anclas, cfg.sesgo)
    : [];

  for (const ancla of anclas) {
    repertorio?.add(ancla.nombre);   // un ancla siempre entra al repertorio
    const puestoEn = [];
    for (let v = 0; v < cfg.aparicionesPorAncla; v++) {
      let mejor = null;
      for (let i = 0; i < n; i++) {
        const eq = equipoDe(i);
        if (eq !== null && !estaDisponible(ancla, eq)) continue;
        const circ = grilla[i].find(c => !c.esHiit && entra(i, c, ancla));
        if (!circ) continue;
        // la posición más lejos de donde ya está, medida en el anillo
        const d = puestoEn.length
          ? Math.min(...puestoEn.map(j => Math.min(Math.abs(i - j), n - Math.abs(i - j))))
          : n;
        if (!mejor || d > mejor.d) mejor = { i, circ, d };
      }
      if (!mejor) break;
      colocar(mejor.i, mejor.circ, ancla);
      puestoEn.push(mejor.i);
    }
    if (puestoEn.length < 2 && cfg.aparicionesPorAncla >= 2) {
      avisos.push({
        tipo: 'ancla_sin_lugar', ejercicio: ancla.nombre,
        detalle: `"${ancla.nombre}" no pudo repetirse: no hay lugares libres que no choquen con las rutinas vecinas.`,
      });
    }
  }

  // ── Fase 2: completar, cubriendo primero los mínimos de cada circuito ──
  const rutinas = plan.map((p, i) => {
    const equipo = equipoDe(i);
    const circuitos = grilla[i].map((circ, ci) => {
      const plant = circ.plant;
      const pool = candidatos(plant.grupos, equipo, repertorio);

      // Los mínimos van primero. Sin esto, en ESPALDA·BÍCEPS los ejercicios de
      // brazos —que son muchos más en el catálogo— se llevaban casi todo y
      // espalda quedaba en 5%.
      const pendientes = [];
      for (const [grupo, cuantos] of Object.entries(plant.minimos || {})) {
        const ya = circ.ejercicios.filter(e => e.grupo === grupo).length;
        for (let k = ya; k < cuantos; k++) pendientes.push(grupo);
      }

      let guarda = 0;
      while (circ.ejercicios.length < circ.cupo && guarda++ < 50) {
        const grupoForzado = pendientes.length &&
          circ.ejercicios.length + pendientes.length >= circ.cupo
          ? pendientes[0] : null;

        const viables = pool.filter(e =>
          (!grupoForzado || e.grupo === grupoForzado) && entra(i, circ, e));

        if (!viables.length) {
          if (grupoForzado) { pendientes.shift(); continue; }
          avisos.push({
            tipo: 'sin_candidatos',
            rutina: `${p.foco} ${p.letra}`, circuito: plant.nombre, lugar: lugarDe(i),
            detalle: `No quedaron ejercicios de ${plant.grupos.join('/')} que no choquen con las rutinas vecinas.`,
          });
          break;
        }

        const puntuado = viables.map(e => {
          const base = usos.get(e.nombre) || 0;
          const peso = cfg.sesgo[e.grupo] || 1;
          return { e, score: (base + azar() * 0.5) / peso };
        }).sort((a, b) => a.score - b.score);

        const elegido = puntuado[0].e;
        colocar(i, circ, elegido);
        if (grupoForzado) pendientes.shift();
        else { const k = pendientes.indexOf(elegido.grupo); if (k >= 0) pendientes.splice(k, 1); }
      }

      return {
        numero: ci + 1,
        nombre: plant.nombre,
        ejercicios: circ.ejercicios.map(e => ({
          nombre: e.nombre,
          series: circ.esHiit ? cfg.hiit.series : cfg.series,
          reps: circ.esHiit ? cfg.hiit.reps : cfg.reps,
        })),
      };
    });

    return {
      letra: p.letra, foco: p.foco, lugar: lugarDe(i),
      nombre: `${p.foco === 'press' ? 'Press' : p.foco === 'pull' ? 'Pull' : 'Full'} ${p.letra} — ${cfg.usuario}`,
      circuitos,
    };
  });

  return { rutinas, avisos, anclas: anclas.map(a => a.nombre),
           repertorio: repertorio ? repertorio.size : null, config: cfg };
}

// Igual que `puedeColocarse` de adyacencia.js, pero recibe los Sets ya armados.
function puedeColocar(nombre, i, familiasPorRutina) {
  const fam = familiaDe(nombre);
  if (familiasPorRutina[i].has(fam)) return false;
  return vecinos(i, familiasPorRutina.length).every(j => !familiasPorRutina[j].has(fam));
}

// El calendario NO se arma acá. Repartir rutinas sobre fechas es trabajo de
// planificador.js, y son dos cosas con frecuencias distintas: generar pasa
// cuando aparece un lugar nuevo, planificar pasa cada dos o tres meses y casi
// siempre con rutinas que ya están afinadas. Si van juntos, planificar obliga
// a regenerar.
