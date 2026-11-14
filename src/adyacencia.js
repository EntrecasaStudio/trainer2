// La regla de adyacencia, como código.
//
// Las rutinas de un lugar rotan en orden fijo y CÍCLICO:
//
//   Press A → Pull A → Press B → Pull B → … → Press J → Pull J → (vuelve a Press A)
//
// Un ejercicio colocado en una rutina no puede volver a aparecer en las cuatro
// vecinas: las de distancia 1 (la del tipo opuesto a cada lado) y las de
// distancia 2 (las del mismo tipo salteando una). Si aparece, se repite al día
// siguiente o al subsiguiente.
//
// Hasta ahora esto se verificaba a mano con un script cada vez. Acá queda como
// función, para auditar lo que ya existe y para que el generador no pueda
// construir un programa que la viole.

// ── Familias ───────────────────────────────────────────────────────────────
//
// Dos ejercicios con nombres distintos pueden ser el mismo movimiento con otro
// implemento. Normalizar el nombre no alcanza: "Extensión de tríceps con banda"
// y "Banda triceps pushdown" quedan en "extension de triceps" y "triceps
// pushdown", que no se parecen como texto aunque sean lo mismo.
//
// Así que la equivalencia se declara. La lista es corta a propósito: sólo los
// pares que realmente chocan en estas rutinas. Es una lista para crecer, no un
// intento de clasificar los 227 ejercicios.
export const FAMILIAS = {
  // empuje de tríceps hacia abajo contra resistencia elástica
  'Extensión de tríceps con banda': 'triceps_pushdown',
  'Banda triceps pushdown': 'triceps_pushdown',
  'Triceps con polea': 'triceps_pushdown',

  // tríceps sobre la cabeza
  'Extensión de triceps sobre cabeza': 'triceps_overhead',
  'French press': 'triceps_overhead',
  'French press en puente de glúteos': 'triceps_overhead',

  // bisagra de cadera a una pierna
  'Peso muerto a una pierna': 'hinge_unilateral',
  'Peso muerto a una pierna con remo': 'hinge_unilateral',
  'Peso muerto a una pierna con rodilla arriba': 'hinge_unilateral',

  // empuje de cadera en el piso
  'Empuje de cadera': 'hip_thrust',
  'Empuje de cadera en piso con peso': 'hip_thrust',
  'Empuje de cadera en cajon': 'hip_thrust',
  'Hip thrust a una pierna': 'hip_thrust',

  // abducción de cadera contra banda, de pie o sentada
  'Loop band abducción parada': 'abduccion_banda',
  'Abducción sentada con banda': 'abduccion_banda',
  'Standing weighted hip abduction': 'abduccion_banda',
  'Abducción con pausa': 'abduccion_banda',

  // patada / extensión de cadera en cuadrupedia
  'Patada de glúteo con tobillera': 'patada_gluteo',
  'Extensión de cadera en 4 puntos': 'patada_gluteo',
  'Perro orinando con banda': 'patada_gluteo',
  'Patada de glúteo a perro orinando con banda': 'patada_gluteo',

  // curl de isquios
  'Curl de isquios con TRX': 'curl_isquios',
  'Curl de isquios con TRX a una pierna': 'curl_isquios',
  'Curl de isquios deslizante': 'curl_isquios',
  'Curl femoral': 'curl_isquios',

  // curl de bíceps con agarre neutro
  'Bíceps curl martillo': 'curl_martillo',
  'Zancada reversa con curl martillo': 'curl_martillo',

  // plancha con desplazamiento de los brazos
  'Plancha commando': 'plancha_dinamica',
  'Plancha con elevación alternada': 'plancha_dinamica',
  'Plancha toque de hombro': 'plancha_dinamica',
  'Flexión con toque de hombro': 'plancha_dinamica',
};

// La familia de un ejercicio, o su propio nombre si no declaró ninguna.
export function familiaDe(nombre) {
  return FAMILIAS[nombre] || nombre;
}

// ── Orden de rotación ──────────────────────────────────────────────────────

