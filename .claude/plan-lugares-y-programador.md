# Lugares nuevos + programador de ciclos

Dos funciones que comparten una misma base. Este documento es el plan; la base
ya está construida (ver "Estado").

---

## El problema de fondo

`lugar` hoy **no es un dato, es un enum escrito a mano en seis archivos**:

| Archivo | Qué duplica |
|---|---|
| `home.js:395-397` | `LUGAR_ORDER`, `LUGAR_CHIPS`, `LUGAR_LABELS` |
| `home.js:508-509` | los mismos, otra vez |
| `rutinas.js:8` | `LUGAR_LABELS` |
| `rutina-edit.js:7` | `LUGAR_OPTIONS` |
| `format.js:33` | `getLugarBadge()` con un `switch` |
| `components.css:465-469` | `.badge-sport`, `.badge-rio`, `.badge-casa`, `.badge-uy`, `.badge-recovery` |

Agregar un lugar hoy significa tocar los seis. Por eso la primera tarea de la
función no es el wizard: es **convertir los lugares en datos**. El wizard es
después la parte fácil.

Lo mismo pasa con el calendario: hoy son **~86 fechas por usuario escritas a
mano** dentro de `ensureCalendarOverrides()` en `seed.js:1717`. El programador
de ciclos es, literalmente, la función que reemplaza esa lista.

---

## Parte 1 — Lugares como dato + wizard de equipamiento

### 1.1 Qué se relevó

| Proyecto | Cómo modela el equipamiento | Qué sirve |
|---|---|---|
| **free-exercise-db** | Un campo plano con 12 valores: `body only, bands, barbell, cable, dumbbell, e-z curl bar, exercise ball, foam roll, kettlebells, machine, medicine ball, other` | **No sirve.** No tiene TRX, chaleco, tobilleras, barra de dominadas, banco, cajón, sliders ni ab wheel. Más de la mitad del catálogo de CASA caería en `other`. |
| **Fitbod** | *Gym Profile* con equipamiento tildado; permite varios lugares (uno puede llamarse "Home"); filtros por sesión: "Your Equipment / No Equipment / Same / Different" | El patrón de **varios perfiles con nombre**, que es exactamente lo pedido |
| **MacroFactor** | *Gym Profiles* en Feature Settings, con un override **"Allow Exercises"**: habilitar un ejercicio puntual aunque falte su equipamiento | El **escape hatch**. Imprescindible: ninguna taxonomía cubre todos los casos |
| **GymBook** | "Your gym" esconde lo que no se puede hacer, incluso al buscar; **lo que no necesita nada queda siempre disponible** | La regla de base |
| **Vicifit** | Varios gimnasios registrados: casa, oficina, gimnasio principal | Confirma el patrón |

Conclusión: el patrón de producto (varios perfiles con nombre + tildes) está
consolidado y hay que copiarlo. La **taxonomía** hay que hacerla propia.

### 1.2 Taxonomía — las tres reglas

Está en `src/equipamiento.js`, derivada de recorrer los 227 ejercicios propios:

1. **La unidad que se tilda es la cosa que se tiene o no se tiene en ese lugar.**
   No el músculo, no la marca, no el peso. "Mancuernas" es un ítem; "mancuernas
   de 10 kg" no.
2. **Dos cosas se separan sólo si separarlas cambia qué ejercicios entran.**
   Banco plano y banco regulable se separan (el press inclinado necesita el
   segundo). Kettlebell de 8 y de 12 no.
3. **El espacio también es equipamiento.** Las zancadas caminando, el farmer's
   walk y el bear crawl necesitan metros; los saltos necesitan un piso donde se
   pueda saltar. En un departamento eso manda más que tener o no una mancuerna,
   y ninguna taxonomía ajena lo contempla.

5 categorías, 27 ítems:

- **Peso libre** — mancuernas, barra y discos, barra Z, kettlebells, discos sueltos, balón medicinal
- **Máquinas** — poleas, máquinas de fuerza, multipower, cardio
- **Soportes** — banco plano, banco regulable, rack, barra de dominadas, paralelas, cajón/step/silla
- **Funcional** — TRX, bandas, bandas circulares, chaleco, tobilleras, ab wheel, sliders, cuerda, colchoneta
- **Espacio** — espacio para desplazarse, se puede saltar, es al aire libre

