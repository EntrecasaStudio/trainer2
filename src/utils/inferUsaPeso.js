import { findEjercicio } from '../ejercicios-catalogo.js';

const USA_PESO = ['press','remo','curl','extensión','extension','barra',
  'mancuerna','kettlebell','rusa','disco','polea','maquina','máquina','sentadilla',
  'peso muerto','hip thrust','jalón','jalon','dominada','vuelo',
  'elevación','elevacion','empuje','fondos','biceps','triceps','tobillera','prensa',
  'aductor','abductor','gemelo','pulldown','face pull','encogimiento',
  'plato rucking','chaleco'];

// These override USA_PESO when both match (e.g. "Banda press de pecho")
const BODYWEIGHT_OVERRIDE = ['trx','banda','muscle-up','muscle up','plancha'];

const NO_PESO = ['flexion','flexión','burpee','jumping',
  'mountain','bear crawl','pasadas','velocidad','hiit',
  'ab wheel','pallof','deadbug','dead bug','complex','espinales','hollow',
  'wall ball','caminata','patada'];

function getCustomObj() {
  try {
    let custom = JSON.parse(localStorage.getItem('gym_ejercicios_custom') || '{}');
    // Migrate array format to object keyed by nombre
    if (Array.isArray(custom)) {
      const obj = {};
      custom.forEach(item => { if (item?.nombre) obj[item.nombre] = item; });
      localStorage.setItem('gym_ejercicios_custom', JSON.stringify(obj));
      custom = obj;
    }
    return custom;
  } catch { return {}; }
}

export function inferUsaPeso(nombre) {
  // Check user override first
  const custom = getCustomObj();
  if (custom[nombre]?.usaPeso !== undefined) return custom[nombre].usaPeso;
  return usaPesoBase(nombre);
}

// Same answer, ignoring any saved user override. The edit form uses it to tell
// an actual user choice apart from a value that simply matches the catalog, so
// it only stores an override when the user really changed something.
export function usaPesoBase(nombre) {
  // The catalog is hand-curated and is the source of truth for every exercise
  // in it, in both directions. The keyword lists below only see the NAME, so
  // they miss loaded exercises with no equipment word ("Zancadas", "Pistol
  // squat") and invent weight for bodyweight ones that merely contain
  // "sentadilla" ("Sentadilla con salto", "Sentadilla corporal").
  const delCatalogo = findEjercicio(nombre);
  if (delCatalogo && typeof delCatalogo.usaPeso === 'boolean') return delCatalogo.usaPeso;

  // Only names that are not in the catalog at all (user-created exercises)
  // fall back to guessing from the name.
  return keywordUsaPeso(nombre);
}

// The old name-only guess, kept exported so the migration can recognise an
// override that is just a stamp of this guess rather than a real choice.
export function keywordUsaPeso(nombre) {
  const n = (nombre || '').toLowerCase();
  // Bodyweight overrides win when combined with weight keywords (e.g. "Banda curl biceps")
  if (BODYWEIGHT_OVERRIDE.some(k => n.includes(k))) return false;
  // Then check weight equipment keywords
  if (USA_PESO.some(k => n.includes(k))) return true;
  if (NO_PESO.some(k => n.includes(k))) return false;
  return false;
}

export function setUsaPeso(nombre, value) {
  const custom = getCustomObj();
  if (!custom[nombre]) custom[nombre] = {};
  custom[nombre].usaPeso = value;
  localStorage.setItem('gym_ejercicios_custom', JSON.stringify(custom));
}
