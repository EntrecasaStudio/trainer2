const USA_PESO = ['press','remo','curl','extensión','extension','barra',
  'mancuerna','kettlebell','rusa','disco','polea','maquina','sentadilla',
  'peso muerto','hip thrust','jalón','jalon','dominada','vuelo',
  'elevación','elevacion','empuje','fondos','biceps','triceps'];

const NO_PESO = ['plancha','flexion','flexión','burpee','jumping',
  'mountain','bear crawl','pasadas','velocidad','hiit','trx','banda',
  'ab wheel','pallof','deadbug','dead bug','complex','espinales','hollow',
  'wall ball','caminata','patada'];

export function inferUsaPeso(nombre) {
  const n = (nombre || '').toLowerCase();
  if (NO_PESO.some(k => n.includes(k))) return false;
  if (USA_PESO.some(k => n.includes(k))) return true;
  return false;
}