### 1.3 Requisitos de un ejercicio: grupos en O

```js
equipo: []                               // peso corporal: siempre disponible
equipo: [['kettlebell','mancuernas']]    // alcanza con cualquiera de los dos
equipo: [['banco_plano'],['mancuernas']] // hacen falta los dos
```

Disponible ⟺ **todos** los grupos tienen **al menos un** ítem tildado.

Que lo que no requiere nada esté siempre disponible es deliberado (es lo que
hace GymBook) y evita que un lugar recién creado quede sin nada que ofrecer.

### 1.4 Cobertura real por preset

Medido sobre los 227 ejercicios ya mapeados:

| Preset | Ejercicios | Alerta |
|---|---|---|
| Sin equipamiento | 65 | **Flojo en Espalda, Hombros, Brazos** |
| Casa básica | 104 | **Flojo en Espalda** |
| Casa equipada | 184 | cubre todo |
| Gimnasio completo | 221 | cubre todo |
| Hotel o viaje | 90 | **Flojo en Espalda** |
| Al aire libre | 97 | cubre todo |

Esto no es un número de adorno: **sin nada para traccionar no hay espalda**.
El wizard tiene que decirlo en el último paso, con el ítem que lo arreglaría
("con una barra de dominadas o un TRX pasás de 1 a 12 ejercicios de espalda").
Es el aporte propio sobre lo que hacen Fitbod y compañía, que te dejan armar un
perfil inservible sin avisarte.

### 1.5 Modelo de datos

Clave nueva en el store, `gym_lugares`, sincronizada como el resto:

```js
{
  key: 'GIMNASIO_JOSE',       // estable, generado del nombre
  nombre: 'Gimnasio del barrio',
  icono: 'ph-barbell',
  color: '#30D158',
  equipo: ['mancuernas', 'barra', ...],
  builtin: false,
  creadoEn: ISO,
}
```

Los cinco lugares actuales (`CASA`, `RIO`, `SPORT_FITNESS`, `URUGUAY`,
`RECOVERY`) se siembran como registros con `builtin: true` y su equipamiento
cargado. A partir de ahí los seis archivos de la tabla leen de acá.

> El equipamiento de CASA ya está documentado en `seed.js:933`: chaleco,
> kettlebells 8/12, tobilleras 4kg, platos rucking, TRX, bandas BC Strength,
> bandas elásticas, ab wheel.

### 1.6 Pasos de implementación

1. `src/lugares.js` — store, built-ins, `getLugar()`, `getLugares()`, `addLugar()`.
2. Reemplazar las seis duplicaciones. El badge pasa de clase CSS fija a color
   inline desde el registro, así un lugar nuevo tiene color sin tocar el CSS.
3. Vista `rutinas.js` → botón "Lugar nuevo".
4. Wizard: 5 pasos (uno por categoría) + preset inicial + paso final de
   cobertura. Navegación adelante/atrás, cancelable, sin guardar hasta el final.
5. Override por ejercicio (lo de MacroFactor): poder habilitar uno puntual
   aunque falte el equipamiento. Va en el registro del lugar, no en el catálogo.
6. Migración: un lugar sin `equipo` se comporta como hoy (todo disponible),
   así nada se rompe si la clave todavía no bajó por sync.

---

## Parte 2 — Programador de ciclos

Reemplaza las ~86 fechas a mano de `ensureCalendarOverrides()`.

### 2.1 Qué pregunta el wizard

| Paso | Pregunta | Opciones |
|---|---|---|
| 1 | ¿Para quién? | Lean / Nat / José |
| 2 | ¿Cuánto tiempo? | 1, 2 o 3 meses (o rango de fechas) |
| 3 | ¿Qué días? | Chips L M X J V S D — se eligen los días reales, no "3 por semana" |
| 4 | ¿Dónde, cada día? | Un lugar por día elegido. Esto es lo que permite "Casa lunes/miércoles/viernes + Río sábado", que es lo que hacen hoy |
| 5 | ¿Cómo alterna? | Press/Pull (actual) · Push/Pull/Piernas · Full body · Sin alternancia |
| 6 | Forma del día | Circuitos por día (2-6) · ejercicios por circuito (2-5) · ¿cierra con HIIT? y con cuántos |
| 7 | Volumen | Series y reps por defecto, por tipo de circuito |
| 8 | Vista previa | Las semanas generadas, editables antes de confirmar |

