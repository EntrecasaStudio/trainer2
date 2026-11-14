// Audita la regla de adyacencia sobre los archivos de referencia.
//
//   node .claude/auditar-adyacencia.mjs
//
// OJO: lee los .md de referencia, que NO se actualizan solos. Antes de confiar
// en el resultado, reimportá los datos del usuario (ver CLAUDE.md, "Routine
// Analysis"): Usuario → "Copiar rutinas" → actualizar-referencia.py --importar
//
import fs from 'fs';
import { auditarAdyacencia } from '/home/user/trainer2/src/adyacencia.js';

function leer(f) {
  const rutinas = [];
  let actual = null;
  for (const line of fs.readFileSync(f,'utf8').split('\n')) {
    const h = /^##\s+(.+?)(\s*\[MODIFICADA\])?\s*$/.exec(line);
    if (h) { actual = { nombre: h[1].trim(), circuitos: [] }; rutinas.push(actual); continue; }
    const c = /^\s*C(\d+)\s+([^:]+):\s*(.+)$/.exec(line);
    if (c && actual) {
      actual.circuitos.push({
        nombre: c[2].trim(),
        ejercicios: [...c[3].matchAll(/([^,(]+)\s*\(\d+x[^)]*\)/g)].map(m => ({ nombre: m[1].trim() })),
      });
    }
  }
  return rutinas;
}

for (const [quien, f] of [['LEAN','.claude/rutinas-lean-casa-actual.md'], ['NAT','.claude/rutinas-nat-casa-actual.md']]) {
  const rutinas = leer('/home/user/trainer2/' + f);
  const { orden, choques } = auditarAdyacencia(rutinas);
  console.log(`\n══ ${quien}: ${rutinas.length} rutinas, ${orden.length} entran en la rotación`);
  console.log('   orden:', orden.map(n=>n.replace(/Casa |—.*/g,'').trim()).join(' → '));
  if (!choques.length) { console.log('   sin choques'); continue; }
  const exactos = choques.filter(c=>c.exacto), familia = choques.filter(c=>!c.exacto);
  console.log(`   ${choques.length} choques: ${exactos.length} por nombre exacto, ${familia.length} por familia\n`);
  for (const c of choques) {
    const corto = s => s.replace(/Casa |— (Lean|Nat)/g,'').trim();
    console.log(`   d${c.distancia}  ${corto(c.a.rutina)} C${c.a.ci+1} ${c.a.nombre}`);
    console.log(`       ↕  ${corto(c.b.rutina)} C${c.b.ci+1} ${c.b.nombre}${c.exacto?'':`   [familia: ${c.familia}]`}`);
  }
}
