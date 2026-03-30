// Catálogo completo de ejercicios con grupos musculares, descripciones y tipo

export const GRUPOS_MUSCULARES = [
  'Piernas', 'Core', 'Pecho', 'Espalda', 'Hombros', 'Brazos', 'Glúteos', 'HIIT'
];

export const EJERCICIOS_CATALOGO = [
  // ── PIERNAS ─────────────────────────────────────────────────────────────────
  {
    nombre: 'Sentadilla con barra',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    descripcion: 'Parado con la barra apoyada en los trapecios, pies al ancho de hombros. Flexioná las rodillas y bajá las caderas hasta paralelo al suelo. Mantené el torso erguido, rodillas alineadas con los pies y talones apoyados. Empujá hacia arriba para volver.'
  },
  {
    nombre: 'Peso muerto rumano',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    descripcion: 'De pie con la barra al frente, manos al ancho de hombros. Inclinando el torso hacia adelante manteniendo las piernas casi rectas (ligera flexión), bajá la barra por las piernas hasta sentir estiramiento en femorales. Volvé con la cadera, no la espalda.'
  },
  {
    nombre: 'Peso muerto con barra',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    descripcion: 'Con la barra en el piso y pies a ancho de caderas, agachate con la espalda recta, tomá la barra. Empujá el suelo con los pies y extendé las caderas hasta estar parado. La barra sube pegada a las piernas durante todo el movimiento.'
  },
  {
    nombre: 'Zancadas con mancuernas',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    descripcion: 'De pie con una mancuerna en cada mano, dá un paso hacia adelante y bajá la rodilla trasera hacia el piso sin apoyarla. Volvé al centro y alterná las piernas. Mantené el torso recto y la rodilla delantera a 90°.'
  },
  {
    nombre: 'Sumo con barra',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    descripcion: 'Pies más separados que el ancho de hombros, puntas hacia afuera ~45°. Con la barra frente al cuerpo, hacé una sentadilla manteniendo la espalda recta y pecho erguido. Los codos van hacia adentro rozando las rodillas al bajar.'
  },
  {
    nombre: 'Sentadilla sumo',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    descripcion: 'Con pies muy separados y puntas hacia afuera, bajá las caderas lentamente hasta paralelo o más. Rodillas siguen la dirección de los pies. Ideal para activar glúteos y aductores. Se puede hacer con peso corporal o con mancuerna sostenida verticalmente.'
  },
  {
    nombre: 'Sumo con rusas',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    descripcion: 'Con kettlebells en cada mano y posición sumo (pies separados, puntas afuera), hacé sentadillas profundas manteniendo las campanas entre las piernas. Ideal para activar glúteos medios y aductores junto con cuádriceps.'
  },
  // ── CORE ────────────────────────────────────────────────────────────────────
  {
    nombre: 'Plancha',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Apoyado en manos y pies (o antebrazos y pies), mantenés el cuerpo como una tabla recta. El core debe estar activado, sin dejar que la cadera suba o baje. Respirá continuamente. Es el ejercicio base de estabilidad de tronco.'
  },
  {
    nombre: 'Plancha en codos',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Igual que la plancha estándar pero apoyado en los antebrazos en lugar de las palmas. Mayor activación del core al reducir el brazo de palanca. Codos directamente debajo de los hombros, espalda plana.'
  },
  {
    nombre: 'Dead bug',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Acostado boca arriba, brazos extendidos al techo y rodillas a 90°. Simultáneamente bajá el brazo derecho al suelo y extendé la pierna izquierda sin tocar el piso. Volvé y alternás. Lumbar pegada al suelo en todo momento.'
  },
  {
    nombre: 'Pallof press',
    grupo: 'Core', tipo: 'maquina', usaPeso: true,
    descripcion: 'De pie de lado a la polea (o banda), sujetá el cable a la altura del pecho con ambas manos. Extendé los brazos al frente resistiendo la rotación, luego volvé. El objetivo es evitar que el torso gire. Trabajás la anti-rotación del core.'
  },
  {
    nombre: 'Espinales con disco',
    grupo: 'Core', tipo: 'maquina', usaPeso: true,
    descripcion: 'Acostado boca abajo con un disco sostenido contra el pecho o detrás de la cabeza. Elevá el torso contrayendo la espalda baja y bajá de forma controlada. Evitá hiperextender la columna al subir. Trabaja erectores espinales.'
  },
  {
    nombre: 'Complex',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Secuencia encadenada de movimientos sin pausa: generalmente incluye plancha, mountain climbers y burpee. La combinación varía según la programación. Trabaja coordinación, resistencia y estabilidad de todo el tronco.'
  },
  // ── PECHO ───────────────────────────────────────────────────────────────────
  {
    nombre: 'Press de pecho',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    descripcion: 'Sentado en la máquina de press de pecho, agarra las manijas al ancho de hombros o más. Empujá hacia adelante extendiendo los codos completamente y volvé lento. Pies apoyados, espalda pegada al respaldo. Trabaja pectoral mayor y anterior del deltoides.'
  },
  {
    nombre: 'Fondos de pecho suspendido en maquina',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    descripcion: 'En la máquina de fondos asistida, sujetá las asas y bajá el cuerpo flexionando los codos hacia atrás y afuera (ligera inclinación del torso hacia adelante). Subí extendiendo. Cuanto más te inclinás, más trabajás el pecho versus los tríceps.'
  },
  {
    nombre: 'Press inclinado con mancuernas',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    descripcion: 'Recostado en banco a 30-45°, una mancuerna en cada mano al ancho de hombros. Bajá controlado hasta pecho y empujá hacia arriba. El ángulo inclinado focaliza la porción clavicular del pectoral. Mantené los codos a ~45° del torso.'
  },
  {
    nombre: 'Pecho con polea doble',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    descripcion: 'De pie entre dos poleas altas, tomá un cable en cada mano. Con los brazos ligeramente flexionados, unilos frente al pecho en un arco amplio (como si abrazaras). Volvé controlado resistiendo la apertura. Trabaja el pectoral en contracción completa.'
  },
  {
    nombre: 'TRX chest press',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    descripcion: 'Con las correas del TRX ajustadas a altura de pecho, sujetá las asas y posicioná el cuerpo inclinado hacia adelante. Bajá el cuerpo flexionando los codos como en una flexión, volvé empujando. Más inclinación = más difícil. Trabaja estabilidad + pectoral.'
  },
  {
    nombre: 'Banda press de pecho',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    descripcion: 'Con una banda de resistencia pasada por la espalda y sujetada en cada mano, empujá hacia adelante extendiendo los brazos. Resistencia progresiva: aumenta al final del movimiento. Ideal como complemento liviano de alto volumen.'
  },
  {
    nombre: 'Flexiones diamante',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    descripcion: 'Flexión estándar pero con las manos juntas formando un triángulo (diamante) debajo del pecho. Esta posición cierra los codos junto al cuerpo, transfiriendo el trabajo del pecho a los tríceps. Ideal para activar la cabeza larga del tríceps.'
  },
  // ── ESPALDA ─────────────────────────────────────────────────────────────────
  {
    nombre: 'Dominadas abiertas',
    grupo: 'Espalda', tipo: 'maquina', usaPeso: true,
    descripcion: 'Colgado de la barra con agarre prono y manos más separadas que los hombros. Empujá los codos hacia abajo y atrás hasta que el mentón supere la barra. Bajá controlado. Activa principalmente el dorsal ancho y da amplitud a la espalda.'
  },
  {
    nombre: 'Dominada en maquina ascensor',
    grupo: 'Espalda', tipo: 'maquina', usaPeso: true,
    descripcion: 'En la máquina asistida de dominadas, arrodillate sobre la plataforma y agarrá la barra. El contrapeso te ayuda a subir según el peso seleccionado. Misma técnica que la dominada libre: empuja codos abajo, pecho al frente. Ideal para progresar hacia dominadas sin asistencia.'
  },
  {
    nombre: 'Remo en maquina',
    grupo: 'Espalda', tipo: 'maquina', usaPeso: true,
    descripcion: 'Sentado frente a la máquina de remo, pecho apoyado en el pad (si lo tiene). Tirá las manijas hacia el abdomen bajo llevando los codos hacia atrás. Al final de la contracción, apretá los omóplatos. Trabaja romboides, trapecio medio e inferior, y bíceps.'
  },
  {
    nombre: 'Remo en maquina separado',
    grupo: 'Espalda', tipo: 'maquina', usaPeso: true,
    descripcion: 'Similar al remo en máquina pero con agarre más amplio y codos hacia afuera en lugar de pegados al cuerpo. Focaliza más el trapecio medio y deltoides posterior. Las palmas pueden mirar hacia abajo (prono) para mayor activación de la parte media de la espalda.'
  },
  {
    nombre: 'Remo alto en polea',
    grupo: 'Espalda', tipo: 'maquina', usaPeso: true,
    descripcion: 'De pie frente a la polea alta, tirá el cable hacia la cara/cuello con codos hacia afuera (a la altura de los hombros). Activa el manguito rotador, deltoides posterior y trapecio. También llamado face pull o high row. Crucial para salud del hombro.'
  },
  {
    nombre: 'Jalón al pecho',
    grupo: 'Espalda', tipo: 'maquina', usaPeso: true,
    descripcion: 'Sentado en la máquina de jalón, agarrá la barra con agarre prono más ancho que los hombros. Tirá la barra hacia el pecho superior inclinando ligeramente el torso hacia atrás. Sentí que los codos van hacia abajo y atrás. Trabaja el dorsal ancho en su porción superior.'
  },
  // ── HOMBROS ─────────────────────────────────────────────────────────────────
  {
    nombre: 'Press militar con mancuernas',
    grupo: 'Hombros', tipo: 'maquina', usaPeso: true,
    descripcion: 'Sentado o de pie, con mancuernas a la altura de los hombros y codos a 90°. Empujá hacia arriba hasta extender los brazos sin bloquear los codos. Bajá controlado. Trabaja el deltoides anterior y lateral, y de manera secundaria tríceps y trapecios.'
  },
  {
    nombre: 'Vuelos laterales',
    grupo: 'Hombros', tipo: 'maquina', usaPeso: true,
    descripcion: 'De pie o sentado con mancuernas a los costados, levantá los brazos lateralmente hasta la altura de los hombros con una leve flexión en los codos (no completamente rectos). Bajá lento. Trabaja exclusivamente el deltoides lateral. Evitá el balanceo del torso.'
  },
  {
    nombre: 'Empuje de hombros con barra en banco',
    grupo: 'Hombros', tipo: 'maquina', usaPeso: true,
    descripcion: 'Sentado en banco con respaldo, barra apoyada en el pecho. Empujá hacia arriba hasta extensión y bajá controlado. Similar al press militar pero la barra permite mayor carga. Trabaja deltoides anterior con participación de tríceps y trapecios.'
  },
  {
    nombre: 'Face pulls',
    grupo: 'Hombros', tipo: 'maquina', usaPeso: true,
    descripcion: 'De pie frente a polea alta con cuerda, tirá hacia la cara abriendo los codos hacia afuera y hacia arriba. Al final las manos quedan a los lados de la cabeza, como si mostraras los bíceps. Trabaja deltoides posterior, manguito rotador y retractores de escápula.'
  },
  {
    nombre: 'Elevaciones de hombro adelante',
    grupo: 'Hombros', tipo: 'maquina', usaPeso: true,
    descripcion: 'De pie con mancuernas frente al cuerpo, levantá los brazos hacia adelante hasta la altura de los hombros (o polea baja). Bajá controlado. Trabaja el deltoides anterior. Puede hacerse alternado o simultáneo, con palmas hacia abajo o hacia dentro.'
  },
  {
    nombre: 'Elevaciones de hombro hacia arriba',
    grupo: 'Hombros', tipo: 'maquina', usaPeso: true,
    descripcion: 'Con mancuernas o barra, elevá los hombros hacia las orejas (encogimiento) sin doblar los codos. Mantené un segundo arriba y bajá lento. Trabaja trapecios superiores. Útil para equilibrar la musculatura del cuello y parte alta de la espalda.'
  },
  // ── BRAZOS ──────────────────────────────────────────────────────────────────
  {
    nombre: 'Curl de bíceps con barra',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    descripcion: 'De pie con la barra en agarre supino, codos pegados al cuerpo. Flexioná los codos subiendo la barra hacia el pecho sin mover los hombros. Bajá lento controlando la extensión. Trabaja cabeza larga y corta del bíceps braquial.'
  },
  {
    nombre: 'Curl de bíceps con mancuerna',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    descripcion: 'De pie o sentado, una mancuerna en cada mano en agarre supino. Flexioná alternando o simultáneamente manteniendo los codos fijos al costado. Permite rotar la muñeca al subir para mayor contracción del bíceps. Bajá controlado.'
  },
  {
    nombre: 'Curl martillo',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    descripcion: 'Igual que el curl con mancuernas pero el agarre es neutro (palmas mirando hacia adentro durante todo el recorrido, como si sostuvieras un martillo). Trabaja más el braquial y braquiorradial, y la parte externa del bíceps.'
  },
  {
    nombre: 'Biceps en banco',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    descripcion: 'Sentado en banco inclinado (~45°), brazos colgando atrás del cuerpo con mancuernas. Flexioná los codos subiendo las mancuernas. La posición inclinada estira la cabeza larga del bíceps al inicio, aumentando el rango de activación. Excelente para peak de bíceps.'
  },
  {
    nombre: 'Biceps alto en polea',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    descripcion: 'De pie frente a una polea alta (o a los costados con poleas), con el brazo elevado a la altura del hombro, flexioná el codo llevando la mano hacia la oreja. Trabaja el bíceps en posición acortada (ángulo de 90° del hombro). Alta activación de la cabeza corta.'
  },
  {
    nombre: 'Triceps con polea',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    descripcion: 'De pie frente a la polea alta con barra recta o cuerda, codos pegados al cuerpo. Extendé los codos empujando hacia abajo hasta extensión completa y volvé lento. Codos fijos al cuerpo en todo momento. Trabaja los tres vientres del tríceps con especial énfasis en el lateral.'
  },
  {
    nombre: 'Extensión de triceps sobre cabeza',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    descripcion: 'Sentado o de pie, sostén una mancuerna o barra por detrás de la cabeza con los codos apuntando al techo. Extendé los codos hasta arriba y bajá controlado. Trabaja principalmente la cabeza larga del tríceps. Mantené los codos cerca de las orejas sin abrirlos.'
  },
  {
    nombre: 'Banda triceps pushdown',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: false,
    descripcion: 'Con una banda de resistencia anclada arriba, empujá hacia abajo extendiendo los codos completamente. Similar al triceps en polea pero con banda. Resistencia progresiva. Útil como finalizador de alto volumen para mantener tensión en todo el rango.'
  },
  {
    nombre: 'Banda curl biceps',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: false,
    descripcion: 'Parado sobre la banda con agarre supino en cada extremo, flexioná los codos subiendo los puños hacia los hombros. La resistencia aumenta al final del movimiento. Permite trabajar sin mancuernas y en cualquier entorno. Alto volumen con bajo impacto articular.'
  },
  // ── GLÚTEOS ─────────────────────────────────────────────────────────────────
  {
    nombre: 'Empuje de cadera en cajon',
    grupo: 'Glúteos', tipo: 'maquina', usaPeso: true,
    descripcion: 'Con la espalda apoyada en un cajón o banco y una barra/mancuernas sobre las caderas, empujá la cadera hacia arriba extendiendo la cadera. Mantené las rodillas a 90° y apretá los glúteos al tope. Bajá sin tocar el piso. También conocido como hip thrust.'
  },
  {
    nombre: 'Gluteos patada en polea',
    grupo: 'Glúteos', tipo: 'maquina', usaPeso: true,
    descripcion: 'Parada frente a la polea baja con el tobillo enganchado al cable, empujá la pierna hacia atrás y arriba extendiendo la cadera. Mantené el torso levemente inclinado y la pelvis estable. Bajá controlado. Trabaja glúteo mayor en aislamiento.'
  },
  {
    nombre: 'Aductores en maquina',
    grupo: 'Glúteos', tipo: 'maquina', usaPeso: true,
    descripcion: 'Sentada en la máquina de aductores con los pads en la cara interna de los muslos, cerrá las piernas contra la resistencia. Bajá lento resistiendo la apertura. Trabaja aductores (grácil, pectíneo, aductor largo/corto). Complementa el trabajo de glúteos y caderas.'
  },
  // ── HIIT ────────────────────────────────────────────────────────────────────
  {
    nombre: 'Pasadas de velocidad',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    descripcion: 'Carreras de alta intensidad durante 60 segundos de trabajo seguidos de 60 segundos de descanso, por 5 rondas. La distancia o el esfuerzo deben ser máximos en cada repetición. Trabaja sistema cardiovascular, velocidad de reacción y resistencia anaeróbica.'
  },
];

// Helper: get all exercises for a given group
export function getEjerciciosByGrupo(grupo) {
  return EJERCICIOS_CATALOGO.filter(e => e.grupo === grupo);
}

// Helper: find exercise by name
export function findEjercicio(nombre) {
  const n = nombre?.toLowerCase() || '';
  return EJERCICIOS_CATALOGO.find(e => e.nombre.toLowerCase() === n) || null;
}

// Helper: search exercises
export function searchEjercicios(query, tipoFilter = 'todos') {
  const q = (query || '').toLowerCase();
  return EJERCICIOS_CATALOGO.filter(e => {
    const matchQuery = !q || e.nombre.toLowerCase().includes(q) || e.grupo.toLowerCase().includes(q);
    const matchTipo = tipoFilter === 'todos' || e.tipo === tipoFilter;
    return matchQuery && matchTipo;
  });
}