Un detalle que importa: **el lugar se elige por día, no por programa.** Es la
diferencia entre que la función sirva o no, porque el uso real ya es mixto.

### 2.2 El generador

Entra la configuración, salen rutinas + overrides de calendario.

```
para cada día del período que caiga en los días elegidos:
    lugar     = config.lugarPorDia[diaSemana]
    foco      = rotar(alternancia, índiceDeSesión)
    rutina    = generarRutina(lugar, foco, config)
    overrides[usuario][fecha] = { rutinaId, tipo: foco, lugar }
```

`generarRutina` elige ejercicios de los disponibles en ese lugar
(`estaDisponible`), filtrados por el grupo muscular que le toca al circuito, y
**respetando la regla de adyacencia de CLAUDE.md**:

> Antes de colocar un ejercicio, verificar los 4 vecinos: distancia 1 (los del
> tipo opuesto a cada lado) y distancia 2 (los del mismo tipo salteando uno).
> No puede aparecer en ningún circuito de esos 4.

**Esto es lo más valioso de toda la función.** Hoy esa regla la verifico a mano
con un script cada vez. Que el generador la haga cumplir por construcción vale
más que el ahorro de tipeo. También tiene que cubrir mecánicas parecidas, no
sólo nombres iguales ("Extensión de tríceps con banda" ≈ "Banda triceps
pushdown"), lo que pide una noción de familia de ejercicio que el catálogo
todavía no tiene — ver pendientes.

### 2.3 Restricciones que no se pueden romper

1. **`userModified: true` es intocable.** El generador no pisa una rutina que
   el usuario editó. Si hay conflicto, pregunta.
2. **No toca el historial.** Las sesiones ya hechas y el mapa de progresión
   quedan como están.
3. **Es previsualizable y reversible.** Se ve antes de confirmar y se puede
   deshacer: genera rutinas nuevas, no reescribe las existentes.
4. **No sube `SEED_VERSION`.** Esto no es seed, es dato del usuario.

### 2.4 Dónde entra el foco de Nat

Nat tiene y debe mantener **más trabajo de pierna y glúteo que Lean**. El
generador necesita un parámetro de sesgo por grupo muscular, por usuario, no
una plantilla única. Es el tipo de regla que conviene consultar con los
expertos antes de fijar los números.

---

## Estado

**Hecho** (commit de esta tanda):

- `src/equipamiento.js` — 5 categorías, 27 ítems, 6 presets, `estaDisponible()`,
  `equipoFaltante()`, `describirEquipo()`.
- Campo `equipo` en los **227 ejercicios** del catálogo. Cambio puramente
  aditivo: 227 inserciones, 0 borrados. Validado: 0 sin campo, 0 con forma
  inválida, 0 con claves inexistentes.
- El mapeo se curó a mano. El borrador por reglas acertó ~75%; los ~60 restantes
  fallaban casi todos por lo mismo: **los ejercicios funcionales de casa tienen
  nombre genérico** (*Remo*, *Bíceps curl*, *Floor press*, *Press militar*) y no
  dicen el implemento. Van como "cualquier cosa que se sostenga con la mano".

**Siguiente**: `src/lugares.js` + reemplazo de las seis duplicaciones + wizard.

**Después**: el programador.

---

## Pendientes que esto destapó

1. **`equipoOpcional` todavía no existe.** Hay ejercicios donde la carga es
   opcional (Zancadas, Pistol squat, Sentadilla sumo): quedaron como peso
   corporal, que es correcto para disponibilidad, pero se pierde el dato de que
   admiten carga. Conviene hacerlo **junto con** unificar `chalecoApplies()` —
   que hoy es una lista de patrones en `workout.js` — para no tener dos verdades
   sobre lo mismo.
2. **Falta noción de "familia" de ejercicio**, para que la regla de adyacencia
   detecte mecánicas equivalentes y no sólo nombres iguales.
3. **`tipo` tiene un valor huérfano.** "Patada de tríceps con mancuerna" es
   `tipo: 'fuerza'`, cuando el resto del catálogo usa `maquina` o `funcional`.
   `tipo` decide el incremento del stepper (2.5 vs 1 kg), la etiqueta M/F y el
   filtro Funcional, así que ese ejercicio se comporta distinto sin motivo.
