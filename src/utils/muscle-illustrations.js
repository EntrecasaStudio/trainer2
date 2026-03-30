/**
 * Muscle group SVG illustrations using polygon data.
 * Based on react-body-highlighter (MIT license).
 * ViewBox: 0 0 100 200 (front) / 0 0 100 225 (back)
 *
 * Usage: getMuscleSvg('Pecho') → SVG string with Pecho highlighted
 */

// ── Front view polygon data ──

const FRONT_PARTS = {
  head: [
    '42.45 2.86 40 11.84 42.04 19.59 46.12 23.27 49.8 25.31 54.69 22.45 57.55 19.18 59.18 10.2 57.14 2.45 49.8 0',
  ],
  neck: [
    '55.51 23.67 50.61 33.47 50.61 39.18 61.63 40 70.61 44.9 69.39 36.73 63.27 35.1 58.37 30.61',
    '28.98 44.9 30.2 37.14 36.33 35.1 41.22 30.2 44.49 24.49 48.98 33.88 48.57 39.18 37.96 39.59',
  ],
  chest: [
    '51.84 41.63 51.02 55.1 57.96 57.96 67.76 55.51 70.61 47.35 62.04 41.63',
    '29.8 46.53 31.43 55.51 40.82 57.96 48.16 55.1 47.76 42.04 37.55 42.04',
  ],
  front_deltoids: [
    '78.37 53.06 79.59 47.76 79.18 41.22 75.92 37.96 71.02 36.33 72.24 42.86 71.43 47.35',
    '28.16 47.35 21.22 53.06 20 47.76 20.41 40.82 24.49 37.14 28.57 37.14 26.94 43.27',
  ],
  biceps: [
    '16.73 68.16 17.96 71.43 22.86 66.12 28.98 53.88 27.76 49.39 20.41 55.92',
    '71.43 49.39 70.2 54.69 76.33 66.12 81.63 71.84 82.86 68.98 78.78 55.51',
  ],
  triceps: [
    '69.39 55.51 69.39 61.63 75.92 72.65 77.55 70.2 75.51 67.35',
    '22.45 69.39 29.8 55.51 29.8 60.82 22.86 73.06',
  ],
  forearm: [
    '6.12 88.57 10.2 75.1 14.69 70.2 16.33 74.29 19.18 73.47 4.49 97.55 0 100',
    '84.49 69.8 83.27 73.47 80 73.06 95.1 98.37 100 100.41 93.47 89.39 89.8 76.33',
    '77.55 72.24 77.55 77.55 80.41 84.08 85.31 89.8 92.24 101.22 94.69 99.59',
    '6.94 101.22 13.47 90.61 18.78 84.08 21.63 77.14 21.22 71.84 4.9 98.78',
  ],
  abs: [
    '56.33 59.18 57.96 64.08 58.37 77.96 58.37 92.65 56.33 98.37 55.1 104.08 51.43 107.76 51.02 84.49 50.61 67.35 51.02 57.14',
    '43.67 58.78 48.57 57.14 48.98 67.35 48.57 84.49 48.16 107.35 44.49 103.67 40.82 91.43 40.82 78.37 41.22 64.49',
  ],
  obliques: [
    '68.57 63.27 67.35 57.14 58.78 59.59 60 64.08 60.41 83.27 65.71 78.78 66.53 69.8',
    '33.88 78.37 33.06 71.84 31.02 63.27 32.24 57.14 40.82 59.18 39.18 63.27 39.18 83.67',
  ],
  abductors: [
    '52.65 110.2 54.29 124.9 60 110.2 62.04 100 64.9 94.29 60 92.65 56.73 104.49',
    '47.76 110.61 44.9 125.31 42.04 115.92 40.41 113.06 39.59 107.35 37.96 102.45 34.69 93.88 39.59 92.24 41.63 99.18 43.67 105.31',
  ],
  quadriceps: [
    '34.69 98.78 37.14 108.16 37.14 127.76 34.29 137.14 31.02 132.65 29.39 120 28.16 111.43 29.39 100.82 32.24 94.69',
    '63.27 105.71 64.49 100 66.94 94.69 70.2 101.22 71.02 111.84 68.16 133.06 65.31 137.55 62.45 128.57 62.04 111.43',
    '38.78 129.39 38.37 112.24 41.22 118.37 44.49 129.39 42.86 135.1 40 146.12 36.33 146.53 35.51 140',
    '59.59 145.71 55.51 128.98 60.82 113.88 61.22 130.2 64.08 139.59 62.86 146.53',
    '32.65 138.37 26.53 145.71 25.71 136.73 25.71 127.35 26.94 114.29 29.39 133.47',
    '71.84 113.06 73.88 124.08 73.88 140.41 72.65 145.71 66.53 138.37 70.2 133.47',
  ],
  knees: [
    '33.88 140 34.69 143.27 35.51 147.35 36.33 151.02 35.1 156.73 29.8 156.73 27.35 152.65 27.35 147.35 30.2 144.08',
    '65.71 140 72.24 147.76 72.24 152.24 69.8 157.14 64.9 156.73 62.86 151.02',
  ],
  calves: [
    '71.43 160.41 73.47 153.47 76.73 161.22 79.59 167.76 78.37 187.76 79.59 195.51 74.69 195.51',
    '24.9 194.69 27.76 164.9 28.16 160.41 26.12 154.29 24.9 157.55 22.45 161.63 20.82 167.76 22.04 188.16 20.82 195.51',
    '72.65 195.1 69.8 159.18 65.31 158.37 64.08 162.45 64.08 165.31 65.71 177.14',
    '35.51 158.37 35.92 162.45 35.92 166.94 35.1 172.24 35.1 176.73 32.24 182.04 30.61 187.35 26.94 194.69 27.35 187.76 28.16 180.41 28.57 175.51 28.98 169.8 29.8 164.08 30.2 158.78',
  ],
  hands: [
    '0 98 5 95 9 97 11 102 10 108 7 112 3 113 0 110',
    '100 98 95 95 91 97 89 102 90 108 93 112 97 113 100 110',
  ],
  feet: [
    '18 195 22 193 27 193 29 195 28 199 22 200 17 199',
    '82 195 78 193 73 193 71 195 72 199 78 200 83 199',
  ],
};