// Saca la letra del nombre: "Casa Press G — Nat" → "G".
export function letraDe(rutina) {
  const m = /\b(?:press|pull)\s+([a-z])\b/i.exec(rutina?.nombre || '');
  return m ? m[1].toUpperCase() : null;
}

export function focoDe(rutina) {
  if (rutina?.foco === 'press' || rutina?.foco === 'pull') return rutina.foco;
  return /\bpull\b/i.test(rutina?.nombre || '') ? 'pull'
       : /\bpress\b/i.test(rutina?.nombre || '') ? 'press' : null;
}

// Press A, Pull A, Press B, Pull B, … Las que no encajan en el esquema quedan
// afuera: no participan de la rotación y no tiene sentido medirles adyacencia.
export function ordenRotacion(rutinas) {
  return rutinas
    .filter(r => letraDe(r) && focoDe(r))
    .sort((a, b) => {
      const la = letraDe(a), lb = letraDe(b);
      if (la !== lb) return la < lb ? -1 : 1;
      return focoDe(a) === 'press' ? -1 : 1;
    });
}

// Los cuatro índices vecinos, en un anillo. Con menos de 5 rutinas el anillo es
// tan corto que los vecinos se superponen; se devuelven sin repetir y sin el
// propio índice.
export function vecinos(i, largo) {
  if (largo < 2) return [];
  const crudos = [i - 2, i - 1, i + 1, i + 2].map(j => ((j % largo) + largo) % largo);
  return [...new Set(crudos)].filter(j => j !== i);
}

// ── Lectura de rutinas ─────────────────────────────────────────────────────

// [{ nombre, ci, ei }] de todos los ejercicios de una rutina.
export function slotsDe(rutina) {
  const out = [];
  (rutina?.circuitos || []).forEach((c, ci) => {
    (c.ejercicios || []).forEach((e, ei) => out.push({ nombre: e.nombre, ci, ei, circuito: c.nombre }));
  });
  return out;
}

// ── Auditoría ──────────────────────────────────────────────────────────────

// Recorre la rotación y devuelve un choque por cada ejercicio que aparece en
// una rutina y también en alguna de sus cuatro vecinas.
//
// Cada choque se reporta UNA vez, desde la rutina de índice menor, para no
// listar A→B y B→A como dos problemas distintos.
export function auditarAdyacencia(rutinas) {
  const orden = ordenRotacion(rutinas);
  const n = orden.length;
  const porRutina = orden.map(r => {
    const m = new Map();   // familia → [nombres...]
    for (const s of slotsDe(r)) {
      const f = familiaDe(s.nombre);
      if (!m.has(f)) m.set(f, []);
      m.get(f).push(s);
    }
    return m;
  });

  const choques = [];
  for (let i = 0; i < n; i++) {
    for (const j of vecinos(i, n)) {
      if (j < i) continue;                       // ya reportado desde el menor
      const dist = Math.min(Math.abs(i - j), n - Math.abs(i - j));
      for (const [fam, aqui] of porRutina[i]) {
        const alla = porRutina[j].get(fam);
        if (!alla) continue;
        choques.push({
          familia: fam,
          exacto: aqui[0].nombre === alla[0].nombre,
          a: { rutina: orden[i].nombre, nombre: aqui[0].nombre, circuito: aqui[0].circuito, ci: aqui[0].ci },
          b: { rutina: orden[j].nombre, nombre: alla[0].nombre, circuito: alla[0].circuito, ci: alla[0].ci },
          distancia: dist,
        });
      }
    }
  }
  return { orden: orden.map(r => r.nombre), choques };
}

// ¿Se puede poner `nombre` en la rutina de índice `i`? Es lo que usa el
// generador antes de colocar cada ejercicio.
export function puedeColocarse(nombre, i, familiasPorRutina) {
  const fam = familiaDe(nombre);
  const n = familiasPorRutina.length;
  if (familiasPorRutina[i]?.has(fam)) return false;          // ya está en esta
  return vecinos(i, n).every(j => !familiasPorRutina[j]?.has(fam));
}
