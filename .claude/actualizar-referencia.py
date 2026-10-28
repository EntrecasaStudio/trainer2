#!/usr/bin/env python3
"""
Pone al día los archivos de referencia de rutinas con lo que el seed ya le hace
a los datos en vivo.

POR QUÉ EXISTE
--------------
`rutinas-lean-casa-actual.md` y `rutinas-nat-casa-actual.md` son una foto de las
rutinas tal como estaban en la app el día que se pegaron, con las ediciones
manuales del usuario incluidas. Esa parte no se puede derivar del seed, así que
los archivos siguen siendo la fuente para eso.

Pero `seedV2()` corre en cada arranque y les sigue aplicando cambios: primero
`applyExerciseRenames()` con el RENAME_MAP, después `migrateCompoundExercises()`
con el array PATCHES. Los archivos no se enteran, así que se van quedando viejos
y cualquier conteo hecho sobre ellos sale mal. Ya pasó dos veces: circuitos que
figuraban con un ejercicio que la migración había cambiado meses atrás.

Este script replica esas dos etapas, en el mismo orden que `seedV2()`, y
reescribe los .md. Es idempotente: los parches sólo se aplican cuando el nombre
viejo coincide, así que correrlo de nuevo no hace nada.

LO QUE NO HACE
--------------
No inventa el estado en vivo. Si el usuario edita una rutina desde la app, eso
sigue necesitando que pegue el estado nuevo. Esto sólo evita que el archivo se
atrase respecto de las migraciones que ya están en el código.

USO
---
    python3 .claude/actualizar-referencia.py            # aplica y reescribe
    python3 .claude/actualizar-referencia.py --dry-run  # sólo muestra qué haría

    # Traer el estado real desde la app (lo que manda sobre todo lo demás):
    # en la pestaña Usuario, botón "Copiar rutinas", pegar en un archivo, y
    python3 .claude/actualizar-referencia.py --importar lean.txt
    python3 .claude/actualizar-referencia.py --importar nat.txt

El modo --importar convierte el formato del exportador de la app al de estos
archivos y reemplaza las rutinas CASA del usuario que corresponda. Es la única
forma de capturar las ediciones hechas desde la app, así que conviene correrlo
antes de cualquier análisis.
"""
import io
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEED = os.path.join(RAIZ, 'src', 'seed.js')
REFS = [
    (os.path.join(RAIZ, '.claude', 'rutinas-lean-casa-actual.md'), 'Lean'),
    (os.path.join(RAIZ, '.claude', 'rutinas-nat-casa-actual.md'), 'Nat'),
]


def leer_seed():
    """Saca RENAME_MAP y PATCHES de seed.js."""
    s = io.open(SEED, encoding='utf-8').read()

    m = re.search(r'const RENAME_MAP = new Map\(\[(.*?)\n  \]\);', s, re.S)
    if not m:
        sys.exit('No encontré RENAME_MAP en seed.js — ¿cambió la estructura?')
    renames = dict(re.findall(r"\['([^']+)', '([^']+)'\]", m.group(1)))

    m = re.search(r'const PATCHES = \[(.*?)\n  \];', s, re.S)
    if not m:
        sys.exit('No encontré PATCHES en seed.js — ¿cambió la estructura?')
    patches = [
        (r, int(ci), int(ei), old, new, se, rp)
        for r, ci, ei, old, new, se, rp in re.findall(
            r"\['([^']+)',\s*(\d+),\s*(\d+),\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*'([^']+)'\]",
            m.group(1))
    ]
    return renames, patches


LINEA = re.compile(r'^(\s*)(C\d)\s+([^:]+):\s*(.*)$')
EJ = re.compile(r'([^,]+?)\s*\((\d+)x([^)]+)\)')


def parsear(texto):
    """[(tipo, contenido)] donde tipo es 'cabecera', 'circuito' u 'otro'.

    Un circuito queda como (sangria, etiqueta_circuito, etiqueta_grupos,
    [[nombre, series, reps], ...]).
    """
    out = []
    rutina = None
    for linea in texto.split('\n'):
        if linea.startswith('## '):
            rutina = linea[3:].replace(' [MODIFICADA]', '').strip()
            out.append(('cabecera', linea, rutina))
            continue
        m = LINEA.match(linea)
        if m and rutina:
            ejs = [[n.strip(), s, r] for n, s, r in EJ.findall(m.group(4))]
            if ejs:
                out.append(('circuito', (m.group(1), m.group(2), m.group(3), ejs), rutina))
                continue
        out.append(('otro', linea, rutina))
    return out


def serializar(parsed):
    partes = []
    for tipo, dato, _ in parsed:
        if tipo == 'circuito':
            sang, circ, grupos, ejs = dato
            cuerpo = ', '.join(f'{n} ({s}x{r})' for n, s, r in ejs)
            partes.append(f'{sang}{circ} {grupos}: {cuerpo}')
        else:
            partes.append(dato)
    return '\n'.join(partes)