// ── Back view polygon data ──

const BACK_PARTS = {
  head: [
    '50.64 0 45.96 0.85 40.85 5.53 40.43 12.77 45.11 20 55.74 20 59.15 13.62 59.57 4.68 55.74 1.28',
  ],
  trapezius: [
    '44.68 21.7 47.66 21.7 47.23 38.3 47.66 64.68 38.3 53.19 35.32 40.85 31.06 36.6 39.15 33.19 43.83 27.23',
    '52.34 21.7 55.74 21.7 56.6 27.23 60.85 32.77 68.94 36.6 64.68 40.43 61.7 53.19 52.34 64.68 53.19 38.3',
  ],
  back_deltoids: [
    '29.36 37.02 22.98 39.15 17.45 44.26 18.3 53.62 24.26 49.36 27.23 46.38',
    '71.06 37.02 78.3 39.57 82.55 44.68 81.7 53.62 74.89 48.94 72.34 45.11',
  ],
  upper_back: [
    '31.06 38.72 28.09 48.94 28.51 55.32 34.04 75.32 47.23 71.06 47.23 66.38 36.6 54.04 33.62 41.28',
    '68.94 38.72 71.91 49.36 71.49 56.17 65.96 75.32 52.77 71.06 52.77 66.38 63.4 54.47 66.38 41.7',
  ],
  back_triceps: [
    '26.81 49.79 17.87 55.74 14.47 72.34 16.6 81.7 21.7 63.83 26.81 55.74',
    '73.62 50.21 82.13 55.74 85.96 73.19 83.4 82.13 77.87 62.98 73.19 55.74',
    '26.81 58.3 26.81 68.51 22.98 75.32 19.15 77.45 22.55 65.53',
    '72.77 58.3 77.02 64.68 80.43 77.45 76.6 75.32 72.77 68.94',
  ],
  lower_back: [
    '47.66 72.77 34.47 77.02 35.32 83.4 49.36 102.13 46.81 82.98',
    '52.34 72.77 65.53 77.02 64.68 83.4 50.64 102.13 53.19 83.83',
  ],
  back_forearm: [
    '86.38 75.74 91.06 83.4 93.19 94.04 100 106.38 96.17 104.26 88.09 89.36 84.26 83.83',
    '13.62 75.74 8.94 83.83 6.81 93.62 0 106.38 3.83 104.26 12.34 88.51 15.74 82.98',
    '81.28 79.57 77.45 77.87 79.15 84.68 91.06 103.83 93.19 108.94 94.47 104.68',
    '18.72 79.57 22.13 77.87 20.85 84.26 9.36 102.98 6.81 108.51 5.11 104.68',
  ],
  gluteal: [
    '44.68 99.57 30.21 108.51 29.79 118.72 31.49 125.96 47.23 121.28 49.36 114.89',
    '55.32 99.15 51.06 114.47 52.34 120.85 68.09 125.96 69.79 119.15 69.36 108.51',
  ],
  abductor: [
    '48.09 122.98 44.68 122.98 41.28 125.53 45.11 144.26 48.51 135.74 48.94 129.36',
    '51.91 122.55 55.74 123.4 59.15 125.96 54.89 144.26 51.91 136.17 51.06 129.36',
  ],
  hamstring: [
    '28.94 122.13 31.06 129.36 36.6 125.96 35.32 135.32 34.47 150.21 29.36 158.3 28.94 146.81 27.66 141.28 27.23 131.49',
    '71.49 121.7 69.36 128.94 63.83 125.96 65.53 136.6 66.38 150.21 71.06 158.3 71.49 147.66 72.77 142.13 73.62 131.91',
    '38.72 125.53 44.26 145.96 40.43 166.81 36.17 152.77 37.02 135.32',
    '61.7 125.53 63.4 136.17 64.26 153.19 60 166.81 56.17 146.38',
  ],
  back_knees: [
    '34.47 153.19 31.06 159.15 33.62 166.38 37.45 162.55',
    '66.38 153.62 62.98 162.98 66.81 166.38 69.36 159.15',
  ],
  back_calves: [
    '29.36 160.43 28.51 167.23 24.68 179.57 23.83 192.77 25.53 197.02 28.51 193.19 29.79 180 31.91 171.06 31.91 166.81',
    '37.45 165.11 35.32 167.66 33.19 171.91 31.06 180.43 30.21 191.91 34.04 200 38.72 190.64 39.15 168.94',
    '62.98 165.11 61.28 168.51 61.7 190.64 66.38 199.57 70.64 191.91 68.94 179.57 66.81 170.21',
    '70.64 160.43 72.34 168.51 75.74 179.15 76.6 192.77 74.47 196.6 72.34 193.62 70.64 179.57 68.09 168.09',
  ],
  soleus: [
    '28.51 195.74 30.21 195.74 33.62 201.7 30.64 220 28.51 213.62 26.81 198.3',
    '69.79 195.74 71.91 195.74 73.62 198.3 71.91 213.19 70.21 219.57 67.23 202.13',
  ],
  back_hands: [
    '0 105 5 102 9 104 11 109 10 115 7 118 3 119 0 116',
    '100 105 95 102 91 104 89 109 90 115 93 118 97 119 100 116',
  ],
  back_feet: [
    '26 218 29 216 33 216 35 218 34 222 29 224 26 222',
    '74 218 71 216 67 216 65 218 66 222 71 224 74 222',
  ],
};

