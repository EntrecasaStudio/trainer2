// Catálogo completo de ejercicios con grupos musculares, descripciones y tipo

export const GRUPOS_MUSCULARES = [
  'Piernas', 'Core', 'Pecho', 'Espalda', 'Hombros', 'Brazos', 'Glúteos', 'HIIT'
];

export const EJERCICIOS_CATALOGO = [
  // ── PIERNAS ─────────────────────────────────────────────────────────────────
  {
    nombre: 'Sentadilla con barra',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos, Isquiotibiales',
    tags: 'Barbell squat, Back squat',
    descripcion: 'Parado con la barra apoyada en los trapecios, pies al ancho de hombros. Flexioná las rodillas y bajá las caderas hasta paralelo al suelo. Mantené el torso erguido, rodillas alineadas con los pies y talones apoyados. Empujá hacia arriba para volver. (Barbell Squat)'
  },
  {
    nombre: 'Peso muerto rumano',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    musculos: 'Isquiotibiales, Glúteos, Erector espinal',
    tags: 'Romanian deadlift, RDL',
    descripcion: 'De pie con la barra al frente, manos al ancho de hombros. Inclinando el torso hacia adelante manteniendo las piernas casi rectas (ligera flexión), bajá la barra por las piernas hasta sentir estiramiento en femorales. Volvé con la cadera, no la espalda. (Romanian Deadlift)'
  },
  {
    nombre: 'Peso muerto con barra',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    musculos: 'Isquiotibiales, Glúteos, Erector espinal, Cuádriceps',
    tags: 'Barbell deadlift, Conventional deadlift',
    descripcion: 'Con la barra en el piso y pies a ancho de caderas, agachate con la espalda recta, tomá la barra. Empujá el suelo con los pies y extendé las caderas hasta estar parado. La barra sube pegada a las piernas durante todo el movimiento. (Barbell Deadlift)'
  },
  {
    nombre: 'Zancadas',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos, Isquiotibiales',
    tags: 'Lunges, Walking lunges',
    descripcion: 'De pie, dá un paso largo al frente y bajá la rodilla trasera casi al piso sin apoyarla. Empujá para volver y alterná las piernas. Se puede hacer con mancuernas, kettlebell, chaleco de peso o sin carga. (Lunges)'
  },
  {
    nombre: 'Sentadilla sumo',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Glúteos, Aductores, Cuádriceps',
    tags: 'Sumo squat',
    descripcion: 'Con pies muy separados y puntas hacia afuera, bajá las caderas lentamente hasta paralelo o más. Rodillas siguen la dirección de los pies. Ideal para activar glúteos y aductores. Se puede hacer con peso corporal, mancuerna, barra o kettlebells. (Sumo Squat)'
  },
  {
    nombre: 'Prensa de piernas',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos, Isquiotibiales',
    tags: 'Leg press',
    descripcion: 'Sentado en la máquina de prensa con los pies al ancho de hombros en la plataforma. Bajá la plataforma flexionando las rodillas hasta 90° y empujá hacia arriba sin bloquear los codos de las piernas. Trabaja cuádriceps, glúteos y femorales con menor carga en la espalda baja. (Leg Press)'
  },
  {
    nombre: 'Extensión de cuádriceps',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    musculos: 'Cuádriceps',
    tags: 'Leg extension',
    descripcion: 'Sentado en la máquina con el rodillo apoyado en los tobillos y las rodillas alineadas con el eje de rotación. Extendé las piernas hasta arriba y bajá controlado. Aislamiento puro de cuádriceps. Evitá hiperextender la rodilla al final del movimiento. (Leg Extension)'
  },
  {
    nombre: 'Curl femoral',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    musculos: 'Isquiotibiales, Glúteos',
    tags: 'Leg curl, Hamstring curl',
    descripcion: 'Acostado boca abajo en la máquina con el rodillo detrás de los tobillos. Flexioná las rodillas llevando los talones hacia los glúteos y bajá controlado. Aislamiento de isquiotibiales. Mantené las caderas pegadas al banco durante todo el recorrido. (Leg Curl)'
  },
  {
    nombre: 'Sentadilla búlgara',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos, Isquiotibiales',
    tags: 'bulgarian split squat',
    descripcion: 'De pie con un pie apoyado en un banco o superficie elevada detrás. Bajá la rodilla trasera hacia el piso manteniendo el torso recto. Se puede hacer con peso corporal, mancuernas o kettlebell. Trabaja cuádriceps, glúteos y estabilidad de cadera unilateral.'
  },
  {
    nombre: 'Gemelos en máquina',
    grupo: 'Piernas', tipo: 'maquina', usaPeso: true,
    musculos: 'Gemelos, Pantorrillas',
    tags: 'Calf raise machine, Seated calf raise',
    descripcion: 'De pie en la máquina de gemelos con los hombros bajo las almohadillas y las puntas de los pies en el borde. Subí elevando los talones lo más alto posible y bajá lentamente estirando bien. Trabaja gastrocnemio y sóleo. Mantené las rodillas levemente flexionadas. (Calf Raise Machine)'
  },
  // ── CORE ────────────────────────────────────────────────────────────────────
  {
    nombre: 'Plancha',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Recto abdominal, Transverso abdominal, Oblicuos',
    tags: 'Plank, Front plank',
    descripcion: 'Apoyado en manos y pies (o antebrazos y pies), mantenés el cuerpo como una tabla recta. El core debe estar activado, sin dejar que la cadera suba o baje. Respirá continuamente. Es el ejercicio base de estabilidad de tronco. (Plank)'
  },
  {
    nombre: 'Plancha en codos',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Recto abdominal, Transverso abdominal, Oblicuos',
    tags: 'plancha isométrica, plank',
    descripcion: 'Igual que la plancha estándar pero apoyado en los antebrazos en lugar de las palmas. Mayor activación del core al reducir el brazo de palanca. Codos directamente debajo de los hombros, espalda plana.'
  },
  {
    nombre: 'Plancha oscilante en codos',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Recto abdominal, Transverso abdominal, Deltoides anterior',
    tags: 'Body saw, Plank body saw',
    descripcion: 'Plancha apoyada en antebrazos. Sin mover los codos, desplazá el cuerpo hacia adelante (los hombros pasan la línea de los codos) y luego hacia atrás, como una sierra. 30 oscilaciones en total: 10 con las dos piernas apoyadas, 10 con la pierna derecha elevada y 10 con la pierna izquierda elevada. Mantené cadera y espalda alineadas, core y glúteos activos en todo el recorrido. (Body Saw)'
  },
  {
    nombre: 'Dead bug',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Recto abdominal, Transverso abdominal, Oblicuos',
    tags: 'Dead bug',
    descripcion: 'Acostado boca arriba, brazos extendidos al techo y rodillas a 90°. Simultáneamente bajá el brazo derecho al suelo y extendé la pierna izquierda sin tocar el piso. Volvé y alternás. Lumbar pegada al suelo en todo momento. (Dead Bug)'
  },
  {
    nombre: 'Dragonfly',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Recto abdominal, Oblicuos, Flexores de cadera',
    tags: 'dragon flag, bruce lee',
    descripcion: 'Acostado en un banco, agarrate del borde detrás de la cabeza. Con el cuerpo rígido como una tabla, bajá las piernas extendidas hacia el banco controlando con los abdominales. Subí de vuelta sin flexionar la cadera. Ejercicio avanzado de core que requiere gran fuerza abdominal y control.'
  },
  {
    nombre: 'Pallof press',
    grupo: 'Core', tipo: 'maquina', usaPeso: true,
    musculos: 'Oblicuos, Transverso abdominal, Recto abdominal',
    tags: 'Pallof press, Anti-rotation press',
    descripcion: 'De pie de lado a la polea (o banda), sujetá el cable a la altura del pecho con ambas manos. Extendé los brazos al frente resistiendo la rotación, luego volvé. El objetivo es evitar que el torso gire. Trabajás la anti-rotación del core. (Pallof Press)'
  },
  {
    nombre: 'Espinales con disco',
    grupo: 'Core', tipo: 'maquina', usaPeso: true,
    musculos: 'Erector espinal, Glúteos',
    tags: 'Weighted back extension, Superman with plate',
    descripcion: 'Acostado boca abajo con un disco sostenido contra el pecho o detrás de la cabeza. Elevá el torso contrayendo la espalda baja y bajá de forma controlada. Evitá hiperextender la columna al subir. Trabaja erectores espinales. (Weighted Back Extension)'
  },
  {
    nombre: 'Rotación con disco',
    grupo: 'Core', tipo: 'funcional', usaPeso: true,
    musculos: 'Oblicuos, Transverso abdominal, Recto abdominal',
    tags: 'Standing plate twist, Standing Russian twist',
    descripcion: 'De pie con un disco sostenido con ambas manos y los brazos extendidos al frente. Rotá el torso de un lado al otro llevando el disco en arco amplio. Mantené las caderas lo más quietas posible para que la rotación venga de la zona torácica. Trabaja oblicuos y core rotacional. (Standing Plate Twist)'
  },
  {
    nombre: 'Oscilaciones laterales con disco',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Oblicuos, Transverso abdominal, Deltoides anterior',
    tags: 'Plate lateral shift, Standing plate pendulum',
    descripcion: 'De pie sosteniendo un disco con ambas manos y los brazos extendidos al frente a la altura de los hombros. Hacé movimientos cortos laterales de izquierda a derecha sin rotar el torso. El core trabaja anti-lateralmente para estabilizar el peso. (Plate Lateral Shift)'
  },
  {
    nombre: 'Complex',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Recto abdominal, Oblicuos, Transverso abdominal',
    tags: 'Ab complex',
    descripcion: 'Secuencia encadenada de movimientos sin pausa: generalmente incluye plancha, mountain climbers y burpee. La combinación varía según la programación. Trabaja coordinación, resistencia y estabilidad de todo el tronco. (Ab Complex)'
  },
  {
    nombre: 'Plancha lateral',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Oblicuos, Transverso abdominal, Glúteos',
    tags: 'side plank, recovery',
    descripcion: 'Apoyá el antebrazo y el lado del pie inferior. Levantá la cadera formando una línea recta del tobillo al hombro. Activá oblicuos y glúteo medio para no dejar caer la cadera. Aguantá el tiempo indicado por lado. Respiración continua, sin generar presión abdominal alta.'
  },
  {
    nombre: 'Crunch en polea',
    grupo: 'Core', tipo: 'maquina', usaPeso: true,
    musculos: 'Recto abdominal, Oblicuos',
    tags: 'Cable crunch, Kneeling cable crunch',
    descripcion: 'Arrodillado frente a la polea alta con la cuerda detrás de la cabeza, flexioná el torso hacia abajo contrayendo los abdominales. Volvé controlado sin soltar la tensión. El peso extra permite progresión de fuerza en los abdominales. (Cable Crunch)'
  },
  // ── PECHO ───────────────────────────────────────────────────────────────────
  {
    nombre: 'Press de pecho',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    musculos: 'Pectoral mayor, Deltoides anterior, Tríceps',
    tags: 'Chest press machine, Seated chest press',
    descripcion: 'Sentado en la máquina de press de pecho, agarra las manijas al ancho de hombros o más. Empujá hacia adelante extendiendo los codos completamente y volvé lento. Pies apoyados, espalda pegada al respaldo. Trabaja pectoral mayor y anterior del deltoides. (Chest Press Machine)'
  },
  {
    nombre: 'Press Hammer',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    musculos: 'Pectoral mayor, Deltoides anterior, Tríceps',
    tags: 'Hammer strength chest press',
    descripcion: 'Sentado en la máquina Hammer Strength con agarre neutro o prono, empujá las palancas hacia adelante extendiendo los codos. Cada brazo trabaja de forma independiente, lo que permite corregir asimetrías. Movimiento guiado que permite cargar más peso con seguridad. Trabaja pectoral mayor, deltoides anterior y tríceps. (Hammer Strength Chest Press)'
  },
  {
    nombre: 'Press de banca con barra',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    musculos: 'Pectoral mayor, Deltoides anterior, Tríceps',
    tags: 'Barbell bench press, Bench press',
    descripcion: 'Acostado en banco plano, desenganchá la barra con agarre al ancho de hombros o más. Bajá la barra controlada hasta el pecho medio y empujá hacia arriba. Requiere estabilización de hombros y core. Trabaja pectoral mayor, deltoides anterior y tríceps con máxima demanda de estabilidad. (Barbell Bench Press)'
  },
  {
    nombre: 'Press inclinado en máquina',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    musculos: 'Pectoral mayor, Pectoral menor, Deltoides anterior',
    tags: 'Incline chest press machine',
    descripcion: 'Sentado en la máquina de press inclinado, empujá las palancas hacia arriba y adelante siguiendo la trayectoria guiada. El ángulo inclinado focaliza la porción clavicular del pectoral. Movimiento guiado que permite concentrarse en la contracción sin preocuparse por la estabilización. (Incline Chest Press Machine)'
  },
  {
    nombre: 'Fondos de pecho suspendido en maquina',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    musculos: 'Pectoral mayor, Tríceps, Deltoides anterior',
    tags: 'Assisted chest dips machine',
    descripcion: 'En la máquina de fondos asistida, sujetá las asas y bajá el cuerpo flexionando los codos hacia atrás y afuera (ligera inclinación del torso hacia adelante). Subí extendiendo. Cuanto más te inclinás, más trabajás el pecho versus los tríceps. (Assisted Chest Dips Machine)'
  },
  {
    nombre: 'Press inclinado con mancuernas',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    musculos: 'Pectoral mayor, Pectoral menor, Deltoides anterior',
    tags: 'Incline dumbbell press',
    descripcion: 'Recostado en banco a 30-45°, una mancuerna en cada mano al ancho de hombros. Bajá controlado hasta pecho y empujá hacia arriba. El ángulo inclinado focaliza la porción clavicular del pectoral. Mantené los codos a ~45° del torso. (Incline Dumbbell Press)'
  },
  {
    nombre: 'Pecho con polea doble',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    musculos: 'Pectoral mayor, Deltoides anterior',
    tags: 'Cable chest fly, Double cable fly',
    descripcion: 'De pie entre dos poleas altas, tomá un cable en cada mano. Con los brazos ligeramente flexionados, unilos frente al pecho en un arco amplio (como si abrazaras). Volvé controlado resistiendo la apertura. Trabaja el pectoral en contracción completa. (Cable Chest Fly)'
  },
  {
    nombre: 'TRX chest press',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    musculos: 'Pectoral mayor, Deltoides anterior, Tríceps',
    tags: 'TRX chest press, TRX push-up',
    descripcion: 'Con las correas del TRX, cuerpo inclinado hacia adelante. Bajá flexionando los codos como una flexión, empujá para volver. Más inclinación = más difícil. Trabaja pectoral y estabilidad. (TRX Chest Press)'
  },
  {
    nombre: 'TRX chest press narrow',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    musculos: 'Tríceps, Pectoral mayor, Deltoides anterior',
    tags: 'TRX narrow chest press, TRX close grip push-up',
    descripcion: 'Igual que TRX chest press pero con manos juntas (agarre cerrado). Al bajar los codos van pegados al cuerpo. Enfatiza tríceps y pectoral interno. Más inclinación = más difícil. (TRX Narrow Chest Press)'
  },
  {
    nombre: 'TRX archer press',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    musculos: 'Pectoral mayor, Deltoides anterior, Tríceps',
    tags: 'TRX archer push-up, TRX archer press',
    descripcion: 'Desde posición de TRX chest press, bajá llevando el peso hacia un brazo mientras el otro se extiende al costado como un arquero. Empujá con el brazo cargado para volver. Alterná lados. Trabaja pectoral unilateral con mayor intensidad. (TRX Archer Push-Up)'
  },
  {
    nombre: 'TRX pec press',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    musculos: 'Pectoral mayor (porción inferior), Tríceps, Deltoides anterior',
    tags: 'TRX pec press, TRX foot cradle chest press',
    descripcion: 'Agarrá los estribos de pies del TRX en vez de las agarraderas, con las palmas enfrentadas. Inclinado hacia adelante, bajá flexionando los codos pegados al cuerpo. Empujá para volver. El agarre en estribos cambia el ángulo y enfatiza la parte baja e interna del pecho. (TRX Pec Press)'
  },
  {
    nombre: 'Banda press de pecho',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    musculos: 'Pectoral mayor, Deltoides anterior, Tríceps',
    tags: 'Banded chest press, Resistance band press',
    descripcion: 'Con una banda de resistencia pasada por la espalda y sujetada en cada mano, empujá hacia adelante extendiendo los brazos. Resistencia progresiva: aumenta al final del movimiento. Ideal como complemento liviano de alto volumen. (Banded Chest Press)'
  },
  {
    nombre: 'Flexiones diamante',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    musculos: 'Tríceps, Pectoral mayor, Deltoides anterior',
    tags: 'Diamond push-up, Close grip push-up',
    descripcion: 'Flexión estándar pero con las manos juntas formando un triángulo (diamante) debajo del pecho. Esta posición cierra los codos junto al cuerpo, transfiriendo el trabajo del pecho a los tríceps. Ideal para activar la cabeza larga del tríceps. (Diamond Push-Up)'
  },
  {
    nombre: 'Aperturas con mancuernas',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    musculos: 'Pectoral mayor, Deltoides anterior',
    tags: 'Dumbbell fly, Chest fly',
    descripcion: 'Acostado en banco plano con una mancuerna en cada mano, brazos extendidos arriba. Abrí los brazos lateralmente con los codos levemente flexionados hasta sentir estiramiento en el pecho. Volvé cerrando el arco. Trabaja la porción esternal del pectoral en rango completo. (Dumbbell Fly)'
  },
  {
    nombre: 'Banda press de pecho a un brazo',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    musculos: 'Pectoral mayor, Deltoides anterior, Core',
    tags: 'Single arm band chest press, Standing band crossover, Band chest fly',
    descripcion: 'De pie, banda anclada a la espalda a altura de pecho. Con un brazo a la vez, empujá y cruzá la banda al frente en arco amplio. Controlá la vuelta. La posición de pie activa el core anti-rotación, la curva de fuerza coincide con la contracción máxima del pectoral y se elimina el riesgo de hombro de las aperturas en banco. (Single Arm Band Chest Press)'
  },
  {
    nombre: 'Banda fly de pecho a un brazo',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    musculos: 'Pectoral mayor, Deltoides anterior, Core',
    tags: 'Single arm standing band fly, Standing cable fly, Band chest fly',
    descripcion: 'De pie, banda anclada atrás a altura del hombro. Con el brazo extendido (codo levemente flexionado pero fijo), llevá la mano desde abierto al costado hasta el frente del pecho en arco amplio. Controlá la vuelta. A diferencia del press, el brazo no se flexiona — el movimiento es un arco como abrazar. De pie se elimina el riesgo de hombro del fly en banco y la tensión máxima coincide con la contracción del pec. (Standing Single Arm Band Fly)'
  },
  {
    nombre: 'Pullover con mancuerna',
    grupo: 'Pecho', tipo: 'maquina', usaPeso: true,
    musculos: 'Pectoral mayor, Dorsal ancho, Tríceps',
    tags: 'Dumbbell pullover',
    descripcion: 'Acostado en banco, sostén una mancuerna con ambas manos sobre el pecho. Bajá la mancuerna por detrás de la cabeza con los brazos casi extendidos hasta sentir el estiramiento. Volvé contrayendo pecho y dorsal. Trabaja pectoral, serrato y dorsal ancho. (Dumbbell Pullover)'
  },
  // ── ESPALDA ─────────────────────────────────────────────────────────────────
  {
    nombre: 'Dominadas abiertas',
    grupo: 'Espalda', tipo: 'maquina', usaPeso: true,
    musculos: 'Dorsal ancho, Romboides, Bíceps',
    tags: 'Wide grip pull-up',
    descripcion: 'Colgado de la barra con agarre prono y manos más separadas que los hombros. Empujá los codos hacia abajo y atrás hasta que el mentón supere la barra. Bajá controlado. Activa principalmente el dorsal ancho y da amplitud a la espalda. (Wide Grip Pull-Up)'
  },
  {
    nombre: 'Dominada en maquina ascensor',
    grupo: 'Espalda', tipo: 'maquina', usaPeso: true,
    musculos: 'Dorsal ancho, Romboides, Bíceps',
    tags: 'Assisted pull-up machine',
    descripcion: 'En la máquina asistida de dominadas, arrodillate sobre la plataforma y agarrá la barra. El contrapeso te ayuda a subir según el peso seleccionado. Misma técnica que la dominada libre: empuja codos abajo, pecho al frente. Ideal para progresar hacia dominadas sin asistencia. (Assisted Pull-Up Machine)'
  },
  {
    nombre: 'Remo en maquina',
    grupo: 'Espalda', tipo: 'maquina', usaPeso: true,
    musculos: 'Romboides, Trapecio, Bíceps',
    tags: 'Seated row machine, Machine row',
    descripcion: 'Sentado frente a la máquina de remo, pecho apoyado en el pad (si lo tiene). Tirá las manijas hacia el abdomen bajo llevando los codos hacia atrás. Al final de la contracción, apretá los omóplatos. Trabaja romboides, trapecio medio e inferior, y bíceps. (Seated Row Machine)'
  },
  {
    nombre: 'Remo en maquina separado',
    grupo: 'Espalda', tipo: 'maquina', usaPeso: true,
    musculos: 'Trapecio, Deltoides posterior, Romboides',
    tags: 'Wide grip machine row',
    descripcion: 'Similar al remo en máquina pero con agarre más amplio y codos hacia afuera en lugar de pegados al cuerpo. Focaliza más el trapecio medio y deltoides posterior. Las palmas pueden mirar hacia abajo (prono) para mayor activación de la parte media de la espalda. (Wide Grip Machine Row)'
  },
  {
    nombre: 'Remo alto en polea',
    grupo: 'Espalda', tipo: 'maquina', usaPeso: true,
    musculos: 'Deltoides posterior, Trapecio, Infraespinoso',
    tags: 'Cable high row, Face pull cable',
    descripcion: 'De pie frente a la polea alta, tirá el cable hacia la cara/cuello con codos hacia afuera (a la altura de los hombros). Activa el manguito rotador, deltoides posterior y trapecio. También llamado face pull o high row. Crucial para salud del hombro. (Cable High Row)'
  },
  {
    nombre: 'Jalón al pecho',
    grupo: 'Espalda', tipo: 'maquina', usaPeso: true,
    musculos: 'Dorsal ancho, Romboides, Bíceps',
    tags: 'Lat pulldown',
    descripcion: 'Sentado en la máquina de jalón, agarrá la barra con agarre prono más ancho que los hombros. Tirá la barra hacia el pecho superior inclinando ligeramente el torso hacia atrás. Sentí que los codos van hacia abajo y atrás. Trabaja el dorsal ancho en su porción superior. (Lat Pulldown)'
  },
  {
    nombre: 'Remo con mancuerna',
    grupo: 'Espalda', tipo: 'maquina', usaPeso: true,
    musculos: 'Dorsal ancho, Romboides, Bíceps',
    tags: 'Dumbbell row, Single arm row',
    descripcion: 'Con una rodilla y mano apoyadas en el banco, el otro brazo sostiene la mancuerna. Tirá la mancuerna hacia la cadera llevando el codo atrás y arriba. Bajá controlado. Trabaja dorsal ancho, romboides y bíceps de forma unilateral, permitiendo corregir asimetrías. (Dumbbell Row)'
  },
  {
    nombre: 'Pulldown agarre cerrado',
    grupo: 'Espalda', tipo: 'maquina', usaPeso: true,
    musculos: 'Dorsal ancho, Bíceps, Braquial',
    tags: 'Close grip lat pulldown',
    descripcion: 'Sentado en la máquina de jalón con agarre en V cerrado (palmas enfrentadas). Tirá hacia el pecho manteniendo los codos pegados al cuerpo. Trabaja la porción inferior del dorsal ancho con mayor participación del bíceps y braquial. (Close Grip Lat Pulldown)'
  },
  // ── HOMBROS ─────────────────────────────────────────────────────────────────
  {
    nombre: 'Vuelos laterales',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: true,
    musculos: 'Deltoides lateral, Trapecio',
    tags: 'Lateral raise, Side raise',
    descripcion: 'De pie con mancuernas, kettlebells o bandas a los costados, levantá los brazos lateralmente hasta la altura de los hombros con leve flexión en los codos. Bajá lento. Trabaja exclusivamente el deltoides lateral. (Lateral Raise)'
  },
  {
    nombre: 'Vuelo lateral inclinado',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: true,
    musculos: 'Deltoides lateral, Trapecio',
    tags: 'Leaning lateral raise, Incline lateral raise',
    descripcion: 'Agarrate de una columna o soporte con un brazo, incliná el cuerpo en diagonal alejándote del punto de apoyo. Con el brazo libre y una mancuerna, levantá lateralmente hasta la altura del hombro. El ángulo inclinado aumenta el rango de movimiento y mantiene tensión constante en el deltoides lateral, especialmente en la parte baja del recorrido. (Leaning Lateral Raise)'
  },
  {
    nombre: 'Pájaros con mancuerna',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: true,
    musculos: 'Deltoides posterior, Romboides, Trapecio medio',
    tags: 'Bent-over reverse fly, Rear delt fly',
    descripcion: 'Inclinado hacia adelante con el torso casi paralelo al piso, la espalda recta y una mancuerna en cada mano con las palmas enfrentadas. Con leve flexión en los codos, abrí los brazos lateralmente llevando las mancuernas hacia afuera y arriba, apretando los omóplatos. Bajá controlado. Trabaja el deltoides posterior y equilibra todo el trabajo de empuje. (Bent-over Reverse Fly)'
  },
  {
    nombre: 'Empuje de hombros con barra en banco',
    grupo: 'Hombros', tipo: 'maquina', usaPeso: true,
    musculos: 'Deltoides anterior, Tríceps, Trapecio',
    tags: 'Seated barbell shoulder press',
    descripcion: 'Sentado en banco con respaldo, barra apoyada en el pecho. Empujá hacia arriba hasta extensión y bajá controlado. Similar al press militar pero la barra permite mayor carga. Trabaja deltoides anterior con participación de tríceps y trapecios. (Seated Barbell Shoulder Press)'
  },
  {
    nombre: 'Face pulls',
    grupo: 'Hombros', tipo: 'maquina', usaPeso: true,
    musculos: 'Deltoides posterior, Infraespinoso, Trapecio',
    tags: 'Face pull, Cable face pull',
    descripcion: 'De pie frente a polea alta con cuerda, tirá hacia la cara abriendo los codos hacia afuera y hacia arriba. Al final las manos quedan a los lados de la cabeza, como si mostraras los bíceps. Trabaja deltoides posterior, manguito rotador y retractores de escápula. (Face Pull)'
  },
  {
    nombre: 'Elevaciones de hombro adelante',
    grupo: 'Hombros', tipo: 'maquina', usaPeso: true,
    musculos: 'Deltoides anterior, Pectoral mayor',
    tags: 'Front raise, Dumbbell front raise',
    descripcion: 'De pie con mancuernas frente al cuerpo, levantá los brazos hacia adelante hasta la altura de los hombros. Bajá controlado. Cada brazo trabaja independiente, corrigiendo desbalances. Puede hacerse alternado o simultáneo. (Dumbbell Front Raise)'
  },
  {
    nombre: 'Elevaciones de hombro adelante con disco',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: true,
    musculos: 'Deltoides anterior, Pectoral mayor, Core',
    tags: 'Plate front raise, Front raise with plate',
    descripcion: 'De pie sosteniendo un disco con ambas manos, levantá los brazos hacia adelante hasta la altura de los hombros. Bajá controlado. Las dos manos juntas permiten más carga y activan más el core por la posición centralizada del peso. (Plate Front Raise)'
  },
  {
    nombre: 'Elevaciones de hombro hacia arriba',
    grupo: 'Hombros', tipo: 'maquina', usaPeso: true,
    musculos: 'Trapecio, Deltoides lateral',
    tags: 'encogimientos con mancuernas, shrugs',
    descripcion: 'Con mancuernas o barra, elevá los hombros hacia las orejas (encogimiento) sin doblar los codos. Mantené un segundo arriba y bajá lento. Trabaja trapecios superiores. Útil para equilibrar la musculatura del cuello y parte alta de la espalda.'
  },
  {
    nombre: 'Arnold press',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: true,
    musculos: 'Deltoides anterior, Deltoides lateral, Deltoides posterior',
    tags: 'arnold press con kettlebell, press arnold',
    descripcion: 'Con mancuernas o kettlebell al nivel del mentón, palmas hacia vos. Al empujar hacia arriba, rotá las muñecas hasta que las palmas miren hacia afuera al final. Bajá invirtiendo la rotación. Trabaja las tres cabezas del deltoides en un solo movimiento.'
  },
  // ── BRAZOS ──────────────────────────────────────────────────────────────────
  {
    nombre: 'Bíceps curl con barra',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    musculos: 'Bíceps, Braquial, Antebrazo',
    tags: 'Barbell bicep curl',
    descripcion: 'De pie con la barra en agarre supino, codos pegados al cuerpo. Flexioná los codos subiendo la barra hacia el pecho sin mover los hombros. Bajá lento controlando la extensión. Trabaja cabeza larga y corta del bíceps braquial. (Barbell Bicep Curl)'
  },
  {
    nombre: 'Bíceps curl con mancuerna',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    musculos: 'Bíceps, Braquial, Antebrazo',
    tags: 'Dumbbell bicep curl',
    descripcion: 'De pie o sentado, una mancuerna en cada mano en agarre supino. Flexioná alternando o simultáneamente manteniendo los codos fijos al costado. Permite rotar la muñeca al subir para mayor contracción del bíceps. Bajá controlado. (Dumbbell Bicep Curl)'
  },
  {
    nombre: 'Bíceps curl martillo',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    musculos: 'Braquial, Bíceps, Antebrazo',
    tags: 'Hammer curl',
    descripcion: 'Agarre neutro (palmas enfrentadas). Con mancuerna o kettlebell, flexioná el codo sin rotar la muñeca. Trabaja braquial, braquiorradial y la parte externa del bíceps. (Hammer Curl)'
  },
  {
    nombre: 'Biceps en banco',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    musculos: 'Bíceps, Braquial',
    tags: 'Preacher curl, Incline bench curl',
    descripcion: 'Sentado en banco inclinado (~45°), brazos colgando atrás del cuerpo con mancuernas. Flexioná los codos subiendo las mancuernas. La posición inclinada estira la cabeza larga del bíceps al inicio, aumentando el rango de activación. Excelente para peak de bíceps. (Preacher Curl)'
  },
  {
    nombre: 'Biceps alto en polea',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    musculos: 'Bíceps, Braquial',
    tags: 'High cable curl, Overhead cable curl',
    descripcion: 'De pie frente a una polea alta (o a los costados con poleas), con el brazo elevado a la altura del hombro, flexioná el codo llevando la mano hacia la oreja. Trabaja el bíceps en posición acortada (ángulo de 90° del hombro). Alta activación de la cabeza corta. (High Cable Curl)'
  },
  {
    nombre: 'Triceps con polea',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    musculos: 'Tríceps, Antebrazo',
    tags: 'Tricep pushdown, Cable tricep pushdown',
    descripcion: 'De pie frente a la polea alta con barra recta o cuerda, codos pegados al cuerpo. Extendé los codos empujando hacia abajo hasta extensión completa y volvé lento. Codos fijos al cuerpo en todo momento. Trabaja los tres vientres del tríceps con especial énfasis en el lateral. (Tricep Pushdown)'
  },
  {
    nombre: 'Extensión de triceps sobre cabeza',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    musculos: 'Tríceps',
    tags: 'extensión de tríceps con kettlebell, overhead triceps extension',
    descripcion: 'Sentado o de pie, sostén una mancuerna, barra o kettlebell por detrás de la cabeza con los codos apuntando al techo. Extendé los codos hasta arriba y bajá controlado. Trabaja principalmente la cabeza larga del tríceps. Mantené los codos cerca de las orejas sin abrirlos.'
  },
  {
    nombre: 'Banda triceps pushdown',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: false,
    musculos: 'Tríceps, Antebrazo',
    tags: 'Banded tricep pushdown, Band pushdown',
    descripcion: 'Con una banda de resistencia anclada arriba, empujá hacia abajo extendiendo los codos completamente. Similar al triceps en polea pero con banda. Resistencia progresiva. Útil como finalizador de alto volumen para mantener tensión en todo el rango. (Banded Tricep Pushdown)'
  },
  {
    nombre: 'French press',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    musculos: 'Tríceps, Antebrazo',
    tags: 'Skull crusher, Lying tricep extension',
    descripcion: 'Acostado en banco plano con barra o mancuernas, brazos extendidos vertical. Flexioná los codos bajando el peso hacia la frente o detrás de la cabeza, manteniendo los codos fijos apuntando al techo. Extendé volviendo a la posición inicial. Trabaja la cabeza larga del tríceps con máximo estiramiento. (Skull Crusher)'
  },
  {
    nombre: 'Bíceps curl con banda',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: false,
    musculos: 'Bíceps, Braquial, Antebrazo',
    tags: 'Banded bicep curl, Resistance band curl',
    descripcion: 'Parado sobre la banda con agarre supino en cada extremo, flexioná los codos subiendo los puños hacia los hombros. La resistencia aumenta al final del movimiento. Permite trabajar sin mancuernas y en cualquier entorno. Alto volumen con bajo impacto articular. (Banded Bicep Curl)'
  },
  {
    nombre: 'Bíceps curl concentrado',
    grupo: 'Brazos', tipo: 'maquina', usaPeso: true,
    musculos: 'Bíceps, Braquial',
    tags: 'Concentration curl',
    descripcion: 'Sentado con el codo apoyado en la cara interna del muslo, una mancuerna en la mano. Flexioná el brazo subiendo la mancuerna hacia el hombro y bajá controlado. El apoyo en el muslo elimina impulso y aísla completamente el bíceps. Ideal para contracción pico. (Concentration Curl)'
  },
  {
    nombre: 'Fondos en banco',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: false,
    musculos: 'Tríceps, Deltoides anterior, Pectoral mayor',
    tags: 'Bench dips, Tricep dips on bench',
    descripcion: 'Con las manos apoyadas en un banco detrás y los pies en el suelo, bajá el cuerpo flexionando los codos hasta 90° y subí empujando. Codos apuntan hacia atrás, no hacia afuera. Trabaja tríceps, deltoides anterior y pectorales. Se puede agregar peso en las piernas. (Bench Dips)'
  },
  // ── GLÚTEOS ─────────────────────────────────────────────────────────────────
  {
    nombre: 'Empuje de cadera en cajon',
    grupo: 'Glúteos', tipo: 'maquina', usaPeso: true,
    musculos: 'Glúteos, Isquiotibiales, Cuádriceps',
    tags: 'hip thrust, glute bridge',
    descripcion: 'Con la espalda apoyada en un cajón o banco y una barra/mancuernas sobre las caderas, empujá la cadera hacia arriba extendiendo la cadera. Mantené las rodillas a 90° y apretá los glúteos al tope. Bajá sin tocar el piso. También conocido como hip thrust.'
  },
  {
    nombre: 'Empuje de cadera en piso con peso',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: true,
    musculos: 'Glúteos, Isquiotibiales',
    tags: 'glute bridge, hip thrust, puente de gluteos',
    descripcion: 'Acostado boca arriba con las rodillas flexionadas y los pies en el piso, colocá una kettlebell o plato sobre el abdomen bajo. Empujá la cadera hacia arriba apretando los glúteos al tope. Bajá controlado sin tocar el piso. Variante sin cajón del hip thrust.'
  },
  {
    nombre: 'Gluteos patada en polea',
    grupo: 'Glúteos', tipo: 'maquina', usaPeso: true,
    musculos: 'Glúteos, Isquiotibiales',
    tags: 'Cable kickback, Cable glute kickback',
    descripcion: 'Parada frente a la polea baja con el tobillo enganchado al cable, empujá la pierna hacia atrás y arriba extendiendo la cadera. Mantené el torso levemente inclinado y la pelvis estable. Bajá controlado. Trabaja glúteo mayor en aislamiento. (Cable Kickback)'
  },
  {
    nombre: 'Aductores en maquina',
    grupo: 'Glúteos', tipo: 'maquina', usaPeso: true,
    musculos: 'Aductores',
    tags: 'Adductor machine, Hip adduction',
    descripcion: 'Sentada en la máquina de aductores con los pads en la cara interna de los muslos, cerrá las piernas contra la resistencia. Bajá lento resistiendo la apertura. Trabaja aductores (grácil, pectíneo, aductor largo/corto). Complementa el trabajo de glúteos y caderas. (Adductor Machine)'
  },
  {
    nombre: 'Abductores en maquina',
    grupo: 'Glúteos', tipo: 'maquina', usaPeso: true,
    musculos: 'Abductores, Glúteos',
    tags: 'Abductor machine, Hip abduction',
    descripcion: 'Sentada en la máquina con los pads en la cara externa de los muslos, abrí las piernas contra la resistencia. Volvé controlado. Trabaja glúteo medio y menor, claves para la estabilidad de cadera y la forma del glúteo lateral. (Abductor Machine)'
  },
  {
    nombre: 'Peso muerto sumo',
    grupo: 'Glúteos', tipo: 'maquina', usaPeso: true,
    musculos: 'Glúteos, Aductores, Isquiotibiales',
    tags: 'Sumo deadlift',
    descripcion: 'Con pies muy separados y puntas afuera, agarrá la barra entre las piernas con brazos rectos. Levantá extendiendo las caderas, mantené la espalda recta. Activa glúteos y aductores más que el peso muerto convencional. Excelente para fortalecer la cadena posterior. (Sumo Deadlift)'
  },
  // ── HIIT / FUNCIONAL ────────────────────────────────────────────────────────
  {
    nombre: 'Plancha estrella con peso',
    grupo: 'Core', tipo: 'funcional', usaPeso: true,
    musculos: 'Oblicuos, Glúteos, Deltoides lateral',
    tags: 'Weighted side plank star, Side plank with raise',
    descripcion: 'En plancha lateral, elevá la pierna superior abierta en posición de estrella. Con el brazo libre sosteniendo una mancuerna, subí y bajá el peso con el brazo extendido desde la cadera hasta arriba. Trabaja oblicuos, glúteo medio, deltoides y estabilidad de todo el cuerpo. Mantené la cadera elevada y el core firme durante todo el movimiento. (Weighted Side Plank Star)'
  },
  {
    nombre: 'Copenhague',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    musculos: 'Aductores, Oblicuos, Glúteos',
    tags: 'Copenhagen plank, Copenhagen adductor',
    descripcion: 'En posición de plancha lateral, apoyá la pierna de arriba sobre un banco o cajón con la cara interna del pie. La pierna de abajo queda suspendida. Subí y bajá la cadera manteniendo el cuerpo alineado. Trabaja aductores, core y estabilidad de cadera. Excelente para prevención de lesiones de ingle. (Copenhagen Plank)'
  },
  {
    nombre: 'Pasadas de velocidad',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Cuádriceps, Isquiotibiales, Glúteos, Gemelos',
    tags: 'Sprint, Speed run',
    descripcion: 'Carreras de máxima intensidad en distancias cortas (40-60m). Salir explosivamente, mantener la velocidad y desacelerar al final. Descansar caminando de vuelta. Trabaja potencia de piernas, sistema cardiovascular y resistencia anaeróbica. (Sprint)'
  },
  {
    nombre: 'Burpees',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Cuádriceps, Pectoral mayor, Deltoides anterior',
    tags: 'Burpees',
    descripcion: 'Desde parado, agacharse y apoyar las manos en el piso, saltar los pies hacia atrás a posición de plancha, hacer una flexión, saltar los pies hacia adelante y saltar verticalmente con los brazos arriba. Trabaja todo el cuerpo: pecho, piernas, core y cardio. (Burpees)'
  },
  {
    nombre: 'Saltos al cajón',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Cuádriceps, Glúteos, Gemelos',
    tags: 'Box jump',
    descripcion: 'Parado frente a un cajón pliométrico, flexionar rodillas y saltar explosivamente aterrizando con ambos pies arriba del cajón. Pararse completamente y bajar con control. Trabaja potencia de piernas, glúteos y coordinación. (Box Jump)'
  },
  {
    nombre: 'Saltos laterales',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Abductores, Cuádriceps, Gemelos',
    tags: 'Lateral jumps, Side to side jumps',
    descripcion: 'De pie con los pies juntos, saltar lateralmente de un lado a otro sobre una línea o valla baja. Aterrizar suave con las rodillas semiflexionadas. Trabaja agilidad, estabilidad de tobillos y potencia lateral. (Lateral Jumps)'
  },
  {
    nombre: 'Sentadilla con salto',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Cuádriceps, Glúteos, Gemelos',
    tags: 'Jump squat, Squat jump',
    descripcion: 'Realizar una sentadilla profunda y al subir explotar en un salto vertical con los brazos arriba. Aterrizar suave y volver directo a la sentadilla. Trabaja cuádriceps, glúteos y potencia explosiva. (Jump Squat)'
  },
  {
    nombre: 'Tuck jumps',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Cuádriceps, Glúteos, Recto abdominal',
    tags: 'Tuck jumps, Tuck jump',
    descripcion: 'Desde parado, saltá verticalmente llevando las rodillas al pecho en el aire. Aterrizá suave con rodillas semiflexionadas y repetí. Trabaja potencia explosiva de piernas, cuádriceps, core y sistema cardiovascular. (Tuck Jumps)'
  },
  {
    nombre: 'Estocada con salto',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Cuádriceps, Glúteos, Isquiotibiales',
    tags: 'Jump lunge, Split jump',
    descripcion: 'Desde posición de zancada, saltar y alternar las piernas en el aire, aterrizando en zancada con la pierna contraria adelante. Mantener el torso erguido. Trabaja cuádriceps, glúteos, coordinación y potencia. (Jump Lunge)'
  },
  {
    nombre: 'Estocada-estocada-sentadilla con salto',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Cuádriceps, Glúteos, Gemelos',
    tags: 'Lunge lunge squat jump',
    descripcion: 'Combo explosivo: estocada con salto pierna izquierda, estocada con salto pierna derecha, sentadilla con salto con ambas piernas. Repetir la secuencia sin pausa. Trabaja potencia, coordinación y cardio. (Lunge Lunge Squat Jump)'
  },
  {
    nombre: 'Jumping jacks',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Cuádriceps, Deltoides lateral, Gemelos',
    tags: 'Jumping jacks',
    descripcion: 'De pie con los pies juntos y brazos al costado, saltar abriendo las piernas al ancho de hombros mientras subís los brazos por arriba de la cabeza. Volver a la posición inicial saltando. Ejercicio cardiovascular completo. (Jumping Jacks)'
  },
  {
    nombre: 'Caminata a plancha',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Recto abdominal, Deltoides anterior, Isquiotibiales',
    tags: 'Inchworm, Inchworm exercise',
    descripcion: 'De pie, flexionar la cadera y caminar con las manos hacia adelante hasta llegar a posición de plancha. Mantener 2 segundos y caminar con las manos de vuelta hasta pararse. Trabaja core, hombros, flexibilidad de isquiotibiales. (Inchworm)'
  },
  {
    nombre: 'Caminata de granjero',
    grupo: 'Core', tipo: 'funcional', usaPeso: true,
    musculos: 'Trapecio, Antebrazo, Core, Deltoides',
    tags: "Farmer's walk, Farmer carry",
    descripcion: "Agarrá una kettlebell o mancuerna pesada en cada mano y caminá con pasos controlados manteniendo el torso erguido, hombros atrás y core activado. Trabaja agarre, trapecio, estabilidad de core y resistencia general. Se puede hacer también con un solo peso (suitcase carry) para mayor demanda anti-lateral del core. (Farmer's Walk)"
  },
  {
    nombre: 'Mountain climbers',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Recto abdominal, Deltoides anterior, Cuádriceps',
    tags: 'Mountain climbers',
    descripcion: 'En posición de plancha alta, llevar una rodilla al pecho alternando piernas rápidamente como si corrieras en el lugar. Mantener la cadera baja y el core activado. Trabaja abdominales, hombros y cardio. (Mountain Climbers)'
  },
  {
    nombre: 'Abs complex',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Recto abdominal, Oblicuos, Transverso abdominal',
    tags: 'HIIT, circuito',
    descripcion: 'Circuito abdominal sin pausa. Variante A: Hollow body (10s) + Dead bug (6 reps) + Elevación de piernas (8 reps). Variante B: crunches + bicicleta + elevación de piernas + plancha (10-15 reps c/u). Trabaja core anterior, oblicuos y estabilización.'
  },
  // ── FUNCIONAL / RÍO ────────────────────────────────────────────────────────
  {
    nombre: 'Flexiones',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    musculos: 'Pectoral mayor, Deltoides anterior, Tríceps',
    tags: 'Push-up, Push-ups',
    descripcion: 'Cuerpo recto como tabla, manos al ancho de hombros. Bajá el pecho al suelo flexionando los codos a ~45° del torso y empujá hasta extensión. Trabaja pectoral, deltoides anterior y tríceps. Ejercicio base de empuje con peso corporal. (Push-Up)'
  },
  {
    nombre: 'Flexiones explosivas',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    musculos: 'Pectoral mayor, Tríceps, Deltoides anterior',
    tags: 'Explosive push-up, Plyometric push-up',
    descripcion: 'Flexión donde al subir empujás con fuerza suficiente para que las manos se despeguen del suelo. Aterrizá suave y repetí. Trabaja potencia de pectoral y tríceps. Podés aplaudir arriba para mayor dificultad. (Explosive Push-Up)'
  },
  {
    nombre: 'Flexiones declinadas',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    musculos: 'Pectoral mayor (superior), Deltoides anterior, Tríceps',
    descripcion: 'Flexiones con los pies elevados en un banco. El ángulo de declive traslada el trabajo al pectoral superior y deltoides anterior, y es más difícil que la flexión standard. Mantené el core firme y bajá el pecho controlado entre las manos.',
    tags: 'Decline push-up, Decline pushup'
  },
  {
    nombre: 'Flexiones inclinadas',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    musculos: 'Pectoral mayor (inferior), Tríceps',
    descripcion: 'Flexiones con las manos elevadas en un banco o superficie. El ángulo inclinado traslada el trabajo al pectoral inferior y es más fácil que la flexión standard. Mantené el core firme y bajá el pecho controlado hacia el borde del banco.',
    tags: 'Incline push-up, Incline pushup'
  },
  {
    nombre: 'Dips en paralelas',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    musculos: 'Pectoral mayor, Tríceps, Deltoides anterior',
    tags: 'Parallel bar dips, Chest dips',
    descripcion: 'Apoyado en barras paralelas, bajá el cuerpo flexionando los codos con el torso inclinado hacia adelante. Subí empujando. La inclinación enfatiza el pectoral; más erguido trabaja más tríceps. Codos a ~45° del cuerpo. (Parallel Bar Dips)'
  },
  {
    nombre: 'Dominadas',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    musculos: 'Dorsal ancho, Romboides, Trapecio, Bíceps',
    tags: 'Pull-up, Pull-ups',
    descripcion: 'Colgado de la barra con agarre prono al ancho de hombros, empujá los codos hacia abajo hasta que el mentón supere la barra. Bajá controlado a extensión completa. Trabaja dorsal ancho, romboides, trapecio y bíceps. (Pull-Up)'
  },
  {
    nombre: 'Dominadas australianas',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    musculos: 'Dorsal ancho, Romboides, Bíceps',
    tags: 'Australian pull-up, Inverted row',
    descripcion: 'Remo invertido bajo una barra baja con los pies en el suelo y el cuerpo recto. Tirá el pecho hacia la barra apretando omóplatos. Ajustá el ángulo del cuerpo para mayor o menor dificultad. Trabaja dorsales, romboides y bíceps. (Australian Pull-Up)'
  },
  {
    nombre: 'Dominadas cerradas',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    musculos: 'Dorsal ancho, Bíceps, Braquial',
    tags: 'Close grip pull-up, Chin-up',
    descripcion: 'Dominada con agarre supino o neutro cerrado, manos al ancho de hombros o menos. Mayor participación de bíceps y braquial que el agarre abierto. Subí hasta que el mentón supere la barra y bajá controlado. (Close Grip Pull-Up)'
  },
  {
    nombre: 'Dominadas grip neutro',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    musculos: 'Dorsal ancho, Bíceps, Romboides',
    tags: 'Neutral grip pull-up',
    descripcion: 'Dominada con palmas enfrentadas (agarre neutro). Posición más natural para el hombro que permite mayor rango de movimiento. Trabaja dorsales y bíceps de forma equilibrada con menor estrés articular. (Neutral Grip Pull-Up)'
  },
  {
    nombre: 'TRX row',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    musculos: 'Dorsal ancho, Romboides, Bíceps',
    tags: 'TRX row, TRX inverted row',
    descripcion: 'Colgado de las correas del TRX con el cuerpo inclinado, tirá el pecho hacia las manos llevando los codos atrás. Apretá omóplatos al final. Cuanto más horizontal el cuerpo, más difícil. Trabaja dorsales, romboides y bíceps. (TRX Row)'
  },
  {
    nombre: 'TRX power pull',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    musculos: 'Dorsal ancho, Romboides, Oblicuos',
    tags: 'TRX power pull',
    descripcion: 'Colgado del TRX con una mano, cuerpo inclinado. Tirá con un brazo mientras rotás el torso y extendés el brazo libre hacia el techo. Volvé controlado. Trabaja dorsales, romboides, oblicuos y estabilizadores con componente rotacional. (TRX Power Pull)'
  },
  {
    nombre: 'Remo alto en TRX',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    musculos: 'Deltoides posterior, Trapecio, Infraespinoso',
    tags: 'TRX high row',
    descripcion: 'Remo en TRX con codos altos a la altura de los hombros, tirando hacia la cara. Similar a un face pull pero con peso corporal. Enfatiza deltoides posterior, trapecio medio y rotadores externos del hombro. (TRX High Row)'
  },
  {
    nombre: 'TRX face pull',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: false,
    musculos: 'Deltoides posterior, Infraespinoso, Trapecio',
    tags: 'TRX face pull',
    descripcion: 'Con las correas del TRX, tirá hacia la cara abriendo los codos y rotando externamente los hombros al final. Las manos quedan a los lados de la cabeza. Trabaja deltoides posterior, manguito rotador y retractores de escápula. (TRX Face Pull)'
  },
  {
    nombre: 'Muscle-up negativo en barra',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    musculos: 'Dorsal ancho, Pectoral mayor, Tríceps, Bíceps',
    tags: 'Negative muscle-up, Muscle-up negative',
    descripcion: 'Empezá arriba de la barra (saltando o con impulso) y bajá lo más lento posible: primero la fase de dip y luego la fase de dominada. Trabaja la fuerza excéntrica necesaria para progresar hacia el muscle-up completo. (Negative Muscle-Up)'
  },
  {
    nombre: 'Banda pull-apart',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: false,
    musculos: 'Romboides, Trapecio, Deltoides posterior',
    tags: 'Band pull-apart, Resistance band pull-apart',
    descripcion: 'Con banda tomada frente al pecho con ambas manos, separá las manos estirando la banda hasta que toque el pecho. Apretá omóplatos al final. Trabaja romboides, trapecio medio y deltoides posterior. (Band Pull-Apart)'
  },
  {
    nombre: 'Banda lateral walk',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: false,
    musculos: 'Glúteos, Abductores',
    tags: 'Banded lateral walk, Monster walk',
    descripcion: 'Con una mini-band en tobillos o rodillas, caminá lateralmente con pasos cortos manteniendo tensión constante. Rodillas semiflexionadas, torso erguido. Activa glúteo medio, abductores y estabilizadores de cadera. (Banded Lateral Walk)'
  },
  {
    nombre: 'Rotación de hombros',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: false,
    musculos: 'Deltoides anterior, Deltoides posterior, Infraespinoso',
    tags: 'Shoulder rotation, Arm circles',
    descripcion: 'Círculos amplios con los brazos, progresando de pequeños a grandes, hacia adelante y atrás. Calienta la articulación del hombro activando deltoides, manguito rotador y trapecios. Esencial antes de ejercicios de tren superior. (Shoulder Rotation)'
  },
  {
    nombre: 'Rotación torácica',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Oblicuos, Erector espinal, Transverso abdominal',
    tags: 'Thoracic rotation, T-spine rotation',
    descripcion: 'En cuatro puntos o sentado, con una mano detrás de la cabeza, rotá el torso abriendo el codo hacia el techo. Volvé controlado. Mejora la movilidad torácica sin compensar con la lumbar. Ideal antes de empuje y tracción. (Thoracic Rotation)'
  },
  {
    nombre: 'Cat-cow',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Erector espinal, Recto abdominal, Transverso abdominal',
    tags: 'movilidad, recovery, calentamiento',
    descripcion: 'En 4 apoyos. En la fase "cat" redondeá toda la columna hacia arriba llevando el mentón al pecho. En la fase "cow" dejá caer el abdomen y mirá al frente. Cuello relajado, coordinando con la respiración. Moviliza toda la columna, alivia tensión y prepara la espalda.'
  },
  {
    nombre: 'Hip 90/90 mobility',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Glúteos, Aductores, Hip flexors',
    tags: 'Hip 90/90 mobility, 90/90 hip stretch',
    descripcion: 'Sentado en el suelo con ambas piernas a 90°, rotá las caderas alternando la posición de las piernas de un lado al otro. Mejora la rotación interna y externa de cadera, clave para sentadillas y zancadas. (Hip 90/90 Mobility)'
  },
  {
    nombre: 'Movilidad de cadera',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Glúteos, Aductores, Hip flexors',
    tags: 'Hip mobility, Hip circles',
    descripcion: 'Serie de movimientos para abrir las caderas: círculos, 90/90, estocadas profundas, apertura de mariposa. Mejora el rango de movimiento de cadera y previene lesiones en ejercicios de tren inferior. (Hip Mobility)'
  },
  {
    nombre: 'Movilidad de hombros',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: false,
    musculos: 'Deltoides anterior, Deltoides posterior, Infraespinoso',
    tags: 'Shoulder mobility, Shoulder dislocates',
    descripcion: 'Secuencia de rotaciones, dislocaciones y círculos de hombro para preparar la articulación. Incluye rotación interna/externa, flexión y extensión activa. Previene lesiones del manguito rotador. (Shoulder Mobility)'
  },
  {
    nombre: 'Activación glúteo con loop band',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: false,
    musculos: 'Glúteos, Abductores',
    tags: 'Banded glute activation, Glute band warmup',
    descripcion: 'Con una mini-band en las rodillas, hacé puentes de glúteo, clamshells o abducción lateral. Activa glúteo medio y mayor antes del entrenamiento de piernas. Mejora la conexión mente-músculo y protege la espalda baja. (Banded Glute Activation)'
  },
  {
    nombre: 'Loop band abducción parada',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: false,
    musculos: 'Glúteos, Abductores',
    tags: 'Standing banded hip abduction',
    descripcion: 'De pie con mini-band en los tobillos, levantá una pierna lateralmente contra la resistencia manteniendo el torso erguido. Activa glúteo medio y estabilizadores de cadera en posición funcional. (Standing Banded Hip Abduction)'
  },
  {
    nombre: 'Patada de glúteo con tobillera',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: true,
    musculos: 'Glúteos, Isquiotibiales',
    tags: 'patada de glúteo con tobillera 4k',
    descripcion: 'En cuatro puntos o apoyada en banco, con tobillera con peso, extendé una pierna hacia atrás y arriba. Apretá glúteos arriba y bajá controlado. Aislamiento de glúteo mayor con resistencia adicional.'
  },
  {
    nombre: 'Ab wheel',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Recto abdominal, Oblicuos, Transverso abdominal',
    tags: 'Ab wheel rollout, Ab roller',
    descripcion: 'Arrodillado con la rueda abdominal, rodá hacia adelante extendiendo el cuerpo lo más posible manteniendo el core firme y la espalda sin arquear. Volvé contrayendo abdominales. Trabaja recto abdominal, oblicuos y serrato con intensidad alta. (Ab Wheel Rollout)'
  },
  {
    nombre: 'Hollow body',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Recto abdominal, Transverso abdominal, Hip flexors',
    tags: 'Hollow body hold, Hollow hold',
    descripcion: 'Acostado boca arriba, levantá hombros y piernas del suelo con los brazos extendidos junto a las orejas. Mantené la zona lumbar pegada al piso. Posición de tensión total del core anterior. Mantené el tiempo indicado. (Hollow Body Hold)'
  },
  {
    nombre: 'L-sit en paralelas',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Recto abdominal, Hip flexors, Tríceps',
    tags: 'L-sit on parallettes, L-sit',
    descripcion: 'Apoyado en barras paralelas con los brazos extendidos, elevá las piernas rectas hasta paralelas al suelo formando una L. Mantené la posición. Trabaja abdominales, flexores de cadera y tríceps isométrico. (L-Sit on Parallettes)'
  },
  {
    nombre: 'Plancha con elevación alternada',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Transverso abdominal, Oblicuos, Glúteos',
    tags: 'Plank with alternating limb raise, Bird-dog plank',
    descripcion: 'Desde posición de plancha, levantá brazo y pierna opuestos alternando (bird-dog en plancha). Mantené 2s cada lado sin rotar la cadera. Trabaja anti-rotación del core y coordinación neuromuscular. (Plank with Alternating Limb Raise)'
  },
  {
    nombre: 'Plancha en paralelas',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Recto abdominal, Transverso abdominal, Deltoides anterior',
    tags: 'Plank on parallettes',
    descripcion: 'Plancha con las manos apoyadas en barras paralelas. La elevación aumenta el rango y la inestabilidad. Mantené el cuerpo recto activando core y glúteos. Trabaja estabilidad de hombros y core profundo. (Plank on Parallettes)'
  },
  {
    nombre: 'Plancha commando',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Transverso abdominal, Deltoides anterior, Tríceps',
    descripcion: 'Desde plancha en codos, subí a plancha en manos un brazo a la vez, y bajá alternando el brazo que inicia. Mantené la cadera estable sin rotar. Trabaja core antirotación, tríceps y estabilidad de hombros.',
    tags: 'plancha comando, commando plank, up down plank'
  },
  {
    nombre: 'Bear crawl',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Deltoides anterior, Cuádriceps, Recto abdominal',
    tags: 'Bear crawl',
    descripcion: 'En cuatro puntos con las rodillas apenas despegadas del suelo, avanzá moviendo mano y pie opuestos simultáneamente. Mantené la espalda plana y la cadera baja. Trabaja core, hombros, cuádriceps y coordinación. (Bear Crawl)'
  },

  // ── CASA — VARIANTES CON EQUIPAMIENTO ──────────────────────────────────────
  // Kettlebell
  {
    nombre: 'Sentadilla goblet',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos, Isquiotibiales',
    tags: 'goblet squat',
    descripcion: 'Sostené la kettlebell contra el pecho con ambas manos. Pies al ancho de hombros, bajá a sentadilla profunda manteniendo codos entre las rodillas y torso erguido. Empujá talones para subir.'
  },
  {
    nombre: 'Peso muerto rumano con kettlebell',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Isquiotibiales, Glúteos, Erector espinal',
    tags: 'Kettlebell Romanian deadlift, KB RDL',
    descripcion: 'De pie con la kettlebell en ambas manos. Incliná el torso hacia adelante con las piernas casi rectas hasta sentir estiramiento en femorales. Volvé con la cadera. Trabaja isquiotibiales y glúteos. (Kettlebell Romanian Deadlift)'
  },
  {
    nombre: 'Peso muerto dividido',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Isquiotibiales, Glúteos, Erector espinal',
    tags: 'Split stance deadlift, Staggered deadlift',
    descripcion: 'De pie con un pie adelante y el otro atrás (stance dividido), ambos apoyados en el piso. Bajá el peso con bisagra de cadera manteniendo espalda neutra. Más estable que a una pierna, permite cargar más peso. Trabaja cadena posterior con énfasis en el lado de la pierna adelantada. (Split Stance Deadlift)'
  },
  {
    nombre: 'Squat to press con kettlebell',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos, Deltoides anterior',
    tags: 'thruster, sentadilla con press',
    descripcion: 'Sostenés la kettlebell con ambas manos a la altura del pecho (posición goblet). Bajá a sentadilla profunda y al subir empujá la kettlebell hacia arriba en press sobre la cabeza estirando los brazos. Bajá la kettlebell al pecho y repetí. Trabaja piernas, hombros y core en un solo movimiento.'
  },
  {
    nombre: 'Squat to press a una mano con kettlebell',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos, Deltoides anterior',
    tags: 'Single arm kettlebell thruster',
    descripcion: 'Kettlebell en una mano a la altura del hombro (rack). Bajá a sentadilla profunda y al subir empujá la kettlebell en press sobre la cabeza con un brazo. Bajá al hombro y repetí. Alterná manos entre series. Genera inestabilidad que activa más el core. (Single Arm Kettlebell Thruster)'
  },
  {
    nombre: 'Peso muerto a una pierna',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Isquiotibiales, Glúteos, Erector espinal',
    tags: 'Single leg deadlift, Single leg RDL',
    descripcion: 'De pie sobre una pierna, kettlebell en la mano contraria. Incliná el torso hacia adelante levantando la pierna libre estirada hacia atrás hasta quedar en T. Volvé controlado. Trabaja femorales, glúteos y equilibrio. (Single Leg Deadlift)'
  },
  {
    nombre: 'Empuje de cadera',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: false,
    musculos: 'Glúteos, Isquiotibiales',
    tags: 'hip thrust, glute bridge, puente de gluteos',
    descripcion: 'Espalda apoyada en un banco o el piso, peso sobre la cadera. Empujá la cadera hacia arriba apretando glúteos en el tope. Bajá controlado. Excelente activador de glúteo mayor.'
  },
  {
    nombre: 'Hip thrust a una pierna',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: false,
    musculos: 'Glúteos, Isquiotibiales',
    tags: 'empuje de cadera una pierna, single leg glute bridge',
    descripcion: 'Espalda apoyada en banco, una pierna extendida en el aire. Empujá la cadera hacia arriba con la pierna de apoyo apretando el glúteo. Bajá controlado. Trabaja glúteo mayor unilateral con énfasis en estabilidad.'
  },
  {
    nombre: 'Abducción con pausa',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: false,
    musculos: 'Glúteos, Abductores',
    tags: 'Hip abduction with pause',
    descripcion: 'De costado o parada, elevá la pierna hacia afuera y mantené 2-3 segundos en el punto más alto. Bajá controlado. La pausa aumenta la tensión en glúteo medio y menor. (Hip Abduction with Pause)'
  },
  {
    nombre: 'Step up',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos',
    tags: 'step-up en banco, step-up',
    descripcion: 'Frente a un banco o cajón, subí con una pierna y extendé la cadera arriba. Bajá controlado con la misma pierna. Se puede agregar peso con kettlebell o chaleco. Trabaja cuádriceps, glúteos y equilibrio.'
  },
  {
    nombre: 'Pistol squat',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos, Core',
    tags: 'sentadilla pistola, single leg squat, pistol squat asistido',
    descripcion: 'De pie sobre una pierna, bajá a sentadilla profunda con la otra pierna extendida al frente sin tocar el piso. Subí controlado sin impulso. Requiere fuerza de cuádriceps, equilibrio, movilidad de tobillo y flexibilidad de cadera. Se puede asistir con TRX o banco para la progresión.'
  },
  {
    nombre: 'Plié squat',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Aductores, Cuádriceps, Glúteos',
    tags: 'Plié squat',
    descripcion: 'Piernas bien abiertas, puntas de pie hacia afuera. Bajá la cadera manteniendo la espalda recta y rodillas en dirección de los pies. Subí apretando glúteos e interno de muslo. Trabaja aductores, cuádriceps y glúteos. (Plié Squat)'
  },
  {
    nombre: 'Plié dips',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    musculos: 'Aductores, Cuádriceps, Glúteos',
    tags: 'Plié squat pulses',
    descripcion: 'En posición de plié squat baja, hacé pulsos cortos bajando y subiendo unos centímetros. Mantené la tensión constante en aductores y glúteos durante todo el movimiento. (Plié Squat Pulses)'
  },
  {
    nombre: 'Elevated side leg lifts',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: false,
    musculos: 'Glúteos, Abductores',
    tags: 'Elevated side leg lifts, Side lying leg raise',
    descripcion: 'De costado con la cadera elevada (apoyada en banco o step), elevá la pierna superior hacia arriba. Bajá controlado sin apoyar. Trabaja glúteo medio y abductores con mayor rango de movimiento. (Elevated Side Leg Lifts)'
  },
  {
    nombre: 'Elevated side reaches',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Oblicuos, Transverso abdominal, Glúteos',
    tags: 'Elevated side reaches',
    descripcion: 'De costado con la cadera elevada, extendé el brazo superior hacia el piso y volvé a la posición inicial. Trabaja oblicuos, core lateral y estabilizadores de cadera. (Elevated Side Reaches)'
  },
  {
    nombre: 'Narrow to wide squat',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    musculos: 'Cuádriceps, Aductores, Glúteos',
    tags: 'Narrow to wide squat',
    descripcion: 'Alterná entre una sentadilla con pies juntos y una sentadilla abierta (sumo) en cada repetición. Saltá o caminá los pies para cambiar de posición. Trabaja cuádriceps, aductores y glúteos. (Narrow to Wide Squat)'
  },
  {
    nombre: 'Split squat pulses',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos',
    tags: 'Split squat pulses',
    descripcion: 'En posición de zancada estática, hacé pulsos cortos bajando y subiendo sin volver arriba del todo. La tensión continua intensifica el trabajo en cuádriceps y glúteos. (Split Squat Pulses)'
  },
  {
    nombre: 'Sumo squat to calf raise',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Aductores, Glúteos, Cuádriceps, Pantorrillas',
    tags: 'Sumo squat to calf raise',
    descripcion: 'Sentadilla sumo y al subir elevá los talones en punta de pie. Bajá los talones y repetí. Trabaja aductores, glúteos, cuádriceps y pantorrillas en un solo movimiento. (Sumo Squat to Calf Raise)'
  },
  {
    nombre: 'Déficit reverse lunge',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Glúteos, Cuádriceps, Isquiotibiales',
    tags: 'Deficit reverse lunge',
    descripcion: 'Parada sobre un step o disco, dá un paso largo hacia atrás bajando la rodilla por debajo del nivel de la plataforma. Mayor rango de movimiento que la zancada normal. Trabaja glúteos y cuádriceps. (Deficit Reverse Lunge)'
  },
  {
    nombre: 'Standing weighted hip abduction',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: true,
    musculos: 'Glúteos, Abductores',
    tags: 'Standing weighted hip abduction',
    descripcion: 'De pie con tobillera o banda, elevá la pierna lateralmente manteniéndola recta. Controlá la bajada sin apoyar. Trabaja glúteo medio y estabilizadores de cadera. (Standing Weighted Hip Abduction)'
  },
  {
    nombre: 'Sumo squat to RDL',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Glúteos, Aductores, Isquiotibiales',
    tags: 'Sumo squat to RDL',
    descripcion: 'Sentadilla sumo seguida de un peso muerto rumano al subir: cerrá piernas y bajá el torso con piernas casi rectas. Volvé a posición sumo y repetí. Trabaja glúteos, aductores y femorales. (Sumo Squat to RDL)'
  },
  {
    nombre: 'Banded narrow to wide squat',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    musculos: 'Cuádriceps, Glúteos, Abductores',
    tags: 'Banded narrow to wide squat',
    descripcion: 'Con banda de resistencia en las rodillas, alterná sentadilla cerrada y abierta. La banda agrega resistencia a la abducción, activando más el glúteo medio durante todo el movimiento. (Banded Narrow to Wide Squat)'
  },
  {
    nombre: 'Floor press',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: true,
    musculos: 'Pectoral mayor, Tríceps, Deltoides anterior',
    tags: 'Floor press, Dumbbell floor press',
    descripcion: 'Acostado en el suelo boca arriba, un brazo a la vez. Kettlebell en una mano, codo apoyado en el piso. Empujá hacia arriba extendiendo el brazo y bajá controlado hasta que el codo toque el suelo. Trabaja pectoral, tríceps y estabilizadores de hombro con rango limitado que protege la articulación. (Floor Press)'
  },
  // Kettlebell — Tren superior
  {
    nombre: 'Press militar',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: true,
    musculos: 'Deltoides anterior, Deltoides lateral, Tríceps',
    tags: 'Overhead press, Military press',
    descripcion: 'De pie, kettlebell en posición de rack (contra el hombro). Empujá hacia arriba hasta extensión completa del brazo. Bajá controlado al hombro. Alterná o hacé bilateral. Trabaja deltoides y tríceps. (Overhead Press)'
  },
  {
    nombre: 'Remo',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: true,
    musculos: 'Dorsal ancho, Romboides, Bíceps',
    tags: 'Bent over row, Barbell row',
    descripcion: 'Inclinado con una mano apoyada, la otra sostiene la kettlebell. Tirá la pesa hacia la cadera apretando el omóplato. Bajá controlado. Trabaja dorsal ancho, romboides y bíceps. (Bent Over Row)'
  },
  {
    nombre: 'Bíceps curl',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: true,
    musculos: 'Bíceps, Braquial, Antebrazo',
    tags: 'Bicep curl',
    descripcion: 'De pie con kettlebell. Flexioná el codo llevando la pesa al hombro sin mover el brazo superior. Bajá controlado. Podés hacer bilateral o alternado. Trabaja bíceps braquial. (Bicep Curl)'
  },
  // Bandas
  {
    nombre: 'Extensión de tríceps con banda',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: false,
    musculos: 'Tríceps',
    tags: 'Banded overhead tricep extension',
    descripcion: 'Banda anclada arriba o pisada por detrás. Extendé los codos empujando las manos hacia abajo o arriba según el anclaje. Mantené los brazos pegados a la cabeza o al torso. Aislamiento de tríceps. (Banded Overhead Tricep Extension)'
  },
  {
    nombre: 'Rotación de hombros con banda',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: false,
    musculos: 'Deltoides posterior, Infraespinoso, Trapecio',
    tags: 'banda dislocates, dislocates',
    descripcion: 'Sostenés la banda con ambas manos al frente. Llevala por encima de la cabeza y atrás hasta la zona lumbar, y volvé. Mantené los brazos rectos. Movilidad y calentamiento del manguito rotador.'
  },
  {
    nombre: 'Plancha lateral dinámica',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Oblicuos, Transverso abdominal, Flexores de cadera',
    descripcion: 'En plancha lateral sobre el antebrazo, bajá la cadera hasta tocar el piso y volvé a subir. Arriba, flexioná la rodilla superior y llevá el codo hacia ella haciendo un crunch lateral. Volvé a la posición de plancha y repetí. Se puede hacer con chaleco para mayor intensidad. Trabaja oblicuos, core lateral y estabilidad de cadera.',
    tags: 'side plank hip dip, knee crunch, plancha lateral dinamica, chaleco'
  },
  // Equilibrio + kettlebell
  {
    nombre: 'Bíceps curl en equilibrio',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: true,
    musculos: 'Bíceps, Braquial, Glúteos',
    tags: 'Single leg balance bicep curl',
    descripcion: 'De pie sobre una pierna, peso en la mano del mismo lado o contrario. Flexioná el codo subiendo la pesa al hombro sin perder el equilibrio. Trabajás bíceps, core y estabilizadores de tobillo y cadera simultáneamente. Alterná la pierna de apoyo entre series. (Single Leg Balance Bicep Curl)'
  },
  {
    nombre: 'Vuelos laterales en equilibrio',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: true,
    musculos: 'Deltoides lateral, Trapecio, Glúteos',
    tags: 'Single leg lateral raise, Single leg side raise',
    descripcion: 'Parado sobre una pierna con mancuerna o kettlebell en una mano. Elevá el brazo lateralmente hasta la altura del hombro con el codo levemente flexionado. Bajá controlado. Trabaja deltoides lateral, core y estabilidad de cadera y tobillo. Hacé todas las reps de un lado antes de cambiar. (Single Leg Lateral Raise)'
  },
  // TRX — Piernas
  {
    nombre: 'Sentadilla búlgara con TRX',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    musculos: 'Cuádriceps, Glúteos, Isquiotibiales',
    tags: 'TRX Bulgarian split squat',
    descripcion: 'Pie trasero en el estribo del TRX. Bajá la rodilla trasera hacia el piso manteniendo el torso recto. Empujá para subir. El TRX permite mayor rango de movimiento y desafía la estabilidad. Trabaja cuádriceps, glúteos y equilibrio unilateral. (TRX Bulgarian Split Squat)'
  },
  // TRX — Bíceps
  {
    nombre: 'Bíceps curl en TRX',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: true,
    musculos: 'Bíceps, Braquial',
    tags: 'TRX bicep curl',
    descripcion: 'De frente al anclaje del TRX, agarrá las correas con agarre supino y el cuerpo inclinado hacia atrás. Flexioná los codos llevando las manos a la frente, manteniendo los codos altos y fijos. Extendé controlado. Cuanto más horizontal el cuerpo, más difícil. Trabaja bíceps y braquial con peso corporal. (TRX Bicep Curl)'
  },
  // TRX — Tríceps
  {
    nombre: 'Tríceps alto en TRX',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: false,
    musculos: 'Tríceps, Deltoides anterior',
    tags: 'TRX tricep extension, TRX skull crusher',
    descripcion: 'De espaldas al anclaje del TRX, brazos extendidos sobre la cabeza sosteniendo las correas. Flexioná los codos bajando la cabeza entre las manos, manteniendo los brazos pegados a las orejas. Extendé para volver. Similar a un french press con peso corporal. Cuanto más inclinado, más difícil. (TRX Tricep Extension)'
  },
  {
    nombre: 'Tríceps alto en TRX a un brazo',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: false,
    musculos: 'Tríceps, Deltoides anterior, Core',
    tags: 'single arm trx triceps, triceps unilateral',
    descripcion: 'Igual que el tríceps alto en TRX pero con un solo brazo. De espaldas al anclaje, una mano en la correa, la otra libre. Flexioná el codo bajando controlado y extendé para volver. Demanda anti-rotación del core y mayor fuerza por brazo. Hacé todas las reps de un lado antes de cambiar.'
  },
  {
    nombre: 'Patada de tríceps con mancuerna',
    grupo: 'Brazos', tipo: 'fuerza', usaPeso: true,
    musculos: 'Tríceps (cabeza lateral y medial), Deltoides posterior (estabilizador)',
    tags: 'Dumbbell tricep kickback, Tricep kickback',
    descripcion: 'Inclinado con el torso paralelo al piso, apoyá una mano y rodilla en el banco. Con la otra mano agarrá la mancuerna, brazo pegado al costado y codo a 90°. Extendé el codo llevando la mancuerna hacia atrás hasta que el brazo quede recto. Apretá un segundo arriba y bajá controlado. Mantené el brazo superior quieto — solo se mueve el antebrazo. (Dumbbell Tricep Kickback)'
  },
  // ── COMPOUND / COMBO ─────────────────────────────────────────────────────────
  {
    nombre: 'Renegade row',
    grupo: 'Espalda', tipo: 'funcional', usaPeso: true,
    musculos: 'Dorsal ancho, Romboides, Core, Deltoides anterior',
    tags: 'renegade row, plank row, remo en plancha',
    descripcion: 'En posición de plancha con una kettlebell o mancuerna en cada mano. Remá con un brazo llevando el codo atrás y arriba, manteniendo la cadera quieta sin rotar. Bajá controlado y repetí con el otro brazo. Trabaja espalda y core anti-rotación simultáneamente. (Renegade Row)'
  },
  {
    nombre: 'Plancha con arrastre',
    grupo: 'Core', tipo: 'funcional', usaPeso: true,
    musculos: 'Core, Oblicuos, Transverso abdominal, Deltoides anterior',
    tags: 'DB plank drag-through, plank drag, plank pull-through',
    descripcion: 'En posición de plancha con una kettlebell al costado. Con la mano contraria, arrastrá el peso por debajo del cuerpo hacia el otro lado. Mantené las caderas estables sin rotar. Alterná lados. Anti-rotación extrema con carga. (DB Plank Drag-Through)'
  },
  {
    nombre: 'Peso muerto sumo con elevación frontal',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Glúteos, Aductores, Isquiotibiales, Deltoides anterior',
    tags: 'sumo deadlift to front raise, sumo deadlift front raise',
    descripcion: 'Con kettlebell o mancuerna, hacé un peso muerto sumo. Al subir, elevá el peso al frente hasta la altura de los hombros con brazos extendidos. Bajá controlado y repetí. Combina cadena posterior + hombros en un solo movimiento. (Sumo Deadlift to Front Raises)'
  },
  {
    nombre: 'French press en puente de glúteos',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: true,
    musculos: 'Tríceps, Glúteos, Isquiotibiales',
    tags: 'skull crushers to glute bridge, DB skull crushers glute bridge',
    descripcion: 'Acostado boca arriba en posición de puente de glúteos (cadera elevada), hacé french press con mancuerna o kettlebell. Mantené la cadera arriba todo el set. Trabaja tríceps + glúteos e isquiotibiales de forma isométrica. (DB Skull Crushers to Glute Bridge)'
  },
  {
    nombre: 'Toe touch con descenso de piernas',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Recto abdominal, Oblicuos, Flexores de cadera',
    tags: 'Toe touch leg lower, Toe touch + leg lower',
    descripcion: 'Acostado boca arriba, piernas extendidas verticales. Subí el torso tocando las puntas de los pies (toe touch). Bajá el torso y luego descendé las piernas controladamente hacia el piso sin apoyarlas. Volvé a subir las piernas y repetí. Core anterior dinámico completo. (Toe Touch + Leg Lower)'
  },
  {
    nombre: 'Toe touch con disco',
    grupo: 'Core', tipo: 'funcional', usaPeso: true,
    musculos: 'Recto abdominal, Oblicuos, Flexores de cadera',
    tags: 'Weighted toe touch, Plate toe touch leg lower',
    descripcion: 'Igual que el toe touch con descenso de piernas pero sosteniendo un disco con ambas manos. Al subir el torso, extendé el disco hacia las puntas de los pies. La carga extra aumenta la demanda del recto abdominal en la fase de crunch. (Weighted Toe Touch + Leg Lower)'
  },
  {
    nombre: 'Zancada cruzada con vuelo lateral',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Glúteo medio, Aductores, Cuádriceps, Deltoides lateral',
    tags: 'curtsy lunge to lateral raise, curtsy lunge lateral raise',
    descripcion: 'Con mancuerna o kettlebell, dá un paso cruzando la pierna por detrás (curtsy lunge) bajando la rodilla. Al subir, elevá los brazos lateralmente hasta la altura de los hombros. Hacé todas las reps de un lado antes de cambiar. Trabaja glúteo medio, aductores y deltoides lateral. (Curtsy Lunge to Lateral Raise)'
  },
  {
    nombre: 'Flexión con toque de hombro',
    grupo: 'Pecho', tipo: 'funcional', usaPeso: false,
    musculos: 'Pectoral mayor, Tríceps, Deltoides anterior, Core',
    tags: 'push-up to shoulder tap, pushup shoulder tap',
    descripcion: 'Hacé una flexión completa. Arriba, tocá el hombro contrario con una mano manteniendo la cadera estable. Repetí la flexión y tocá el otro hombro. Cada rep = 1 flexión + 1 toque. Combina pecho/tríceps con anti-rotación de core. (Push-up to Shoulder Tap)'
  },
  {
    nombre: 'Crunch oblicuo a una pierna',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Oblicuos, Recto abdominal, Flexores de cadera',
    tags: 'single leg oblique crunch, oblique crunch single leg',
    descripcion: 'Acostado boca arriba, una pierna extendida en el aire y la otra flexionada. Subí el torso rotando el codo hacia la rodilla contraria. Mantené la pierna extendida sin bajarla. Hacé todas las reps de un lado antes de cambiar. Trabajo de oblicuos con demanda extra de flexores de cadera. (Single Leg Oblique Crunch)'
  },
  // ── RECOVERY (post-cirugía, sin Valsalva, cargas livianas) ─────────────────
  {
    nombre: 'Sentadilla corporal',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    musculos: 'Cuádriceps, Glúteos, Isquiotibiales',
    tags: 'Bodyweight squat, Air squat',
    descripcion: 'De pie con pies al ancho de caderas. Bajá como si fueras a sentarte en una silla, flexionando rodillas y caderas. Mantené el pecho erguido y la espalda recta. Respiración normal, sin aguantar aire. Ideal para recuperación sin carga. (Bodyweight Squat)'
  },
  {
    nombre: 'Extensión de cadera en 4 puntos',
    grupo: 'Glúteos', tipo: 'funcional', usaPeso: false,
    musculos: 'Glúteos, Isquiotibiales, Erector espinal',
    tags: 'Quadruped hip extension, Donkey kick',
    descripcion: 'En posición de 4 apoyos (manos y rodillas). Extendé una pierna hacia atrás hasta alinear con el torso, apretando el glúteo al final. Bajá controlado. Core activado todo el tiempo, sin arquear la columna. Trabajá glúteo mayor y estabilidad lumbopélvica. (Quadruped Hip Extension)'
  },
  {
    nombre: 'Estocadas estáticas',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    musculos: 'Cuádriceps, Glúteos, Isquiotibiales',
    tags: 'Static lunges, Split squat',
    descripcion: 'Dá un paso al frente y quedate en esa posición. Bajá la rodilla trasera hacia el suelo sin apoyarla y subí. Hacé todas las reps de un lado antes de cambiar. Sin saltos, movimiento controlado. Trabajá cuádriceps, glúteos y estabilidad unilateral. (Static Lunges)'
  },
  {
    nombre: 'Calf raises',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    musculos: 'Gemelos, Pantorrillas',
    tags: 'Calf raises, Standing calf raise',
    descripcion: 'De pie en el suelo o en el borde de un escalón con las puntas de los pies apoyadas. Subí elevando los talones lo más alto posible y bajá lentamente estirando. Si estás en escalón, ganás más rango. Trabaja gemelos y sóleo. (Calf Raises)'
  },
  {
    nombre: 'Bird-dog',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Transverso abdominal, Erector espinal, Glúteos',
    tags: 'Bird-dog, Quadruped arm leg raise',
    descripcion: 'En 4 apoyos, extendé simultáneamente brazo derecho y pierna izquierda hasta alinear con el torso. Mantené 1-2 segundos y volvé. Alterná. Sin rotación de cadera ni hombros. Control total, core activado. Estabilidad antirotacional y coordinación cruzada. (Bird-Dog)'
  },
  {
    nombre: 'Hip hinge corporal',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    musculos: 'Isquiotibiales, Glúteos, Erector espinal',
    tags: 'Bodyweight hip hinge, Good morning',
    descripcion: 'De pie, pies al ancho de caderas. Empujá la cadera hacia atrás manteniendo la espalda recta y rodillas levemente flexionadas. El torso se inclina por la bisagra de cadera, no por la columna. Activa isquiotibiales y glúteos. Patrón base del peso muerto sin carga. (Bodyweight Hip Hinge)'
  },
  {
    nombre: 'Yoga suave',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Erector espinal, Transverso abdominal, Hip flexors',
    tags: 'Gentle yoga, Restorative yoga',
    descripcion: 'Secuencia de posturas suaves sin inversiones ni presión abdominal intensa: postura del niño, gato-vaca, paloma, torsión suave sentada, savasana. Respiración profunda y consciente. Ideal para días de recuperación y movilidad. (Gentle Yoga)'
  },
  {
    nombre: 'Plancha toque de hombro',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Transverso abdominal, Oblicuos, Deltoides anterior',
    tags: 'Plank shoulder tap, Shoulder tap plank',
    descripcion: 'En plancha sobre manos (no antebrazos), pies un poco más separados que hombros. Tocá el hombro contrario con una mano alternando lados sin que la cadera rote. Core antirotacional en acción. Respiración continua, sin contener aire. (Plank Shoulder Tap)'
  },
  {
    nombre: 'Press militar suave con kettlebell',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: true,
    musculos: 'Deltoides anterior, Deltoides lateral, Tríceps',
    tags: 'Light kettlebell overhead press',
    descripcion: 'Press militar con kettlebell liviana, sentada o de pie. Sin apnea, sin aguantar aire. Ideal con el 40-50% de tu peso habitual. Empujá controlado hacia arriba y bajá al rack del hombro. Estímulo de deltoides sin generar presión intracraneal. (Light Kettlebell Overhead Press)'
  },
  {
    nombre: 'Bíceps curl suave',
    grupo: 'Brazos', tipo: 'funcional', usaPeso: true,
    musculos: 'Bíceps, Braquial, Antebrazo',
    tags: 'Light bicep curl, Recovery bicep curl',
    descripcion: 'De pie o sentada, kettlebell liviana en cada mano o bilateral. Flexioná el codo con control total en la bajada. Respiración continua. Cargas del 40-50% de lo habitual para mantener estímulo sin fatiga excesiva. (Light Bicep Curl)'
  },
  {
    nombre: 'Face pull con banda',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: false,
    musculos: 'Deltoides posterior, Infraespinoso, Trapecio',
    tags: 'banda face pull',
    descripcion: 'Ancla una banda elástica a la altura de los ojos. Tirá la banda hacia tu cara abriendo los codos y rotando externamente los hombros. Trabaja postura, deltoides posterior y manguito rotador. Excelente para compensar horas sentada y mejorar postura.'
  },
  // ── COMBO / BEN BRUNO STYLE ───────────────────────────────────────────────
  {
    nombre: 'Sentadilla goblet con press',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos, Deltoides anterior, Tríceps',
    tags: 'Goblet squat to press, Squat to press',
    descripcion: 'Con kettlebell en posición goblet, bajá a sentadilla profunda. Al subir, empujá la kettlebell sobre la cabeza en press. Bajá la pesa al pecho y repetí. Combina tren inferior con empuje de hombros en un solo movimiento fluido. (Goblet Squat to Press)'
  },
  {
    nombre: 'Zancada reversa con press a un brazo',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos, Deltoides anterior, Core',
    tags: 'Reverse lunge to single arm press',
    descripcion: 'Con kettlebell o mancuerna en una mano en posición de rack, dá un paso atrás a zancada reversa. Al subir, empujá el peso sobre la cabeza. Trabajás piernas, hombros y core anti-lateral en un solo movimiento. Hacé todas las reps de un lado antes de cambiar. (Reverse Lunge to Single Arm Press)'
  },
  {
    nombre: 'Peso muerto a una pierna con remo',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Isquiotibiales, Glúteos, Dorsal ancho, Romboides',
    tags: 'Single leg deadlift to row',
    descripcion: 'Peso muerto a una pierna con kettlebell o mancuerna. En la posición baja (torso paralelo al piso), hacé un remo tirando el codo hacia atrás. Bajá el peso, volvé a parado y repetí. Combina cadena posterior con tracción de espalda. (Single Leg Deadlift to Row)'
  },
  {
    nombre: 'Peso muerto rumano con remo',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Isquiotibiales, Glúteos, Dorsal ancho, Romboides',
    tags: 'Romanian deadlift to row, RDL to row',
    descripcion: 'Peso muerto rumano bilateral con dos kettlebells o mancuernas. En la posición baja, hacé un remo con ambos brazos tirando los codos hacia atrás. Bajá los pesos, volvé a parado y repetí. Cadena posterior + espalda en un combo eficiente. (Romanian Deadlift to Row)'
  },
  {
    nombre: 'Zancada reversa con remo',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos, Dorsal ancho, Romboides',
    tags: 'Reverse lunge to row, Lunge to row',
    descripcion: 'Con mancuerna o kettlebell en una mano, dá un paso atrás a zancada reversa. En la posición baja, incliná el torso levemente y hacé un remo tirando el codo hacia atrás. Subí a posición parada y repetí. Combina piernas con tracción de espalda en un patrón unilateral. (Reverse Lunge to Row)'
  },
  {
    nombre: 'Zancada reversa con curl martillo',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos, Bíceps, Braquial',
    tags: 'Reverse lunge to hammer curl',
    descripcion: 'Con mancuernas en agarre neutro, dá un paso atrás a zancada reversa. Al subir, hacé un curl martillo bilateral. Combina piernas con bíceps/braquial sin pausa entre movimientos. (Reverse Lunge to Hammer Curl)'
  },
  {
    nombre: 'Sentadilla con remo en TRX',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    musculos: 'Cuádriceps, Glúteos, Dorsal ancho, Romboides',
    tags: 'TRX squat to row',
    descripcion: 'Sujetando las correas del TRX, inclinado hacia atrás, bajá a sentadilla. Al subir, tirá las correas en remo llevando los codos atrás. Combina sentadilla con tracción de espalda usando peso corporal. (TRX Squat to Row)'
  },
  {
    nombre: 'Sentadilla con press Pallof',
    grupo: 'Core', tipo: 'funcional', usaPeso: false,
    musculos: 'Cuádriceps, Glúteos, Oblicuos, Transverso abdominal',
    tags: 'Squat to Pallof press',
    descripcion: 'Con banda anclada al costado, sujetá con ambas manos a la altura del pecho. Bajá a sentadilla y al subir extendé los brazos al frente resistiendo la rotación. Combina sentadilla con anti-rotación de core. (Squat to Pallof Press)'
  },
  {
    nombre: 'Step-up con rodilla al pecho',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos, Flexores de cadera, Core',
    tags: 'Step-up to knee drive',
    descripcion: 'Subí al step o banco con una pierna y al pararte llevá la rodilla contraria al pecho con explosividad. Bajá controlado y repetí. Se puede hacer con chaleco o mancuernas. Trabaja cuádriceps, glúteos, equilibrio y core. (Step-Up to Knee Drive)'
  },
  {
    nombre: 'Zancada con rotación',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos, Oblicuos, Core',
    tags: 'Lunge with rotation, Lunge twist',
    descripcion: 'Con disco o kettlebell al frente del pecho, dá un paso al frente a zancada. En la posición baja, rotá el torso hacia el lado de la pierna adelantada. Volvé al centro, subí y alterná. Combina piernas con movilidad torácica y core rotacional. (Lunge with Rotation)'
  },
  {
    nombre: 'Zancada reversa con chop diagonal',
    grupo: 'Core', tipo: 'funcional', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos, Oblicuos, Deltoides anterior',
    tags: 'Reverse lunge to chop, Lunge chop',
    descripcion: 'Con disco o kettlebell, dá un paso atrás a zancada reversa mientras bajás el peso en diagonal hacia la cadera de la pierna atrasada. Al subir, levantá el peso en diagonal cruzando el cuerpo hacia arriba. Combina piernas, core rotacional y hombros. (Reverse Lunge to Diagonal Chop)'
  },
  {
    nombre: 'Clean con press a un brazo',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: true,
    musculos: 'Deltoides anterior, Trapecio, Cuádriceps, Glúteos',
    tags: 'Single arm clean and press, KB clean and press',
    descripcion: 'Con kettlebell entre las piernas, hacé un swing parcial y limpiá la pesa al hombro (clean). Desde ahí, empujá en press sobre la cabeza. Bajá al hombro, luego al piso y repetí. Movimiento explosivo de cuerpo completo. (Single Arm Clean and Press)'
  },
  {
    nombre: 'Swing a sentadilla goblet',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Glúteos, Isquiotibiales, Cuádriceps, Core',
    tags: 'Swing to goblet squat',
    descripcion: 'Hacé un swing con kettlebell y al subir atrapá la pesa en posición goblet al pecho. Inmediatamente bajá a sentadilla goblet profunda. Subí, soltá a swing y repetí. Combina potencia explosiva con fuerza de piernas. (Swing to Goblet Squat)'
  },
  {
    nombre: 'Thruster con kettlebell',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: true,
    musculos: 'Cuádriceps, Glúteos, Deltoides anterior, Tríceps',
    tags: 'Kettlebell thruster, KB thruster',
    descripcion: 'Con kettlebell en posición de rack al hombro, bajá a sentadilla profunda. Al subir explosivamente, usá el impulso para empujar la kettlebell sobre la cabeza en press. Bajá al hombro y repetí. Movimiento compuesto de cuerpo completo. (Kettlebell Thruster)'
  },
  {
    nombre: 'Hollow body con press de pecho',
    grupo: 'Core', tipo: 'funcional', usaPeso: true,
    musculos: 'Recto abdominal, Pectoral mayor, Tríceps',
    tags: 'Hollow body chest press, Hollow body floor press',
    descripcion: 'En posición de hollow body (hombros y piernas elevados del piso), hacé press de pecho con mancuernas o kettlebells. Mantené la posición de hollow durante todas las reps. Combina core anterior isométrico con empuje de pecho. (Hollow Body Chest Press)'
  },
  {
    nombre: 'Levantamiento turco',
    grupo: 'Core', tipo: 'funcional', usaPeso: true,
    musculos: 'Core, Deltoides anterior, Glúteos, Cuádriceps',
    tags: 'Turkish get-up, TGU',
    descripcion: 'Acostado boca arriba con kettlebell en una mano extendida al techo. Levantate paso a paso: codo, mano, puente, rodilla, parado, manteniendo el peso arriba todo el tiempo. Bajá invirtiendo los pasos. Trabaja estabilidad, movilidad y fuerza de todo el cuerpo. (Turkish Get-Up)'
  },
  // ── CARRIES ────────────────────────────────────────────────────────────────
  {
    nombre: 'Caminata de maleta',
    grupo: 'Core', tipo: 'funcional', usaPeso: true,
    musculos: 'Oblicuos, Trapecio, Antebrazo, Core',
    tags: 'Suitcase carry, Single arm farmer carry',
    descripcion: 'Agarrá una kettlebell o mancuerna pesada en una sola mano y caminá con pasos controlados manteniendo el torso erguido sin inclinarte hacia el peso. Trabaja oblicuos anti-laterales, agarre y estabilidad de core. Alterná de mano entre sets. (Suitcase Carry)'
  },
  {
    nombre: 'Caminata con brazo arriba',
    grupo: 'Core', tipo: 'funcional', usaPeso: true,
    musculos: 'Deltoides anterior, Trapecio, Core, Oblicuos',
    tags: 'Overhead carry, Waiter carry',
    descripcion: 'Sosteniendo una kettlebell o mancuerna con un brazo completamente extendido sobre la cabeza, caminá con pasos controlados. Mantené el bíceps junto a la oreja y el core activado. Trabaja estabilidad de hombro, core anti-lateral y control postural. (Overhead Carry)'
  },
  // ── HIIT ADICIONAL ─────────────────────────────────────────────────────────
  {
    nombre: 'Step-up rápidos alternados',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Cuádriceps, Glúteos, Gemelos',
    tags: 'Quick step-ups, Alternating fast step-ups',
    descripcion: 'Frente a un step o banco bajo, subí y bajá alternando piernas a máxima velocidad manteniendo el torso erguido. Movimiento rápido y explosivo. Trabaja cuádriceps, glúteos y sistema cardiovascular. (Quick Alternating Step-Ups)'
  },
  {
    nombre: 'Lateral step overs',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Abductores, Cuádriceps, Glúteos',
    tags: 'Lateral step overs, Side step overs',
    descripcion: 'De costado a un step o banco bajo, subí lateralmente pasando al otro lado y repetí en dirección contraria. Movimiento continuo y rápido. Trabaja abductores, agilidad lateral y coordinación. (Lateral Step Overs)'
  },
  {
    nombre: 'Patinadores',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Glúteos, Abductores, Cuádriceps',
    tags: 'Skaters, Skater jumps',
    descripcion: 'Saltá lateralmente de una pierna a la otra como un patinador de velocidad, llevando la pierna libre cruzada detrás. Tocá el piso con la mano contraria si podés. Trabaja glúteo medio, potencia lateral y equilibrio dinámico. (Skater Jumps)'
  },
  {
    nombre: 'Rodillas altas',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Cuádriceps, Flexores de cadera, Core',
    tags: 'High knees, Running in place',
    descripcion: 'Corré en el lugar llevando las rodillas al pecho lo más alto posible con cada paso. Brazos acompañan el movimiento. Ritmo rápido y explosivo. Trabaja cuádriceps, flexores de cadera y sistema cardiovascular. (High Knees)'
  },
  {
    nombre: 'Escaladores cruzados',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Recto abdominal, Oblicuos, Deltoides anterior',
    tags: 'Cross-body mountain climbers, Cross mountain climbers',
    descripcion: 'En posición de plancha alta, llevá la rodilla hacia el codo contrario alternando piernas a ritmo rápido. La rotación cruzada activa más los oblicuos que los mountain climbers tradicionales. (Cross-Body Mountain Climbers)'
  },
  {
    nombre: 'Plancha con saltos',
    grupo: 'HIIT', tipo: 'funcional', usaPeso: false,
    musculos: 'Recto abdominal, Deltoides anterior, Cuádriceps',
    tags: 'Plank jacks, Plank jumping jacks',
    descripcion: 'En posición de plancha alta, saltá abriendo y cerrando las piernas como jumping jacks manteniendo las manos fijas. Core activado, cadera estable. Combina trabajo de core con cardio intenso. (Plank Jacks)'
  },
  // ── PIERNAS ADICIONAL ──────────────────────────────────────────────────────
  {
    nombre: 'Elevación de talones a una pierna',
    grupo: 'Piernas', tipo: 'funcional', usaPeso: false,
    musculos: 'Gemelos, Pantorrillas',
    tags: 'Single leg calf raise',
    descripcion: 'De pie sobre una pierna (la otra flexionada), elevá el talón lo más alto posible y bajá controlado. Mayor demanda de fuerza y equilibrio que la versión bilateral. Trabaja gemelos y sóleo unilateralmente. (Single Leg Calf Raise)'
  },
  {
    nombre: 'Arranque con mancuerna',
    grupo: 'Hombros', tipo: 'funcional', usaPeso: true,
    musculos: 'Deltoides anterior, Trapecio, Cuádriceps, Glúteos, Core',
    tags: 'Dumbbell snatch, Single arm snatch',
    descripcion: 'Con mancuerna o kettlebell entre las piernas, hacé un tirón explosivo desde el piso hasta sobre la cabeza en un solo movimiento fluido. Usá la extensión de cadera para generar impulso. Movimiento olímpico simplificado que trabaja potencia de cuerpo completo. (Dumbbell Snatch)'
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
    const matchQuery = !q || e.nombre.toLowerCase().includes(q) || e.grupo.toLowerCase().includes(q) || (e.tags && e.tags.toLowerCase().includes(q));
    const matchTipo = tipoFilter === 'todos' || e.tipo === tipoFilter;
    return matchQuery && matchTipo;
  });
}
