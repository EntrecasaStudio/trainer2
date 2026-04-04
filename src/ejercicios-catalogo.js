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
  {
    nombre: 'Prensa de piernas',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    descripcion: 'Sentado en la máquina de prensa con los pies al ancho de hombros en la plataforma. Bajá la plataforma flexionando las rodillas hasta 90° y empujá hacia arriba sin bloquear los codos de las piernas. Trabaja cuádriceps, glúteos y femorales con menor carga en la espalda baja.'
  },
  {
    nombre: 'Extensión de cuádriceps',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    descripcion: 'Sentado en la máquina con el rodillo apoyado en los tobillos y las rodillas alineadas con el eje de rotación. Extendé las piernas hasta arriba y bajá controlado. Aislamiento puro de cuádriceps. Evitá hiperextender la rodilla al final del movimiento.'
  },
  {
    nombre: 'Curl femoral',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    descripcion: 'Acostado boca abajo en la máquina con el rodillo detrás de los tobillos. Flexioná las rodillas llevando los talones hacia los glúteos y bajá controlado. Aislamiento de isquiotibiales. Mantené las caderas pegadas al banco durante todo el recorrido.'
  },
  {
    nombre: 'Sentadilla búlgara',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    descripcion: 'De pie con un pie apoyado en un banco detrás. Con mancuernas en las manos, bajá la rodilla trasera hacia el piso manteniendo el torso recto. La rodilla delantera no pasa la punta del pie. Trabaja cuádriceps, glúteos y estabilidad de cadera unilateral.'
  },
  {
    nombre: 'Gemelos en máquina',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    descripcion: 'De pie en la máquina de gemelos con los hombros bajo las almohadillas y las puntas de los pies en el borde. Subí elevando los talones lo más alto posible y bajá lentamente estirando bien. Trabaja gastrocnemio y sóleo. Mantené las rodillas levemente flexionadas.'
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
  {
    nombre: 'Plancha lateral',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Apoyado sobre un antebrazo y el pie lateral, mantenés el cuerpo recto como tabla con la cadera elevada. Activá oblicuos y glúteo medio para no dejar caer la cadera. Aguantá el tiempo indicado por lado. Ideal para estabilidad lateral del tronco.'
  },
  {
    nombre: 'Crunch en polea',
    grupo: 'Core', tipo: 'maquina', usaPeso: true,
    descripcion: 'Arrodillado frente a la polea alta con la cuerda detrás de la cabeza, flexioná el torso hacia abajo contrayendo los abdominales. Volvé controlado sin soltar la tensión. El peso extra permite progresión de fuerza en los abdominales.'
  },
  // ── PECHO ───────────────────────────────────────────────────────────────────
  {
    nombre: 'Press de pecho',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    descripcion: 'Sentado en la máquina de press de pecho, agarra las manijas al ancho de hombros o más. Empujá hacia adelante extendiendo los codos completamente y volvé lento. Pies apoyados, espalda pegada al respaldo. Trabaja pectoral mayor y anterior del deltoides.'
  },
  {
    nombre: 'Press Hammer',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    descripcion: 'Sentado en la máquina Hammer Strength con agarre neutro o prono, empujá las palancas hacia adelante extendiendo los codos. Cada brazo trabaja de forma independiente, lo que permite corregir asimetrías. Movimiento guiado que permite cargar más peso con seguridad. Trabaja pectoral mayor, deltoides anterior y tríceps.'
  },
  {
    nombre: 'Press de banca con barra',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    descripcion: 'Acostado en banco plano, desenganchá la barra con agarre al ancho de hombros o más. Bajá la barra controlada hasta el pecho medio y empujá hacia arriba. Requiere estabilización de hombros y core. Trabaja pectoral mayor, deltoides anterior y tríceps con máxima demanda de estabilidad.'
  },
  {
    nombre: 'Press inclinado en máquina',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    descripcion: 'Sentado en la máquina de press inclinado, empujá las palancas hacia arriba y adelante siguiendo la trayectoria guiada. El ángulo inclinado focaliza la porción clavicular del pectoral. Movimiento guiado que permite concentrarse en la contracción sin preocuparse por la estabilización.'
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
  {
    nombre: 'Aperturas con mancuernas',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    descripcion: 'Acostado en banco plano con una mancuerna en cada mano, brazos extendidos arriba. Abrí los brazos lateralmente con los codos levemente flexionados hasta sentir estiramiento en el pecho. Volvé cerrando el arco. Trabaja la porción esternal del pectoral en rango completo.'
  },
  {
    nombre: 'Pullover con mancuerna',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    descripcion: 'Acostado en banco, sostén una mancuerna con ambas manos sobre el pecho. Bajá la mancuerna por detrás de la cabeza con los brazos casi extendidos hasta sentir el estiramiento. Volvé contrayendo pecho y dorsal. Trabaja pectoral, serrato y dorsal ancho.'
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
  {
    nombre: 'Remo con mancuerna',
    grupo: 'Espalda', tipo: 'maquina', usaPeso: true,
    descripcion: 'Con una rodilla y mano apoyadas en el banco, el otro brazo sostiene la mancuerna. Tirá la mancuerna hacia la cadera llevando el codo atrás y arriba. Bajá controlado. Trabaja dorsal ancho, romboides y bíceps de forma unilateral, permitiendo corregir asimetrías.'
  },
  {
    nombre: 'Pulldown agarre cerrado',
    grupo: 'Espalda', tipo: 'maquina', usaPeso: true,
    descripcion: 'Sentado en la máquina de jalón con agarre en V cerrado (palmas enfrentadas). Tirá hacia el pecho manteniendo los codos pegados al cuerpo. Trabaja la porción inferior del dorsal ancho con mayor participación del bíceps y braquial.'
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
  {
    nombre: 'Arnold press',
    grupo: 'Hombros', tipo: 'maquina', usaPeso: true,
    descripcion: 'Sentado con mancuernas al nivel del mentón y palmas hacia vos. Al empujar hacia arriba, rotá las muñecas hasta que las palmas miren hacia afuera al final. Bajá invirtiendo la rotación. Trabaja las tres cabezas del deltoides en un solo movimiento.'
  },
  {
    nombre: 'Encogimientos con mancuernas',
    grupo: 'Hombros', tipo: 'maquina', usaPeso: true,
    descripcion: 'De pie con mancuernas pesadas a los lados, elevá los hombros hacia las orejas sin doblar los codos. Mantené arriba 1-2 segundos y bajá controlado. Trabaja trapecios superiores. Podés inclinar levemente el torso para mayor activación del trapecio medio.'
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
    nombre: 'French press',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    descripcion: 'Acostado en banco plano con barra o mancuernas, brazos extendidos vertical. Flexioná los codos bajando el peso hacia la frente o detrás de la cabeza, manteniendo los codos fijos apuntando al techo. Extendé volviendo a la posición inicial. Trabaja la cabeza larga del tríceps con máximo estiramiento.'
  },
  {
    nombre: 'Banda curl biceps',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: false,
    descripcion: 'Parado sobre la banda con agarre supino en cada extremo, flexioná los codos subiendo los puños hacia los hombros. La resistencia aumenta al final del movimiento. Permite trabajar sin mancuernas y en cualquier entorno. Alto volumen con bajo impacto articular.'
  },
  {
    nombre: 'Curl concentrado',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    descripcion: 'Sentado con el codo apoyado en la cara interna del muslo, una mancuerna en la mano. Flexioná el brazo subiendo la mancuerna hacia el hombro y bajá controlado. El apoyo en el muslo elimina impulso y aísla completamente el bíceps. Ideal para contracción pico.'
  },
  {
    nombre: 'Fondos en banco',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: false,
    descripcion: 'Con las manos apoyadas en un banco detrás y los pies en el suelo, bajá el cuerpo flexionando los codos hasta 90° y subí empujando. Codos apuntan hacia atrás, no hacia afuera. Trabaja tríceps, deltoides anterior y pectorales. Se puede agregar peso en las piernas.'
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
  {
    nombre: 'Abductores en maquina',
    grupo: 'Glúteos', tipo: 'maquina', usaPeso: true,
    descripcion: 'Sentada en la máquina con los pads en la cara externa de los muslos, abrí las piernas contra la resistencia. Volvé controlado. Trabaja glúteo medio y menor, claves para la estabilidad de cadera y la forma del glúteo lateral.'
  },
  {
    nombre: 'Peso muerto sumo',
    grupo: 'Glúteos', tipo: 'maquina', usaPeso: true,
    descripcion: 'Con pies muy separados y puntas afuera, agarrá la barra entre las piernas con brazos rectos. Levantá extendiendo las caderas, mantené la espalda recta. Activa glúteos y aductores más que el peso muerto convencional. Excelente para fortalecer la cadena posterior.'
  },
  // ── HIIT / FUNCIONAL ────────────────────────────────────────────────────────
  {
    nombre: 'Pasadas de velocidad',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    descripcion: 'Carreras de máxima intensidad en distancias cortas (40-60m). Salir explosivamente, mantener la velocidad y desacelerar al final. Descansar caminando de vuelta. Trabaja potencia de piernas, sistema cardiovascular y resistencia anaeróbica.'
  },
  {
    nombre: 'Burpees',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    descripcion: 'Desde parado, agacharse y apoyar las manos en el piso, saltar los pies hacia atrás a posición de plancha, hacer una flexión, saltar los pies hacia adelante y saltar verticalmente con los brazos arriba. Trabaja todo el cuerpo: pecho, piernas, core y cardio.'
  },
  {
    nombre: 'Saltos al cajón',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    descripcion: 'Parado frente a un cajón pliométrico, flexionar rodillas y saltar explosivamente aterrizando con ambos pies arriba del cajón. Pararse completamente y bajar con control. Trabaja potencia de piernas, glúteos y coordinación.'
  },
  {
    nombre: 'Saltos laterales',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    descripcion: 'De pie con los pies juntos, saltar lateralmente de un lado a otro sobre una línea o valla baja. Aterrizar suave con las rodillas semiflexionadas. Trabaja agilidad, estabilidad de tobillos y potencia lateral.'
  },
  {
    nombre: 'Sentadilla con salto',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    descripcion: 'Realizar una sentadilla profunda y al subir explotar en un salto vertical con los brazos arriba. Aterrizar suave y volver directo a la sentadilla. Trabaja cuádriceps, glúteos y potencia explosiva.'
  },
  {
    nombre: 'Estocada con salto',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    descripcion: 'Desde posición de zancada, saltar y alternar las piernas en el aire, aterrizando en zancada con la pierna contraria adelante. Mantener el torso erguido. Trabaja cuádriceps, glúteos, coordinación y potencia.'
  },
  {
    nombre: 'Jumping jacks',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    descripcion: 'De pie con los pies juntos y brazos al costado, saltar abriendo las piernas al ancho de hombros mientras subís los brazos por arriba de la cabeza. Volver a la posición inicial saltando. Ejercicio cardiovascular completo.'
  },
  {
    nombre: 'Caminata a plancha',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    descripcion: 'De pie, flexionar la cadera y caminar con las manos hacia adelante hasta llegar a posición de plancha. Mantener 2 segundos y caminar con las manos de vuelta hasta pararse. Trabaja core, hombros, flexibilidad de isquiotibiales.'
  },
  {
    nombre: 'Mountain climbers',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    descripcion: 'En posición de plancha alta, llevar una rodilla al pecho alternando piernas rápidamente como si corrieras en el lugar. Mantener la cadera baja y el core activado. Trabaja abdominales, hombros y cardio.'
  },
  {
    nombre: 'Abs complex',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    descripcion: 'Secuencia combinada de ejercicios abdominales sin pausa: crunches + bicicleta + elevación de piernas + plancha. Cada ejercicio por 10-15 reps antes de pasar al siguiente. Trabaja recto abdominal, oblicuos y core profundo.'
  },
  // ── FUNCIONAL / RÍO ────────────────────────────────────────────────────────
  {
    nombre: 'Flexiones',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    descripcion: 'Cuerpo recto como tabla, manos al ancho de hombros. Bajá el pecho al suelo flexionando los codos a ~45° del torso y empujá hasta extensión. Trabaja pectoral, deltoides anterior y tríceps. Ejercicio base de empuje con peso corporal.'
  },
  {
    nombre: 'Flexiones explosivas',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    descripcion: 'Flexión donde al subir empujás con fuerza suficiente para que las manos se despeguen del suelo. Aterrizá suave y repetí. Trabaja potencia de pectoral y tríceps. Podés aplaudir arriba para mayor dificultad.'
  },
  {
    nombre: 'Flexiones inclinadas',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    descripcion: 'Flexiones con los pies elevados en un banco. El ángulo de declive traslada el trabajo al pectoral superior y deltoides anterior. Mantené el core firme y bajá el pecho controlado entre las manos.'
  },
  {
    nombre: 'Dips en paralelas',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    descripcion: 'Apoyado en barras paralelas, bajá el cuerpo flexionando los codos con el torso inclinado hacia adelante. Subí empujando. La inclinación enfatiza el pectoral; más erguido trabaja más tríceps. Codos a ~45° del cuerpo.'
  },
  {
    nombre: 'Dominadas',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    descripcion: 'Colgado de la barra con agarre prono al ancho de hombros, empujá los codos hacia abajo hasta que el mentón supere la barra. Bajá controlado a extensión completa. Trabaja dorsal ancho, romboides, trapecio y bíceps.'
  },
  {
    nombre: 'Dominadas australianas',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    descripcion: 'Remo invertido bajo una barra baja con los pies en el suelo y el cuerpo recto. Tirá el pecho hacia la barra apretando omóplatos. Ajustá el ángulo del cuerpo para mayor o menor dificultad. Trabaja dorsales, romboides y bíceps.'
  },
  {
    nombre: 'Dominadas cerradas',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    descripcion: 'Dominada con agarre supino o neutro cerrado, manos al ancho de hombros o menos. Mayor participación de bíceps y braquial que el agarre abierto. Subí hasta que el mentón supere la barra y bajá controlado.'
  },
  {
    nombre: 'Dominadas grip neutro',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    descripcion: 'Dominada con palmas enfrentadas (agarre neutro). Posición más natural para el hombro que permite mayor rango de movimiento. Trabaja dorsales y bíceps de forma equilibrada con menor estrés articular.'
  },
  {
    nombre: 'TRX row',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    descripcion: 'Colgado de las correas del TRX con el cuerpo inclinado, tirá el pecho hacia las manos llevando los codos atrás. Apretá omóplatos al final. Cuanto más horizontal el cuerpo, más difícil. Trabaja dorsales, romboides y bíceps.'
  },
  {
    nombre: 'Remo alto en TRX',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    descripcion: 'Remo en TRX con codos altos a la altura de los hombros, tirando hacia la cara. Similar a un face pull pero con peso corporal. Enfatiza deltoides posterior, trapecio medio y rotadores externos del hombro.'
  },
  {
    nombre: 'TRX face pull',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: false,
    descripcion: 'Con las correas del TRX, tirá hacia la cara abriendo los codos y rotando externamente los hombros al final. Las manos quedan a los lados de la cabeza. Trabaja deltoides posterior, manguito rotador y retractores de escápula.'
  },
  {
    nombre: 'Muscle-up negativo en barra',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    descripcion: 'Empezá arriba de la barra (saltando o con impulso) y bajá lo más lento posible: primero la fase de dip y luego la fase de dominada. Trabaja la fuerza excéntrica necesaria para progresar hacia el muscle-up completo.'
  },
  {
    nombre: 'Banda pull-apart',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    descripcion: 'Con banda tomada frente al pecho con ambas manos, separá las manos estirando la banda hasta que toque el pecho. Apretá omóplatos al final. Trabaja romboides, trapecio medio y deltoides posterior.'
  },
  {
    nombre: 'Banda lateral walk',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: false,
    descripcion: 'Con una mini-band en tobillos o rodillas, caminá lateralmente con pasos cortos manteniendo tensión constante. Rodillas semiflexionadas, torso erguido. Activa glúteo medio, abductores y estabilizadores de cadera.'
  },
  {
    nombre: 'Banda dislocates',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: false,
    descripcion: 'Con una banda elástica ancha tomada con ambas manos y brazos rectos, pasala por encima de la cabeza hacia atrás y volvé al frente. Abre los hombros, mejora movilidad del manguito rotador y corrige postura.'
  },
  {
    nombre: 'Banda face pull',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: false,
    descripcion: 'Con una banda anclada a la altura de la cara, tirá hacia la cara abriendo los codos y rotando externamente los hombros. Activa deltoides posterior, trapecio y rotadores externos. Calentamiento clave para empuje y tracción.'
  },
  {
    nombre: 'Rotación de hombros',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: false,
    descripcion: 'Círculos amplios con los brazos, progresando de pequeños a grandes, hacia adelante y atrás. Calienta la articulación del hombro activando deltoides, manguito rotador y trapecios. Esencial antes de ejercicios de tren superior.'
  },
  {
    nombre: 'Rotación torácica',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'En cuatro puntos o sentado, con una mano detrás de la cabeza, rotá el torso abriendo el codo hacia el techo. Volvé controlado. Mejora la movilidad torácica sin compensar con la lumbar. Ideal antes de empuje y tracción.'
  },
  {
    nombre: 'Cat-cow',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'En cuatro puntos, alterná entre arquear la espalda hacia arriba (gato) y hundirla hacia abajo (vaca), coordinando con la respiración. Moviliza toda la columna vertebral, alivia tensión y prepara la espalda para el entrenamiento.'
  },
  {
    nombre: 'Hip 90/90 mobility',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Sentado en el suelo con ambas piernas a 90°, rotá las caderas alternando la posición de las piernas de un lado al otro. Mejora la rotación interna y externa de cadera, clave para sentadillas y zancadas.'
  },
  {
    nombre: 'Movilidad de cadera',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Serie de movimientos para abrir las caderas: círculos, 90/90, estocadas profundas, apertura de mariposa. Mejora el rango de movimiento de cadera y previene lesiones en ejercicios de tren inferior.'
  },
  {
    nombre: 'Movilidad de hombros',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: false,
    descripcion: 'Secuencia de rotaciones, dislocaciones y círculos de hombro para preparar la articulación. Incluye rotación interna/externa, flexión y extensión activa. Previene lesiones del manguito rotador.'
  },
  {
    nombre: 'Activación glúteo con loop band',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: false,
    descripcion: 'Con una mini-band en las rodillas, hacé puentes de glúteo, clamshells o abducción lateral. Activa glúteo medio y mayor antes del entrenamiento de piernas. Mejora la conexión mente-músculo y protege la espalda baja.'
  },
  {
    nombre: 'Loop band abducción parada',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: false,
    descripcion: 'De pie con mini-band en los tobillos, levantá una pierna lateralmente contra la resistencia manteniendo el torso erguido. Activa glúteo medio y estabilizadores de cadera en posición funcional.'
  },
  {
    nombre: 'Patada de glúteo con tobillera',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: true,
    descripcion: 'En cuatro puntos o apoyada en banco, con tobillera con peso, extendé una pierna hacia atrás y arriba. Apretá glúteos arriba y bajá controlado. Aislamiento de glúteo mayor con resistencia adicional.'
  },
  {
    nombre: 'Step-up en banco',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    descripcion: 'Subí a un banco con una pierna empujando con el talón, extendé completamente la cadera arriba y bajá controlado con la misma pierna. Trabaja cuádriceps y glúteos de forma unilateral. Se puede agregar carga con KB o chaleco.'
  },
  {
    nombre: 'Ab wheel',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Arrodillado con la rueda abdominal, rodá hacia adelante extendiendo el cuerpo lo más posible manteniendo el core firme y la espalda sin arquear. Volvé contrayendo abdominales. Trabaja recto abdominal, oblicuos y serrato con intensidad alta.'
  },
  {
    nombre: 'Hollow body',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Acostado boca arriba, levantá hombros y piernas del suelo con los brazos extendidos junto a las orejas. Mantené la zona lumbar pegada al piso. Posición de tensión total del core anterior. Mantené el tiempo indicado.'
  },
  {
    nombre: 'L-sit en paralelas',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Apoyado en barras paralelas con los brazos extendidos, elevá las piernas rectas hasta paralelas al suelo formando una L. Mantené la posición. Trabaja abdominales, flexores de cadera y tríceps isométrico.'
  },
  {
    nombre: 'Plancha con elevación alternada',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Desde posición de plancha, levantá brazo y pierna opuestos alternando (bird-dog en plancha). Mantené 2s cada lado sin rotar la cadera. Trabaja anti-rotación del core y coordinación neuromuscular.'
  },
  {
    nombre: 'Plancha en paralelas',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Plancha con las manos apoyadas en barras paralelas. La elevación aumenta el rango y la inestabilidad. Mantené el cuerpo recto activando core y glúteos. Trabaja estabilidad de hombros y core profundo.'
  },
  {
    nombre: 'Bear crawl',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    descripcion: 'En cuatro puntos con las rodillas apenas despegadas del suelo, avanzá moviendo mano y pie opuestos simultáneamente. Mantené la espalda plana y la cadera baja. Trabaja core, hombros, cuádriceps y coordinación.'
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
