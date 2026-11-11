// Catálogo de equipamiento — qué hace falta para hacer cada ejercicio.
//
// Sirve para dos cosas: que el wizard de "lugar nuevo" pregunte qué hay, y que
// el programador de ciclos sepa qué ejercicios puede elegir en ese lugar.
//
// ── Por qué esta taxonomía y no una prestada ──────────────────────────────
// La lista más usada en proyectos abiertos es la de free-exercise-db (12
// valores: body only, bands, barbell, cable, dumbbell, e-z curl bar, exercise
// ball, foam roll, kettlebells, machine, medicine ball, other). Está pensada
// para catálogos de gimnasio: no tiene TRX, chaleco, tobilleras, barra de
// dominadas, banco, cajón, sliders ni ab wheel. Más de la mitad del catálogo
// de CASA caería en "other", que es justo lo que hay que distinguir acá.
//
// Esta lista sale de recorrer los 227 ejercicios propios y quedarse con lo que
// efectivamente aparece. Tres reglas la ordenan:
//
//   1. La unidad que se tilda es LA COSA QUE SE TIENE O NO SE TIENE en ese
//      lugar. No el músculo, no la marca, no el peso. "Mancuernas" es un ítem;
//      "mancuernas de 10 kg" no.
//   2. Dos cosas se separan sólo si separarlas cambia qué ejercicios entran.
//      Banco plano y banco regulable se separan (el press inclinado necesita el
//      segundo). Kettlebell de 8 y de 12 no.
//   3. El espacio también es equipamiento. Las zancadas caminando, el farmer's
//      walk y el bear crawl necesitan metros; los saltos necesitan un piso
//      donde se pueda saltar. En un departamento eso manda más que tener o no
//      una mancuerna, y ninguna taxonomía ajena lo contempla.

export const CATEGORIAS_EQUIPO = [
  {
    key: 'libre',
    label: 'Peso libre',
    icono: 'ph-barbell',
    descripcion: '¿Qué pesos sueltos tenés?',
    items: [
      { key: 'mancuernas',      label: 'Mancuernas' },
      { key: 'barra',           label: 'Barra y discos' },
      { key: 'barra_z',         label: 'Barra Z' },
      { key: 'kettlebell',      label: 'Kettlebells' },
      { key: 'discos',          label: 'Discos sueltos', ayuda: 'Para sostener con las manos: toe touch, rotación, elevaciones' },
      { key: 'balon_medicinal', label: 'Balón medicinal / wall ball' },
    ],
  },
  {
    key: 'maquinas',
    label: 'Máquinas',
    icono: 'ph-gear-six',
    descripcion: '¿Hay máquinas o es todo peso libre?',
    items: [
      { key: 'polea',          label: 'Poleas' },
      { key: 'maquina_fuerza', label: 'Máquinas de fuerza', ayuda: 'Prensa, remo, pecho, aductores, gemelos' },
      { key: 'smith',          label: 'Multipower / Smith' },
      { key: 'cardio',         label: 'Cardio', ayuda: 'Cinta, bici, remo, elíptica' },
    ],
  },
  {
    key: 'soportes',
    label: 'Soportes',
    icono: 'ph-armchair',
    descripcion: '¿Dónde te podés apoyar o colgar?',
    items: [
      { key: 'banco_plano',     label: 'Banco plano' },
      { key: 'banco_regulable', label: 'Banco regulable', ayuda: 'Inclinado o declinado' },
      { key: 'rack',            label: 'Rack o soporte' },
      { key: 'barra_dominadas', label: 'Barra de dominadas' },
      { key: 'paralelas',       label: 'Paralelas o barras bajas', ayuda: 'Fondos, L-sit, plancha en paralelas' },
      { key: 'cajon',           label: 'Cajón, step o silla firme', ayuda: 'Búlgara, fondos, step up, flexiones declinadas' },
    ],
  },
  {
    key: 'funcional',
    label: 'Funcional',
    icono: 'ph-person-simple-run',
    descripcion: 'Lo que entra en un bolso',
    items: [
      { key: 'trx',         label: 'TRX o anillas', ayuda: 'Cualquier sistema de suspensión' },
      { key: 'bandas',      label: 'Bandas elásticas', ayuda: 'De tubo o largas, con manijas' },
      { key: 'loop_band',   label: 'Bandas circulares', ayuda: 'De glúteo, mini bands' },
      { key: 'chaleco',     label: 'Chaleco de peso' },
      { key: 'tobilleras',  label: 'Tobilleras lastradas' },
      { key: 'ab_wheel',    label: 'Rueda abdominal' },
      { key: 'sliders',     label: 'Sliders', ayuda: 'O un trapo sobre piso liso' },
      { key: 'cuerda',      label: 'Cuerda de saltar' },
      { key: 'colchoneta',  label: 'Colchoneta' },
    ],
  },
  {
    key: 'espacio',
    label: 'Espacio',
    icono: 'ph-arrows-out',
    descripcion: 'Esto define más que el equipamiento',
    items: [
      { key: 'espacio_desplazamiento', label: 'Espacio para desplazarte', ayuda: 'Unos 5 metros: zancadas caminando, farmer\'s walk, bear crawl' },
      { key: 'espacio_salto',          label: 'Podés saltar', ayuda: 'Sin vecinos abajo, techo alto' },
      { key: 'exterior',               label: 'Es al aire libre' },
    ],
  },
];