// ── Group mapping: grupo → { view, activeParts } ──

const GRUPO_MAP = {
  Pecho:      { front: ['chest'],                                                              back: [] },
  Hombros:    { front: ['front_deltoids'],                                                     back: ['back_deltoids'] },
  Brazos:     { front: ['biceps', 'triceps', 'forearm'],                                       back: ['back_triceps', 'back_forearm'] },
  Core:       { front: ['abs', 'obliques'],                                                    back: ['lower_back'] },
  Piernas:    { front: ['abductors', 'quadriceps', 'knees', 'calves'],                         back: ['hamstring', 'back_knees', 'back_calves'] },
  Espalda:    { front: [],                                                                     back: ['trapezius', 'upper_back', 'back_deltoids', 'lower_back'] },
  'Glúteos':  { front: [],                                                                     back: ['gluteal', 'abductor'] },
  Cardio:     { front: ['chest', 'abs'],                                                       back: ['upper_back'] },
  HIIT:       { front: ['chest', 'abs', 'quadriceps', 'front_deltoids'],                       back: ['upper_back', 'hamstring', 'gluteal'] },
};

// ── Cropped viewBox per grupo (zoomed to relevant area) ──

const GRUPO_VIEWBOX = {
  Pecho:     { vb: '15 25 70 45',   view: 'front' },
  Hombros:   { vb: '10 25 80 40',   view: 'front' },
  Brazos:    { vb: '0 35 100 70',   view: 'front' },
  Core:      { vb: '25 48 50 68',   view: 'front' },
  Piernas:   { vb: '15 85 70 115',  view: 'front' },
  Espalda:   { vb: '10 12 80 100',  view: 'back'  },
  'Glúteos': { vb: '20 88 60 85',   view: 'back'  },
  HIIT:      { vb: '5 10 90 190',   view: 'front' },
};