# El exportador de la app (window.exportRutinas en src/main.js) escribe:
#   ## Casa Press A — Nat (CASA) [MODIFICADA]
#     C1: PIERNAS·GLÚTEOS
#       - Sumo squat to calf raise (2x12)
# Estos archivos usan una línea por circuito, así que hay que convertirlo.
EXP_CAB = re.compile(r'^##\s+(.+?)\s+\(([A-Z_]+)\)(\s*\[MODIFICADA\])?\s*$')
EXP_CIRC = re.compile(r'^\s+C(\d):\s*(.*)$')
EXP_EJ = re.compile(r'^\s+-\s+(.+?)\s*\((\d+)x([^)]+)\)\s*$')


def importar(ruta_export):
    """Lee el formato del exportador y devuelve {rutina: (modificada, [circuitos])}."""
    rutinas, actual, circ = {}, None, None
    for linea in io.open(ruta_export, encoding='utf-8').read().split('\n'):
        m = EXP_CAB.match(linea)
        if m:
            nombre, lugar, mod = m.group(1).strip(), m.group(2), bool(m.group(3))
            actual = (nombre, lugar)
            rutinas[actual] = (mod, [])
            circ = None
            continue
        if actual is None:
            continue
        m = EXP_CIRC.match(linea)
        if m:
            circ = [m.group(1), m.group(2).strip(), []]
            rutinas[actual][1].append(circ)
            continue
        m = EXP_EJ.match(linea)
        if m and circ is not None:
            circ[2].append([m.group(1).strip(), m.group(2), m.group(3)])
    return rutinas


def aplicar_import(ruta_ref, ruta_export):
    importadas = importar(ruta_export)
    casa = {k: v for k, v in importadas.items() if k[1] == 'CASA'}
    if not casa:
        sys.exit(f'{ruta_export}: no encontré ninguna rutina CASA. '
                 '¿Exportaste con el selector de lugar en "Casa"?')

    texto = io.open(ruta_ref, encoding='utf-8').read()
    cabecera = texto.split('\n## ')[0].rstrip('\n')

    bloques = []
    for (nombre, _), (mod, circuitos) in casa.items():
        bloques.append(f"## {nombre}{' [MODIFICADA]' if mod else ''}")
        for num, grupos, ejs in circuitos:
            cuerpo = ', '.join(f'{n} ({s}x{r})' for n, s, r in ejs)
            bloques.append(f'  C{num} {grupos}: {cuerpo}')
        bloques.append('')

    io.open(ruta_ref, 'w', encoding='utf-8').write(cabecera + '\n\n' + '\n'.join(bloques).rstrip('\n') + '\n')
    print(f'{os.path.relpath(ruta_ref, RAIZ)}: {len(casa)} rutinas CASA importadas desde '
          f'{os.path.basename(ruta_export)}')
    total = sum(len(e) for _, cs in casa.values() for _, _, e in cs)
    print(f'  {total} ejercicios en {sum(len(cs) for _, cs in casa.values())} circuitos')


def main():
    if '--importar' in sys.argv:
        i = sys.argv.index('--importar')
        if i + 1 >= len(sys.argv):
            sys.exit('--importar necesita la ruta del archivo exportado')
        ruta_export = sys.argv[i + 1]
        importadas = importar(ruta_export)
        usuarios = {n.rsplit('— ', 1)[-1] for n, _ in importadas}
        destino = next((r for r, q in REFS if q in usuarios), None)
        if destino is None:
            sys.exit(f'No pude deducir el usuario del export (vi: {usuarios or "nada"}). '
                     'Los nombres tienen que terminar en "— Lean" o "— Nat".')
        aplicar_import(destino, ruta_export)
        print('\nAhora corré el script sin --importar para aplicar renombrados y parches.')
        return

    dry = '--dry-run' in sys.argv
    renames, patches = leer_seed()
    print(f'seed.js: {len(renames)} renombrados, {len(patches)} parches\n')

    for ruta, quien in REFS:
        parsed = parsear(io.open(ruta, encoding='utf-8').read())
        cambios = []

        # Etapa 1 — applyExerciseRenames(). Va primero, igual que en seedV2().
        for tipo, dato, rutina in parsed:
            if tipo != 'circuito':
                continue
            _, circ, _, ejs = dato
            for ej in ejs:
                if ej[0] in renames:
                    cambios.append(f'  [rename] {rutina} {circ}: {ej[0]} -> {renames[ej[0]]}')
                    ej[0] = renames[ej[0]]

        # Etapa 2 — migrateCompoundExercises(). El nombre viejo es la guarda,
        # así que un parche ya aplicado no vuelve a tocar nada.
        indice = {}
        for tipo, dato, rutina in parsed:
            if tipo == 'circuito':
                indice.setdefault(rutina, []).append(dato)
        for rn, ci, ei, old, new, se, rp in patches:
            circuitos = indice.get(rn)
            if not circuitos or ci >= len(circuitos):
                continue
            ejs = circuitos[ci][3]
            if ei >= len(ejs) or ejs[ei][0] != old:
                continue
            cambios.append(f'  [parche] {rn} C{ci + 1}[{ei}]: {old} -> {new} ({se}x{rp})')
            ejs[ei] = [new, se, rp]

        print(f'{quien}: {len(cambios)} cambios')
        for c in cambios:
            print(c)
        if cambios and not dry:
            io.open(ruta, 'w', encoding='utf-8').write(serializar(parsed))
            print(f'  -> escrito {os.path.relpath(ruta, RAIZ)}')
        print()

    if dry:
        print('(--dry-run: no se escribió nada)')


if __name__ == '__main__':
    main()