// Índice plano key → { ...item, categoria }
export const EQUIPO_INDEX = Object.fromEntries(
  CATEGORIAS_EQUIPO.flatMap(c => c.items.map(i => [i.key, { ...i, categoria: c.key }]))
);

export const EQUIPO_KEYS = Object.keys(EQUIPO_INDEX);

// ── Presets ────────────────────────────────────────────────────────────────
// 26 tildes es mucho para arrancar de cero. El preset deja el lugar al 80% y
// después se corrige. Es el patrón de Fitbod y MacroFactor, que arrancan de un
// perfil y no de una lista vacía.
export const PRESETS_EQUIPO = [
  {
    key: 'sin_nada', label: 'Sin equipamiento', icono: 'ph-person',
    detalle: 'Sólo peso corporal',
    equipo: ['colchoneta', 'espacio_desplazamiento', 'espacio_salto'],
  },
  {
    key: 'casa_basica', label: 'Casa básica', icono: 'ph-house',
    detalle: 'Bandas, una silla y poco más',
    equipo: ['bandas', 'loop_band', 'cajon', 'colchoneta', 'espacio_desplazamiento', 'espacio_salto'],
  },
  {
    key: 'casa_equipada', label: 'Casa equipada', icono: 'ph-house-line',
    detalle: 'Lo que hay en Casa hoy',
    equipo: ['mancuernas', 'kettlebell', 'discos', 'trx', 'bandas', 'loop_band', 'chaleco',
             'tobilleras', 'ab_wheel', 'cajon', 'colchoneta', 'espacio_desplazamiento', 'espacio_salto'],
  },
  {
    key: 'gimnasio', label: 'Gimnasio completo', icono: 'ph-barbell',
    detalle: 'Máquinas, peso libre y bancos',
    equipo: ['mancuernas', 'barra', 'barra_z', 'kettlebell', 'discos', 'balon_medicinal',
             'polea', 'maquina_fuerza', 'smith', 'cardio', 'banco_plano', 'banco_regulable',
             'rack', 'barra_dominadas', 'cajon', 'trx', 'bandas', 'loop_band', 'cuerda',
             'colchoneta', 'espacio_desplazamiento', 'espacio_salto'],
  },
  {
    key: 'hotel', label: 'Hotel o viaje', icono: 'ph-suitcase',
    detalle: 'Habitación chica, nada de ruido',
    equipo: ['bandas', 'loop_band', 'cajon', 'colchoneta'],
  },
  {
    key: 'exterior', label: 'Al aire libre', icono: 'ph-tree',
    detalle: 'Plaza, playa, parque',
    equipo: ['bandas', 'loop_band', 'barra_dominadas', 'cuerda', 'exterior',
             'espacio_desplazamiento', 'espacio_salto'],
  },
];

// ── Disponibilidad ─────────────────────────────────────────────────────────
// `equipo` de un ejercicio es una lista de GRUPOS, y cada grupo es un O.
//
//   equipo: []                              → peso corporal, siempre disponible
//   equipo: [['kettlebell','mancuernas']]   → alcanza con cualquiera de los dos
//   equipo: [['banco_plano'],['mancuernas']]→ hacen falta los dos
//
// Un ejercicio entra si TODOS sus grupos tienen al menos un ítem disponible.
// Que un ejercicio sin requisitos esté siempre disponible es deliberado: es lo
// que hace GymBook, y evita que un lugar recién creado quede sin nada que ofrecer.

export function estaDisponible(ejercicio, equipoDelLugar) {
  const grupos = ejercicio?.equipo;
  if (!Array.isArray(grupos) || grupos.length === 0) return true;
  const hay = new Set(equipoDelLugar || []);
  return grupos.every(grupo => grupo.some(k => hay.has(k)));
}

// Qué le falta al lugar para poder hacer el ejercicio. Devuelve un grupo por
// requisito incumplido, para poder decir "te falta un banco" en vez de un no
// seco. El wizard y el programador lo usan para explicar las exclusiones.
export function equipoFaltante(ejercicio, equipoDelLugar) {
  const grupos = ejercicio?.equipo;
  if (!Array.isArray(grupos) || grupos.length === 0) return [];
  const hay = new Set(equipoDelLugar || []);
  return grupos.filter(grupo => !grupo.some(k => hay.has(k)));
}

// Texto para humanos: [['kettlebell','mancuernas']] → "kettlebell o mancuernas"
export function describirEquipo(grupos) {
  if (!Array.isArray(grupos) || grupos.length === 0) return 'Sin equipamiento';
  return grupos
    .map(g => g.map(k => EQUIPO_INDEX[k]?.label || k).join(' o '))
    .join(' + ');
}
