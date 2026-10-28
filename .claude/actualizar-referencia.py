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


def main():
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