/**
 * Returns an SVG string showing the human silhouette with the
 * specified muscle group highlighted.
 * @param {string} grupo - Muscle group name (Pecho, Espalda, etc.)
 * @param {number} [size=64] - SVG display size (height)
 * @param {{ allMuscles?: boolean }} [opts] - If allMuscles=true, render all muscle groups (muted + active)
 * @returns {string} SVG markup
 */
export function getMuscleSvg(grupo, size = 64, opts = {}) {
  const mapping = GRUPO_MAP[grupo];
  if (!mapping) return '';

  // Pick the view that has the most active parts
  const view = mapping.back.length >= mapping.front.length ? 'back' : 'front';
  const activeParts = view === 'front' ? mapping.front : mapping.back;
  const allParts = view === 'front' ? FRONT_PARTS : BACK_PARTS;
  const vb = view === 'front' ? '0 0 100 200' : '0 0 100 225';
  const vbH = view === 'front' ? 200 : 225;
  const w = size * (100 / vbH);

  let polygonsHtml = '';
  for (const [partName, polygons] of Object.entries(allParts)) {
    const isActive = activeParts.includes(partName);
    const cls = isActive ? 'muscle-part muscle-active' : 'muscle-part';
    const polys = polygons.map((p) => `<polygon points="${p}"/>`).join('');
    polygonsHtml += `<g class="${cls}" data-muscle="${partName}">${polys}</g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w.toFixed(0)}" height="${size}" viewBox="${vb}" class="muscle-silhouette">${polygonsHtml}</svg>`;
}

/**
 * Returns a cropped SVG zoomed into the relevant body area for a muscle group.
 * Shows surrounding muscles as muted context.
 */
export function getMuscleSvgCropped(grupo, size = 40) {
  const mapping = GRUPO_MAP[grupo];
  const crop = GRUPO_VIEWBOX[grupo];
  if (!mapping || !crop) return getMuscleSvg(grupo, size);

  const activeParts = crop.view === 'front' ? mapping.front : mapping.back;
  const allParts = crop.view === 'front' ? FRONT_PARTS : BACK_PARTS;
  const [, , vbW, vbH] = crop.vb.split(' ').map(Number);
  const w = size * (vbW / vbH);

  let polygonsHtml = '';
  for (const [partName, polygons] of Object.entries(allParts)) {
    const isActive = activeParts.includes(partName);
    const cls = isActive ? 'muscle-part muscle-active' : 'muscle-part';
    const polys = polygons.map((p) => `<polygon points="${p}"/>`).join('');
    polygonsHtml += `<g class="${cls}" data-muscle="${partName}">${polys}</g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w.toFixed(0)}" height="${size}" viewBox="${crop.vb}" class="muscle-silhouette muscle-silhouette-cropped">${polygonsHtml}</svg>`;
}

/**
 * Returns a composite illustration with front + back silhouettes side by side,
 * highlighting all the given muscle groups across both views.
 * @param {string[]} grupos - Array of muscle group names
 * @param {number} [size=32] - SVG height
 * @returns {string} HTML markup with two SVGs inside a .muscle-composite span
 */
export function getCompositeMuscleSvg(grupos, size = 32) {
  const frontActive = new Set();
  const backActive = new Set();

  for (const grupo of grupos) {
    const mapping = GRUPO_MAP[grupo];
    if (!mapping) continue;
    for (const part of mapping.front) frontActive.add(part);
    for (const part of mapping.back) backActive.add(part);
  }

  function renderView(allParts, activeSet, vb, vbH) {
    const w = size * (100 / vbH);
    let polysHtml = '';
    for (const [partName, polygons] of Object.entries(allParts)) {
      const isActive = activeSet.has(partName);
      const cls = isActive ? 'muscle-part muscle-active' : 'muscle-part';
      const polys = polygons.map((p) => `<polygon points="${p}"/>`).join('');
      polysHtml += `<g class="${cls}" data-muscle="${partName}">${polys}</g>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w.toFixed(0)}" height="${size}" viewBox="${vb}" class="muscle-silhouette">${polysHtml}</svg>`;
  }

  const frontSvg = renderView(FRONT_PARTS, frontActive, '0 0 100 200', 200);
  const backSvg = renderView(BACK_PARTS, backActive, '0 0 100 225', 225);

  return `<span class="muscle-composite">${frontSvg}${backSvg}</span>`;
}

/**
 * Render a heatmap silhouette (front + back) where each muscle group
 * is colored by its intensity level (0-3).
 * @param {Map<string, number>} intensityMap - grupo → level (0=inactive, 1=low, 2=med, 3=high)
 * @param {number} [size=120] - SVG height
 * @returns {string} HTML with front + back SVGs
 */
export function getMuscleHeatmapSvg(intensityMap, size = 120) {
  // Build part → intensity lookup from grupo → intensity
  const frontIntensity = {};
  const backIntensity = {};

  for (const [grupo, level] of intensityMap.entries()) {
    const mapping = GRUPO_MAP[grupo];
    if (!mapping) continue;
    for (const part of mapping.front) {
      frontIntensity[part] = Math.max(frontIntensity[part] || 0, level);
    }
    for (const part of mapping.back) {
      backIntensity[part] = Math.max(backIntensity[part] || 0, level);
    }
  }

  function renderView(allParts, partIntensity, vb, vbH) {
    const w = size * (100 / vbH);
    let polysHtml = '';
    for (const [partName, polygons] of Object.entries(allParts)) {
      const level = partIntensity[partName] || 0;
      const cls = level > 0 ? `muscle-part muscle-heat-${level}` : 'muscle-part';
      const polys = polygons.map((p) => `<polygon points="${p}"/>`).join('');
      polysHtml += `<g class="${cls}" data-muscle="${partName}">${polys}</g>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w.toFixed(0)}" height="${size}" viewBox="${vb}" class="muscle-silhouette muscle-heatmap">${polysHtml}</svg>`;
  }

  const frontSvg = renderView(FRONT_PARTS, frontIntensity, '0 0 100 200', 200);
  const backSvg = renderView(BACK_PARTS, backIntensity, '0 0 100 225', 225);

  return `<div class="muscle-heatmap-pair">${frontSvg}${backSvg}</div>`;
}

// Re-export for backward compat with existing MUSCLE_GROUP_SVG consumers
export const MUSCLE_GROUP_SVG = {};
for (const grupo of Object.keys(GRUPO_MAP)) {
  MUSCLE_GROUP_SVG[grupo] = getMuscleSvg(grupo);
}
