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
    nombre: 'Sentadilla sumo',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    descripcion: 'Con pies muy separados y puntas hacia afuera, bajá las caderas lentamente hasta paralelo o más. Rodillas siguen la dirección de los pies. Ideal para activar glúteos y aductores. Se puede hacer con peso corporal, mancuerna, barra o kettlebells.'
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
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    descripcion: 'De pie con un pie apoyado en un banco o superficie elevada detrás. Bajá la rodilla trasera hacia el piso manteniendo el torso recto. Se puede hacer con peso corporal, mancuernas o kettlebell. Trabaja cuádriceps, glúteos y estabilidad de cadera unilateral.'
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
    nombre: 'Plancha oscilante en codos',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Plancha apoyada en antebrazos. Sin mover los codos, desplazá el cuerpo hacia adelante (los hombros pasan la línea de los codos) y luego hacia atrás, como una sierra. 30 oscilaciones en total: 10 con las dos piernas apoyadas, 10 con la pierna derecha elevada y 10 con la pierna izquierda elevada. Mantené cadera y espalda alineadas, core y glúteos activos en todo el recorrido.'
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
    descripcion: 'Con las correas del TRX, cuerpo inclinado hacia adelante. Bajá flexionando los codos como una flexión, empujá para volver. Más inclinación = más difícil. Trabaja pectoral y estabilidad.'
  },
  {
    nombre: 'TRX chest press narrow',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    descripcion: 'Igual que TRX chest press pero con manos juntas (agarre cerrado). Al bajar los codos van pegados al cuerpo. Enfatiza tríceps y pectoral interno. Más inclinación = más difícil.'
  },
  {
    nombre: 'TRX archer press',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    descripcion: 'Desde posición de TRX chest press, bajá llevando el peso hacia un brazo mientras el otro se extiende al costado como un arquero. Empujá con el brazo cargado para volver. Alterná lados. Trabaja pectoral unilateral con mayor intensidad.'
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
    grupo: 'Hombros', tipo: 'funcional', usaPeso: true,
    descripcion: 'De pie con mancuernas, kettlebells o bandas a los costados, levantá los brazos lateralmente hasta la altura de los hombros con leve flexión en los codos. Bajá lento. Trabaja exclusivamente el deltoides lateral.'
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
    nombre: 'Empuje de cadera en piso con peso',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: true,
    descripcion: 'Acostado boca arriba con las rodillas flexionadas y los pies en el piso, colocá una kettlebell o plato sobre el abdomen bajo. Empujá la cadera hacia arriba apretando los glúteos al tope. Bajá controlado sin tocar el piso. Variante sin cajón del hip thrust.'
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
    nombre: 'Plancha estrella con peso',
    grupo: 'Core', tipo: 'funcional', usaPeso: true,
    descripcion: 'En plancha lateral, elevá la pierna superior abierta en posición de estrella. Con el brazo libre sosteniendo una mancuerna, subí y bajá el peso con el brazo extendido desde la cadera hasta arriba. Trabaja oblicuos, glúteo medio, deltoides y estabilidad de todo el cuerpo. Mantené la cadera elevada y el core firme durante todo el movimiento.'
  },
  {
    nombre: 'Copenhague',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    descripcion: 'En posición de plancha lateral, apoyá la pierna de arriba sobre un banco o cajón con la cara interna del pie. La pierna de abajo queda suspendida. Subí y bajá la cadera manteniendo el cuerpo alineado. Trabaja aductores, core y estabilidad de cadera. Excelente para prevención de lesiones de ingle.'
  },
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
    nombre: 'Tuck jumps',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    descripcion: 'Desde parado, saltá verticalmente llevando las rodillas al pecho en el aire. Aterrizá suave con rodillas semiflexionadas y repetí. Trabaja potencia explosiva de piernas, cuádriceps, core y sistema cardiovascular.'
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
    nombre: 'TRX power pull',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    descripcion: 'Colgado del TRX con una mano, cuerpo inclinado. Tirá con un brazo mientras rotás el torso y extendés el brazo libre hacia el techo. Volvé controlado. Trabaja dorsales, romboides, oblicuos y estabilizadores con componente rotacional.'
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

  // ── CASA — VARIANTES CON EQUIPAMIENTO ──────────────────────────────────────
  // Kettlebell
  {
    nombre: 'Sentadilla goblet con kettlebell',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    descripcion: 'Sostené la kettlebell contra el pecho con ambas manos. Pies al ancho de hombros, bajá a sentadilla profunda manteniendo codos entre las rodillas y torso erguido. Empujá talones para subir.'
  },
  {
    nombre: 'Sentadilla con salto con chaleco',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    descripcion: 'Sentadilla explosiva con chaleco de peso. Bajá a paralelo y saltá con máxima potencia, aterrizá suave absorbiendo con las piernas. El chaleco agrega resistencia al movimiento pliométrico.'
  },
  {
    nombre: 'Zancadas con chaleco de peso',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    descripcion: 'Zancadas alternadas con chaleco de peso puesto. Dá un paso largo al frente, bajá la rodilla trasera casi al piso y volvé. El chaleco añade carga distribuida al torso manteniendo las manos libres.'
  },
  {
    nombre: 'Zancadas con kettlebell',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    descripcion: 'Zancadas alternadas sosteniendo la kettlebell al pecho (posición goblet). Paso largo al frente, rodilla trasera casi al piso, empujá para volver. Trabaja cuádriceps, glúteos y estabilidad.'
  },
  {
    nombre: 'Peso muerto rumano con kettlebell',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    descripcion: 'De pie con la kettlebell en ambas manos. Incliná el torso hacia adelante con las piernas casi rectas hasta sentir estiramiento en femorales. Volvé con la cadera. Trabaja isquiotibiales y glúteos.'
  },
  {
    nombre: 'Squat to press con kettlebell',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    descripcion: 'Sostenés la kettlebell con ambas manos a la altura del pecho (posición goblet). Bajá a sentadilla profunda y al subir empujá la kettlebell hacia arriba en press sobre la cabeza estirando los brazos. Bajá la kettlebell al pecho y repetí. Trabaja piernas, hombros y core en un solo movimiento.'
  },
  {
    nombre: 'Squat to press a una mano con kettlebell',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    descripcion: 'Kettlebell en una mano a la altura del hombro (rack). Bajá a sentadilla profunda y al subir empujá la kettlebell en press sobre la cabeza con un brazo. Bajá al hombro y repetí. Alterná manos entre series. Genera inestabilidad que activa más el core.'
  },
  {
    nombre: 'Peso muerto a una pierna con kettlebell',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    descripcion: 'De pie sobre una pierna, kettlebell en la mano contraria. Incliná el torso hacia adelante levantando la pierna libre estirada hacia atrás hasta quedar en T. Volvé controlado. Trabaja femorales, glúteos y equilibrio.'
  },
  {
    nombre: 'Empuje de cadera',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: false,
    descripcion: 'Espalda apoyada en un banco o el piso, peso sobre la cadera. Empujá la cadera hacia arriba apretando glúteos en el tope. Bajá controlado. Excelente activador de glúteo mayor.'
  },
  {
    nombre: 'Patada de glúteo con tobillera 4k',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: true,
    descripcion: 'En cuatro puntos con tobillera de 4 kg en el tobillo. Elevá la pierna hacia atrás y arriba manteniendo la rodilla a 90°, apretá el glúteo arriba. Bajá controlado sin apoyar. Aislamiento de glúteo mayor.'
  },
  // Chaleco de peso — Tren superior
  {
    nombre: 'Flexiones con chaleco',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    descripcion: 'Flexiones estándar con chaleco de peso. Cuerpo recto, manos al ancho de hombros, bajá el pecho al suelo y empujá. El chaleco agrega resistencia significativa al empuje corporal.'
  },
  {
    nombre: 'Fondos en banco con chaleco',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: false,
    descripcion: 'Manos en el borde de un banco, piernas extendidas. Bajá flexionando los codos hasta 90° y empujá para subir. El chaleco de peso intensifica el trabajo de tríceps y deltoides anterior.'
  },
  {
    nombre: 'Dominadas australianas con chaleco',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    descripcion: 'Colgado bajo una barra o TRX con el cuerpo inclinado y chaleco de peso. Tirá el pecho hacia la barra apretando los omóplatos. Bajá controlado. El chaleco aumenta la carga en dorsales y bíceps.'
  },
  // Kettlebell — Tren superior
  {
    nombre: 'Press militar con kettlebell',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: true,
    descripcion: 'De pie, kettlebell en posición de rack (contra el hombro). Empujá hacia arriba hasta extensión completa del brazo. Bajá controlado al hombro. Alterná o hacé bilateral. Trabaja deltoides y tríceps.'
  },
  {
    nombre: 'Arnold press con kettlebell',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: true,
    descripcion: 'Sentado o de pie con kettlebell. Empezá con la pesa frente al pecho, palmas hacia vos. Rotá las muñecas mientras empujás hacia arriba hasta extensión. Trabaja las tres cabezas del deltoides.'
  },
  {
    nombre: 'Remo con kettlebell',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: true,
    descripcion: 'Inclinado con una mano apoyada, la otra sostiene la kettlebell. Tirá la pesa hacia la cadera apretando el omóplato. Bajá controlado. Trabaja dorsal ancho, romboides y bíceps.'
  },
  {
    nombre: 'Curl de bíceps con kettlebell',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: true,
    descripcion: 'De pie con kettlebell. Flexioná el codo llevando la pesa al hombro sin mover el brazo superior. Bajá controlado. Podés hacer bilateral o alternado. Trabaja bíceps braquial.'
  },
  {
    nombre: 'Curl martillo con kettlebell',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: true,
    descripcion: 'Curl con kettlebell manteniendo agarre neutro (palmas enfrentadas). Flexioná el codo sin rotar la muñeca. Trabaja bíceps, braquial y braquiorradial.'
  },
  // Bandas
  {
    nombre: 'Extensión de tríceps con banda',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: false,
    descripcion: 'Banda anclada arriba o pisada por detrás. Extendé los codos empujando las manos hacia abajo o arriba según el anclaje. Mantené los brazos pegados a la cabeza o al torso. Aislamiento de tríceps.'
  },
  {
    nombre: 'Rotación de hombros con banda',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: false,
    descripcion: 'Sostenés la banda con ambas manos al frente. Llevala por encima de la cabeza y atrás hasta la zona lumbar, y volvé. Mantené los brazos rectos. Movilidad y calentamiento del manguito rotador.'
  },
  // Core con carga
  {
    nombre: 'Plancha con chaleco',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Plancha estándar en antebrazos con chaleco de peso. Cuerpo recto de cabeza a talones, apretá abdomen y glúteos. El chaleco aumenta la demanda de estabilización del core.'
  },
  {
    nombre: 'Plancha lateral con chaleco',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Apoyado en un antebrazo de costado con chaleco de peso. Cadera elevada, cuerpo recto. Mantené la posición sin dejar caer la cadera. Trabaja oblicuos y estabilizadores laterales del core.'
  },
  {
    nombre: 'Hollow body con peso',
    grupo: 'Core', tipo: 'funcional', usaPeso: true,
    descripcion: 'Acostado boca arriba con un peso (plato de rucking 4kg, kettlebell o mancuerna) sostenido con los brazos extendidos sobre la cabeza. Elevá piernas y hombros del piso, formando una banana. Mantené la zona lumbar pegada al suelo.'
  },
  // HIIT con chaleco
  {
    nombre: 'Burpees con chaleco',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    descripcion: 'Burpee completo con chaleco de peso: bajá al suelo, pecho toca, empujá, saltá los pies hacia las manos y saltá arriba. El chaleco aumenta la intensidad cardiovascular y la demanda de fuerza.'
  },
  {
    nombre: 'Mountain climbers con chaleco',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    descripcion: 'En posición de plancha alta con chaleco de peso. Llevá las rodillas alternadamente al pecho a máxima velocidad. Mantené la cadera baja y el core apretado. El chaleco agrega resistencia al cardio.'
  },
  {
    nombre: 'Jumping jacks con chaleco',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    descripcion: 'Saltá abriendo piernas y subiendo brazos simultáneamente, volvé al centro. Con chaleco de peso se intensifica el trabajo cardiovascular y de resistencia muscular en piernas y hombros.'
  },
  {
    nombre: 'Bear crawl con chaleco',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    descripcion: 'Desplazamiento en cuatro puntos con chaleco de peso. Rodillas apenas despegadas del suelo, avanzá mano y pie opuestos. El chaleco añade carga al core, hombros y cuádriceps durante el recorrido.'
  },
  // Equilibrio + kettlebell
  {
    nombre: 'Curl de bíceps en equilibrio con kettlebell',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: true,
    descripcion: 'De pie sobre una pierna, kettlebell en la mano del mismo lado o contrario. Flexioná el codo subiendo la pesa al hombro sin perder el equilibrio. Trabajás bíceps, core y estabilizadores de tobillo y cadera simultáneamente. Alterná la pierna de apoyo entre series.'
  },
  {
    nombre: 'Vuelos laterales en equilibrio con kettlebell',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: true,
    descripcion: 'Parado sobre una pierna, kettlebell en una mano. Elevá el brazo lateralmente hasta la altura del hombro con el codo levemente flexionado. Bajá controlado. Trabaja deltoides lateral, core y estabilidad de cadera y tobillo. Hacé todas las reps de un lado antes de cambiar.'
  },
  // TRX — Piernas
  {
    nombre: 'Sentadilla búlgara con TRX',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    descripcion: 'Pie trasero en el estribo del TRX. Bajá la rodilla trasera hacia el piso manteniendo el torso recto. Empujá para subir. El TRX permite mayor rango de movimiento y desafía la estabilidad. Trabaja cuádriceps, glúteos y equilibrio unilateral.'
  },
  // TRX — Bíceps
  {
    nombre: 'Curl de bíceps en TRX',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: true,
    descripcion: 'De frente al anclaje del TRX, agarrá las correas con agarre supino y el cuerpo inclinado hacia atrás. Flexioná los codos llevando las manos a la frente, manteniendo los codos altos y fijos. Extendé controlado. Cuanto más horizontal el cuerpo, más difícil. Trabaja bíceps y braquial con peso corporal.'
  },
  // TRX — Tríceps
  {
    nombre: 'Tríceps alto en TRX',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: false,
    descripcion: 'De espaldas al anclaje del TRX, brazos extendidos sobre la cabeza sosteniendo las correas. Flexioná los codos bajando la cabeza entre las manos, manteniendo los brazos pegados a las orejas. Extendé para volver. Similar a un french press con peso corporal. Cuanto más inclinado, más difícil.'
  },
  // ── RECOVERY (post-cirugía, sin Valsalva, cargas livianas) ─────────────────
  {
    nombre: 'Sentadilla corporal',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    descripcion: 'De pie con pies al ancho de caderas. Bajá como si fueras a sentarte en una silla, flexionando rodillas y caderas. Mantené el pecho erguido y la espalda recta. Respiración normal, sin aguantar aire. Ideal para recuperación sin carga.'
  },
  {
    nombre: 'Puente de glúteos',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: false,
    descripcion: 'Acostada boca arriba, rodillas dobladas y pies apoyados al ancho de caderas. Elevá la cadera contrayendo los glúteos hasta formar una línea recta entre hombros, caderas y rodillas. Bajá controlado. Respiración continua, sin apnea. Base de activación de glúteo y cadena posterior.'
  },
  {
    nombre: 'Puente de glúteos una pierna',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: false,
    descripcion: 'Igual que el puente clásico pero con una pierna extendida en el aire. Apoyás solo un pie, la otra pierna queda estirada hacia arriba. Subí la cadera contrayendo el glúteo de apoyo. Mayor demanda unilateral y control de pelvis. Sin aguantar aire.'
  },
  {
    nombre: 'Plancha isométrica',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Apoyada en antebrazos y puntas de pies. Cuerpo recto como tabla, caderas alineadas con hombros. Mantené la posición respirando normal, sin Valsalva. Activa core profundo sin generar presión intra-abdominal. Ideal post-cirugía.'
  },
  {
    nombre: 'Extensión de cadera en 4 puntos',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: false,
    descripcion: 'En posición de 4 apoyos (manos y rodillas). Extendé una pierna hacia atrás hasta alinear con el torso, apretando el glúteo al final. Bajá controlado. Core activado todo el tiempo, sin arquear la columna. Trabajá glúteo mayor y estabilidad lumbopélvica.'
  },
  {
    nombre: 'Estocadas estáticas',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    descripcion: 'Dá un paso al frente y quedate en esa posición. Bajá la rodilla trasera hacia el suelo sin apoyarla y subí. Hacé todas las reps de un lado antes de cambiar. Sin saltos, movimiento controlado. Trabajá cuádriceps, glúteos y estabilidad unilateral.'
  },
  {
    nombre: 'Calf raises',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    descripcion: 'De pie en el suelo o en el borde de un escalón con las puntas de los pies apoyadas. Subí elevando los talones lo más alto posible y bajá lentamente estirando. Si estás en escalón, ganás más rango. Trabaja gemelos y sóleo.'
  },
  {
    nombre: 'Plancha lateral',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Apoyá el antebrazo y el lado del pie inferior. Levantá la cadera formando una línea recta del tobillo al hombro. Mantené la posición respirando continuo. Trabaja oblicuos y estabilizadores laterales sin generar presión abdominal alta.'
  },
  {
    nombre: 'Cat-cow',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'En 4 apoyos. En la fase "cat" redondeá toda la columna hacia arriba llevando el mentón al pecho. En la fase "cow" dejá caer el abdomen y mirá al frente. Cuello relajado, sin tensión. Movilidad de toda la columna vertebral, ideal para calentar y despertar el core.'
  },
  {
    nombre: 'Bird-dog',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'En 4 apoyos, extendé simultáneamente brazo derecho y pierna izquierda hasta alinear con el torso. Mantené 1-2 segundos y volvé. Alterná. Sin rotación de cadera ni hombros. Control total, core activado. Estabilidad antirotacional y coordinación cruzada.'
  },
  {
    nombre: 'Hip hinge corporal',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    descripcion: 'De pie, pies al ancho de caderas. Empujá la cadera hacia atrás manteniendo la espalda recta y rodillas levemente flexionadas. El torso se inclina por la bisagra de cadera, no por la columna. Activa isquiotibiales y glúteos. Patrón base del peso muerto sin carga.'
  },
  {
    nombre: 'Yoga suave',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'Secuencia de posturas suaves sin inversiones ni presión abdominal intensa: postura del niño, gato-vaca, paloma, torsión suave sentada, savasana. Respiración profunda y consciente. Ideal para días de recuperación y movilidad.'
  },
  {
    nombre: 'Plancha toque de hombro',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    descripcion: 'En plancha sobre manos (no antebrazos), pies un poco más separados que hombros. Tocá el hombro contrario con una mano alternando lados sin que la cadera rote. Core antirotacional en acción. Respiración continua, sin contener aire.'
  },
  {
    nombre: 'Press militar suave con kettlebell',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: true,
    descripcion: 'Press militar con kettlebell liviana, sentada o de pie. Sin apnea, sin aguantar aire. Ideal con el 40-50% de tu peso habitual. Empujá controlado hacia arriba y bajá al rack del hombro. Estímulo de deltoides sin generar presión intracraneal.'
  },
  {
    nombre: 'Curl de bíceps suave',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: true,
    descripcion: 'De pie o sentada, kettlebell liviana en cada mano o bilateral. Flexioná el codo con control total en la bajada. Respiración continua. Cargas del 40-50% de lo habitual para mantener estímulo sin fatiga excesiva.'
  },
  {
    nombre: 'Face pull con banda',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: false,
    descripcion: 'Ancla una banda elástica a la altura de los ojos. Tirá la banda hacia tu cara abriendo los codos y rotando externamente los hombros. Trabaja postura, deltoides posterior y manguito rotador. Excelente para compensar horas sentada y mejorar postura.'
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
