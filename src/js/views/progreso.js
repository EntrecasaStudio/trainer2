import { store } from '../../store.js';
import { formatDateISO } from '../../utils/calendar.js';
import { getLugarBadge } from '../../utils/format.js';
import { EJERCICIOS_CATALOGO } from '../../ejercicios-catalogo.js';

let _searchQuery = '';
let _searchVisible = false;

export function mountProgreso(container) {
  const activeUsuario = store.getActiveUser();
  let currentUser = activeUsuario;
  document.body.setAttribute('data-usuario', currentUser);
  _searchQuery = '';
  _searchVisible = false;

  container.innerHTML = `
    <div class="rutinas-header">
      <h1 style="font-size:var(--text-xl);font-weight:var(--fw-bold);">Progreso</h1>
      <div class="rutinas-header-actions">
        <button class="btn-icon-header" data-action="toggle-search" title="Buscar">
          <i class="ph ph-magnifying-glass"></i>
        </button>
        <div class="user-toggle" style="margin:0;">
          <button class="user-toggle-btn ${currentUser === 'Lean' ? 'active' : ''}" data-usuario="Lean">Lean</button>
          <button class="user-toggle-btn ${currentUser === 'Nat' ? 'active' : ''}" data-usuario="Nat">Nat</button>
        </div>
      </div>
    </div>
    <div class="rutinas-search" id="progreso-search-wrap">
      <input type="text" class="rutinas-search-input" id="progreso-search" placeholder="Buscar ejercicio..." autocomplete="off">
    </div>
    <div id="progreso-summary"></div>
    <div id="progreso-list"></div>
  `;

  container.querySelectorAll('.user-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentUser = btn.dataset.usuario;
      store.setActiveUser(currentUser);
      document.body.setAttribute('data-usuario', currentUser);
      container.querySelectorAll('.user-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderAll();
    });
  });

  container.querySelector('[data-action="toggle-search"]').addEventListener('click', () => {
    _searchVisible = !_searchVisible;
    const wrap = document.getElementById('progreso-search-wrap');
    wrap.classList.toggle('open', _searchVisible);
    if (_searchVisible) setTimeout(() => document.getElementById('progreso-search').focus(), 100);
    else { _searchQuery = ''; document.getElementById('progreso-search').value = ''; renderList(); }
  });

  document.getElementById('progreso-search').addEventListener('input', (e) => {
    _searchQuery = e.target.value.toLowerCase();
    renderList();
  });

  renderAll();

  function renderAll() {
    renderSummary();
    renderList();
  }

  // ── Weekly summary dashboard ────────────────────────────────────────────
  function renderSummary() {
    const el = document.getElementById('progreso-summary');
    if (_searchQuery) { el.innerHTML = ''; return; }

    const sesiones = store.getAll(store.KEYS.sesiones).filter(s => s.usuario === currentUser && s.fecha);
    if (sesiones.length === 0) { el.innerHTML = ''; return; }

    const today = new Date();
    const monday = getMonday(today);
    const dayOfWeek = (today.getDay() + 6) % 7;
    const daysElapsed = dayOfWeek + 1;

    const freq = calcFrequencyTrend(sesiones, monday, daysElapsed);
    const volTrend = calcVolumePerSessionTrend(sesiones);
    const streak = calcStreak(sesiones);
    const consistency = calcConsistency(sesiones, monday, 12, 3, daysElapsed);

    const weeklyVolumes = calcWeeklyVolumes(sesiones, monday, 12);
    const completedWeeks = weeklyVolumes.filter(w => !w.isCurrent && w.vol > 0);
    const avgVol = completedWeeks.length > 0
      ? completedWeeks.reduce((s, w) => s + w.vol, 0) / completedWeeks.length
      : 0;

    const highlightsHTML = buildHighlights(sesiones, streak);

    // Muscle group distribution (last 4 weeks)
    const fourWeeksAgo = new Date(monday);
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const fourWeeksStr = formatDateISO(fourWeeksAgo);
    const recentSesiones = sesiones.filter(s => s.fecha >= fourWeeksStr);
    const muscleData = buildMuscleDistribution(recentSesiones);

    el.innerHTML = `
      <div class="progreso-dashboard">
        <div class="progreso-trend-cards">
          <div class="progreso-trend-card">
            <div class="progreso-trend-header">
              <span class="progreso-trend-arrow ${freq.arrow === '↑' ? 'up' : freq.arrow === '↓' ? 'down' : ''}">${freq.arrow}</span>
              <span class="progreso-trend-title">Frecuencia</span>
            </div>
            <div class="progreso-trend-value">${freq.avg.toFixed(1)} <span class="progreso-trend-unit">ses/sem</span></div>
            <div class="progreso-trend-detail">promedio 90 días${freq.baseline != null ? ` · hist. ${freq.baseline.toFixed(1)}` : ''}</div>
            <div class="progreso-trend-mini">${buildMiniBarsSVG(freq.weeklyData)}</div>
            <div class="progreso-trend-secondary">~${freq.minPerSess} min/ses</div>
          </div>
          <div class="progreso-trend-card">
            <div class="progreso-trend-header">
              <span class="progreso-trend-arrow ${volTrend.arrow === '↑' ? 'up' : volTrend.arrow === '↓' ? 'down' : ''}">${volTrend.arrow}</span>
              <span class="progreso-trend-title">Volumen por sesión</span>
            </div>
            <div class="progreso-trend-value">${formatVol(volTrend.avg)}</div>
            <div class="progreso-trend-detail">promedio 90 días${volTrend.pctChange !== 0 ? ` · ${volTrend.pctChange > 0 ? '+' : ''}${volTrend.pctChange}% vs histórico` : ''}</div>
          </div>
          <div class="progreso-trend-card">
            <div class="progreso-trend-header">
              <span class="progreso-trend-title">Racha y constancia</span>
            </div>
            <div class="progreso-trend-value">${streak} <span class="progreso-trend-unit">sem</span></div>
            <div class="progreso-trend-detail">${consistency.met}/${consistency.total} semanas con 3+ sesiones</div>
            <div class="progreso-trend-dots">${buildDotStripSVG(consistency.weeks, 3)}</div>
          </div>
        </div>
        ${highlightsHTML ? `
        <div class="progreso-highlights">
          <div class="progreso-section-title">Destacados</div>
          ${highlightsHTML}
        </div>` : ''}
        ${weeklyVolumes.some(w => w.vol > 0) ? `
        <div class="progreso-vol-trend">
          <div class="progreso-vol-title">Tendencia de volumen · 12 semanas</div>
          ${buildVolumeBars(weeklyVolumes, avgVol)}
        </div>` : ''}
        ${muscleData.length > 0 ? `
        <div class="progreso-muscle-chart">
          <div class="progreso-muscle-title">Distribución muscular · últimas 4 semanas</div>
          <div class="progreso-muscle-ring">${buildRingSVG(muscleData)}</div>
          <div class="progreso-muscle-bars">
            ${muscleData.map(m => {
              const isBrazos = m.grupo === 'Brazos' && muscleData.brazosDetail?.length > 0;
              return `
              <div class="progreso-muscle-row${isBrazos ? ' progreso-muscle-expandable' : ''}"${isBrazos ? ' data-expand="brazos"' : ''}>
                <div class="progreso-muscle-dot" style="background:${m.color};"></div>
                <div class="progreso-muscle-name">${m.grupo}${isBrazos ? ' <span class="progreso-muscle-chevron">›</span>' : ''}</div>
                <div class="progreso-muscle-bar-wrap">
                  <div class="progreso-muscle-bar" style="width:${m.pct}%;background:${m.color};"></div>
                </div>
                <div class="progreso-muscle-pct">${m.pct}%</div>
              </div>${isBrazos ? `
              <div class="progreso-muscle-sub" id="brazos-detail">
                <div class="progreso-muscle-sub-inner">
                ${muscleData.brazosDetail.map(d => `
                  <div class="progreso-muscle-row progreso-muscle-sub-row">
                    <div class="progreso-muscle-dot" style="background:${m.color};opacity:${d.sub === 'Bíceps' ? '0.7' : '1'};"></div>
                    <div class="progreso-muscle-name">${d.sub}</div>
                    <div class="progreso-muscle-bar-wrap">
                      <div class="progreso-muscle-bar" style="width:${d.pct}%;background:${m.color};opacity:${d.sub === 'Bíceps' ? '0.7' : '1'};"></div>
                    </div>
                    <div class="progreso-muscle-pct">${d.pct}%</div>
                  </div>`).join('')}
                </div>
              </div>` : ''}`;
            }).join('')}
          </div>
        </div>` : ''}
      </div>
    `;

    el.querySelector('[data-expand="brazos"]')?.addEventListener('click', () => {
      const detail = document.getElementById('brazos-detail');
      if (!detail) return;
      const open = detail.classList.toggle('open');
      el.querySelector('.progreso-muscle-chevron')?.classList.toggle('open', open);
    });

    el.querySelectorAll('.progreso-vol-bar').forEach(bar => {
      bar.addEventListener('click', () => {
        const tip = bar.querySelector('.progreso-vol-tooltip');
        if (!tip) return;
        el.querySelectorAll('.progreso-vol-tooltip.visible').forEach(t => t.classList.remove('visible'));
        tip.classList.add('visible');
        setTimeout(() => tip.classList.remove('visible'), 2000);
      });
    });
  }

  function buildMuscleDistribution(sesiones) {
    const SECONDARY_GRUPO = [
      ['sentadilla sumo', 'Glúteos'],
      ['sentadilla búlgara', 'Glúteos'],
      ['sentadilla goblet', 'Glúteos'],
      ['zancada', 'Glúteos'],
      ['peso muerto', 'Glúteos'],
      ['step up', 'Glúteos'],
      ['plié', 'Glúteos'],
      ['split squat', 'Glúteos'],
      ['lunge', 'Glúteos'],
      ['narrow to wide', 'Glúteos'],
      ['sumo squat', 'Glúteos'],
    ];
    const counts = {}; // grupo → series count
    const armSub = { 'Bíceps': 0, 'Tríceps': 0 };
    for (const s of sesiones) {
      for (const c of (s.circuitos || [])) {
        for (const e of (c.ejercicios || [])) {
          const doneSeries = (e.seriesData || []).filter(sr => sr.done).length;
          if (doneSeries === 0) continue;
          const cat = EJERCICIOS_CATALOGO.find(ce => ce.nombre === e.nombre);
          const grupo = cat?.grupo || inferGrupoFromCircuit(c.nombre);
          if (!grupo || grupo === 'HIIT') continue;
          counts[grupo] = (counts[grupo] || 0) + doneSeries;
          if (grupo === 'Brazos' && cat?.musculos) {
            const m = cat.musculos.toLowerCase();
            if (m.includes('bíceps') || m.includes('biceps') || m.includes('braquial')) armSub['Bíceps'] += doneSeries;
            if (m.includes('tríceps') || m.includes('triceps')) armSub['Tríceps'] += doneSeries;
          }
          const nombre = (e.nombre || '').toLowerCase();
          for (const [pattern, secGrupo] of SECONDARY_GRUPO) {
            if (nombre.includes(pattern)) {
              counts[secGrupo] = (counts[secGrupo] || 0) + doneSeries;
              break;
            }
          }
        }
      }
    }

    const total = Object.values(counts).reduce((s, v) => s + v, 0);
    if (total === 0) return [];

    const style = getComputedStyle(document.documentElement);
    const tv = (v) => style.getPropertyValue(v).trim();
    const COLORS = {
      Piernas: tv('--color-tag-piernas'), Core: tv('--color-tag-core'), Pecho: tv('--color-tag-pecho'),
      Espalda: tv('--color-tag-espalda'), Brazos: tv('--color-tag-brazos'), Glúteos: tv('--color-tag-gluteos'),
      Hombros: tv('--color-tag-hombros'), HIIT: tv('--color-tag-hiit'),
    };

    const armTotal = armSub['Bíceps'] + armSub['Tríceps'];
    const brazosDetail = armTotal > 0 ? [
      { sub: 'Bíceps', count: armSub['Bíceps'], pct: Math.round((armSub['Bíceps'] / armTotal) * 100) },
      { sub: 'Tríceps', count: armSub['Tríceps'], pct: Math.round((armSub['Tríceps'] / armTotal) * 100) },
    ] : [];

    const result = Object.entries(counts)
      .map(([grupo, count]) => ({
        grupo,
        count,
        pct: Math.round((count / total) * 100),
        color: COLORS[grupo] || '#94a3b8',
      }))
      .sort((a, b) => b.count - a.count);
    result.brazosDetail = brazosDetail;
    return result;
  }

  function inferGrupoFromCircuit(nombre) {
    const n = (nombre || '').toLowerCase();
    if (n.includes('pierna') || n.includes('glúteo') || n.includes('gluteo')) return 'Piernas';
    if (n.includes('pecho')) return 'Pecho';
    if (n.includes('espalda')) return 'Espalda';
    if (n.includes('brazo') || n.includes('bíceps') || n.includes('biceps') || n.includes('tríceps') || n.includes('triceps')) return 'Brazos';
    if (n.includes('hombro')) return 'Hombros';
    if (n.includes('core')) return 'Core';
    if (n.includes('hiit') || n.includes('cardio')) return 'HIIT';
    return null;
  }

  function buildRingSVG(data) {
    const size = 120, cx = 60, cy = 60, r = 48, strokeW = 14;
    const circumference = 2 * Math.PI * r;
    let offset = 0;
    const segments = data.map(m => {
      const len = (m.pct / 100) * circumference;
      const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${m.color}" stroke-width="${strokeW}" stroke-dasharray="${len} ${circumference - len}" stroke-dashoffset="${-offset}" stroke-linecap="round" style="transform:rotate(-90deg);transform-origin:center;"/>`;
      offset += len;
      return seg;
    });
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${segments.join('')}</svg>`;
  }

  // ── Per-exercise progression ────────────────────────────────────────────
  function renderList() {
    const listEl = document.getElementById('progreso-list');
    const sesiones = store.getAll(store.KEYS.sesiones).filter(s => s.usuario === currentUser && s.fecha);
    const q = _searchQuery;

    // Build exercise history from sesiones (source of truth for lugar)
    const exerciseHistory = buildExerciseHistory(sesiones);

    // Build entries directly from sesion history (not from progresion store)
    const entries = [];
    for (const [key, history] of Object.entries(exerciseHistory)) {
      const [ejercicio, lugar] = key.split('__');
      if (!ejercicio || !lugar) continue;
      if (q && !ejercicio.toLowerCase().includes(q)) continue;
      if (history.length === 0) continue;

      const last = history[history.length - 1];
      const prog = store.getProgresion(ejercicio, currentUser, lugar);
      const consecutiveComplete = prog?.consecutiveComplete ?? (prog?.completedAllReps ? 1 : 0);
      const cat = EJERCICIOS_CATALOGO.find(c => c.nombre === ejercicio);
      const smartInc = cat?.tipo === 'maquina' ? 2.5 : 1;

      entries.push({
        ejercicio,
        lugar,
        history,
        lastWeight: last.peso,
        lastDate: last.fecha,
        consecutiveComplete,
        smartInc,
      });
    }

    entries.sort((a, b) => (b.lastDate || '').localeCompare(a.lastDate || ''));

    if (entries.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="ph-light ph-trend-up" style="font-size:48px;"></i></div>
          <div class="empty-state-text">${q ? 'Sin resultados' : 'Sin datos de progresión aún.<br>Completá un entrenamiento para ver tus pesos.'}</div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = entries.map(e => {
      const badge = getLugarBadge(e.lugar);
      const cols = e.history.slice(-6);
      const sparkline = buildSparklineSVG(cols.map(c => c.peso));
      const trend = cols.length >= 2 ? cols[cols.length - 1].peso - cols[cols.length - 2].peso : 0;
      const trendIcon = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
      const trendCls = trend > 0 ? 'up' : trend < 0 ? 'down' : '';

      return `
      <div class="progreso-exercise">
        <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-xs);">
          <div class="progreso-exercise-name" style="flex:1;">${e.ejercicio}</div>
          <span class="badge ${badge.cls}" style="font-size:9px;padding:1px 6px;">${badge.text}</span>
        </div>
        <div style="display:flex;align-items:baseline;gap:var(--space-sm);">
          <span class="progreso-weight">${e.lastWeight}</span>
          <span class="progreso-weight-unit">kg</span>
          ${e.consecutiveComplete >= 2
            ? `<span class="progreso-suggestion">↑ +${e.smartInc}kg sugerido</span>`
            : e.consecutiveComplete === 1
              ? `<span class="progreso-suggestion progreso-suggestion--progress">1/2 sesiones</span>`
              : ''}
        </div>
        ${cols.length > 1 ? `
        <div class="progreso-history">
          <div class="progreso-sparkline">${sparkline}</div>
          <div class="progreso-cols">
            ${cols.map(c => `
              <div class="progreso-col">
                <div class="progreso-col-date">${c.dateShort}</div>
                <div class="progreso-col-peso">${c.peso}</div>
              </div>
            `).join('')}
          </div>
          <div class="progreso-trend ${trendCls}">${trendIcon} ${Math.abs(trend)}kg</div>
        </div>` : ''}
        <div style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:var(--space-xs);">
          Último: ${e.lastDate || '—'}
        </div>
      </div>
    `}).join('');
  }

  // ── Helpers ─────────────────────────────────────────────────────────────
  function getSesionLugar(s) {
    if (s.lugar) return s.lugar;
    // Infer from rutina or name
    if (s.rutinaId) {
      const rutina = store.findById(store.KEYS.rutinas, s.rutinaId);
      if (rutina?.lugar) return rutina.lugar;
    }
    const name = (s.rutinaNombre || '').toUpperCase();
    if (name.includes('RÍO') || name.includes('RIO')) return 'RIO';
    if (name.includes('URUGUAY') || name.includes('🇺🇾')) return 'URUGUAY';
    return 'SPORT_FITNESS';
  }

  function buildExerciseHistory(sesiones) {
    const map = {}; // key: "ejercicio__lugar" → [{fecha, peso, dateShort}]
    const sorted = [...sesiones].sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''));

    for (const s of sorted) {
      const lugar = getSesionLugar(s);
      for (const c of (s.circuitos || [])) {
        for (const e of (c.ejercicios || [])) {
          const chalecoExtra = e.chaleco ? (e.chalecoPeso || 0) : 0;
          const done = (e.seriesData || []).filter(sr => sr.done && (sr.peso > 0 || chalecoExtra > 0));
          if (done.length === 0) continue;
          const maxPeso = Math.max(...done.map(sr => (sr.peso || 0) + chalecoExtra));
          const key = `${e.nombre}__${lugar}`;
          if (!map[key]) map[key] = [];
          // Avoid duplicate dates
          const last = map[key][map[key].length - 1];
          if (last && last.fecha === s.fecha) {
            last.peso = Math.max(last.peso, maxPeso);
          } else {
            const d = new Date(s.fecha + 'T00:00:00');
            map[key].push({
              fecha: s.fecha,
              peso: maxPeso,
              dateShort: `${d.getDate()}/${d.getMonth() + 1}`,
            });
          }
        }
      }
    }
    return map;
  }

  function buildSparklineSVG(values) {
    if (values.length < 2) return '';
    const w = 80, h = 24, pad = 2;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const points = values.map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - 2 * pad);
      const y = h - pad - ((v - min) / range) * (h - 2 * pad);
      return `${x},${y}`;
    }).join(' ');
    const last = values[values.length - 1];
    const prev = values[values.length - 2];
    const color = last > prev ? '#4ade80' : last < prev ? '#f87171' : 'var(--color-text-muted)';
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function calcFrequencyTrend(sesiones, currentMonday, daysElapsed) {
    const today = new Date();
    const d90 = new Date(today);
    d90.setDate(d90.getDate() - 90);
    const d90Str = formatDateISO(d90);
    const recent90 = sesiones.filter(s => s.fecha >= d90Str);
    const sessPerWeek90 = recent90.length / (90 / 7);

    const older = sesiones.filter(s => s.fecha < d90Str);
    let baseline = null;
    let arrow = '→';

    if (older.length > 0) {
      const sorted = [...older].sort((a, b) => a.fecha.localeCompare(b.fecha));
      const oldestD = new Date(sorted[0].fecha + 'T00:00:00');
      const histDays = Math.max(7, (d90 - oldestD) / (1000 * 60 * 60 * 24));
      baseline = older.length / (histDays / 7);
      const diff = sessPerWeek90 - baseline;
      arrow = diff > 0.3 ? '↑' : diff < -0.3 ? '↓' : '→';
    }

    const totalMin = recent90.reduce((s, sess) => s + (sess.duracion || 0), 0);
    const minPerSess = recent90.length > 0 ? Math.round(totalMin / recent90.length / 60) : 0;

    const weeklyData = [];
    for (let i = 11; i >= 0; i--) {
      const mon = new Date(currentMonday);
      mon.setDate(mon.getDate() - i * 7);
      const monStr = formatDateISO(mon);
      const sun = new Date(mon);
      sun.setDate(sun.getDate() + 7);
      const sunStr = formatDateISO(sun);
      const count = sesiones.filter(s => s.fecha >= monStr && s.fecha < sunStr).length;
      const isCurrent = i === 0;
      const projected = isCurrent ? Math.round(count * 7 / daysElapsed * 10) / 10 : count;
      weeklyData.push({ count: isCurrent ? projected : count, isProjected: isCurrent });
    }

    return { avg: sessPerWeek90, baseline, arrow, minPerSess, weeklyData };
  }

  function calcVolumePerSessionTrend(sesiones) {
    const today = new Date();
    const d90 = new Date(today);
    d90.setDate(d90.getDate() - 90);
    const d90Str = formatDateISO(d90);

    const recent = sesiones.filter(s => s.fecha >= d90Str);
    const older = sesiones.filter(s => s.fecha < d90Str);

    const recentVol = recent.reduce((s, sess) => s + calcSessionVolume(sess), 0);
    const avgRecent = recent.length > 0 ? recentVol / recent.length : 0;

    let pctChange = 0;
    let arrow = '→';

    if (older.length > 0) {
      const olderVol = older.reduce((s, sess) => s + calcSessionVolume(sess), 0);
      const baseline = olderVol / older.length;
      if (baseline > 0) {
        pctChange = Math.round(((avgRecent - baseline) / baseline) * 100);
        arrow = pctChange > 5 ? '↑' : pctChange < -5 ? '↓' : '→';
      }
    }

    return { avg: avgRecent, pctChange, arrow };
  }

  function calcConsistency(sesiones, currentMonday, numWeeks, threshold, daysElapsed) {
    const weeks = [];
    let met = 0;

    for (let i = numWeeks - 1; i >= 0; i--) {
      const mon = new Date(currentMonday);
      mon.setDate(mon.getDate() - i * 7);
      const monStr = formatDateISO(mon);
      const sun = new Date(mon);
      sun.setDate(sun.getDate() + 7);
      const sunStr = formatDateISO(sun);
      const count = sesiones.filter(s => s.fecha >= monStr && s.fecha < sunStr).length;
      const isCurrent = i === 0;
      const effective = isCurrent ? Math.round(count * 7 / daysElapsed) : count;
      if (effective >= threshold) met++;
      weeks.push({ count: effective, isProjected: isCurrent });
    }

    return { met, total: numWeeks, weeks };
  }

  function detectPRs(sesiones) {
    const history = buildExerciseHistory(sesiones);
    const prs = [];
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const cutoff = formatDateISO(twoWeeksAgo);

    for (const [key, entries] of Object.entries(history)) {
      if (entries.length < 2) continue;
      const [ejercicio] = key.split('__');
      const last = entries[entries.length - 1];
      if (last.fecha < cutoff) continue;
      const prevMax = Math.max(...entries.slice(0, -1).map(e => e.peso));
      if (last.peso > prevMax && prevMax > 0) {
        prs.push({ ejercicio, peso: last.peso, fecha: last.fecha });
      }
    }

    return prs.sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  function findMostImproved(sesiones, days) {
    const history = buildExerciseHistory(sesiones);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = formatDateISO(cutoff);
    let best = null;

    for (const [key, entries] of Object.entries(history)) {
      if (entries.length < 2) continue;
      const [ejercicio] = key.split('__');
      const recent = entries.filter(e => e.fecha >= cutoffStr);
      const older = entries.filter(e => e.fecha < cutoffStr);
      if (recent.length === 0 || older.length === 0) continue;

      const recentMax = Math.max(...recent.map(e => e.peso));
      const olderMax = Math.max(...older.map(e => e.peso));
      if (olderMax <= 0) continue;

      const diff = recentMax - olderMax;
      if (diff > 0 && (!best || diff > best.diff)) {
        best = { ejercicio, diff };
      }
    }

    return best;
  }

  function buildMiniBarsSVG(weeklyData) {
    const barW = 6, gap = 2, h = 24;
    const totalW = weeklyData.length * (barW + gap) - gap;
    const maxCount = Math.max(...weeklyData.map(d => d.count), 1);

    const bars = weeklyData.map((d, i) => {
      const x = i * (barW + gap);
      const barH = Math.max(2, Math.round((d.count / maxCount) * (h - 4)));
      const y = h - barH;
      const opacity = d.isProjected ? 0.35 : 1;
      return `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="1.5" fill="var(--color-accent)" opacity="${opacity}"/>`;
    }).join('');

    return `<svg width="${totalW}" height="${h}" viewBox="0 0 ${totalW} ${h}">${bars}</svg>`;
  }

  function buildDotStripSVG(weeks, threshold) {
    const r = 4, gap = 4, d = r * 2;
    const totalW = weeks.length * (d + gap) - gap;
    const h = d + 2;

    const dots = weeks.map((w, i) => {
      const cx = i * (d + gap) + r;
      const cy = r + 1;
      const op = w.isProjected ? ' opacity="0.35"' : '';
      if (w.count >= threshold) {
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--color-accent)"${op}/>`;
      } else if (w.count > 0) {
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--color-accent)" stroke-width="1.5"${op}/><circle cx="${cx}" cy="${cy}" r="2" fill="var(--color-accent)"${op}/>`;
      }
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--color-border)" stroke-width="1"/>`;
    }).join('');

    return `<svg width="${totalW}" height="${h}" viewBox="0 0 ${totalW} ${h}">${dots}</svg>`;
  }

  function buildHighlights(sesiones, streak) {
    const items = [];

    const prs = detectPRs(sesiones);
    if (prs.length > 0) {
      const pr = prs[0];
      items.push(`<div class="progreso-highlight-item"><i class="ph ph-trophy progreso-highlight-icon"></i><div><strong>Nuevo PR</strong> · ${pr.ejercicio} · ${pr.peso}kg</div></div>`);
    }

    const improved = findMostImproved(sesiones, 30);
    if (improved && !prs.find(p => p.ejercicio === improved.ejercicio)) {
      items.push(`<div class="progreso-highlight-item"><i class="ph ph-trend-up progreso-highlight-icon"></i><div><strong>Más progreso 30d</strong> · ${improved.ejercicio} · +${improved.diff}kg</div></div>`);
    }

    const totalVol = sesiones.reduce((s, sess) => s + calcSessionVolume(sess), 0);
    const milestones = [1000000, 500000, 100000, 50000];
    for (const m of milestones) {
      if (totalVol >= m) {
        items.push(`<div class="progreso-highlight-item"><i class="ph ph-barbell progreso-highlight-icon"></i><div><strong>${formatVol(m)} totales</strong> movidos</div></div>`);
        break;
      }
    }

    if (streak > 0 && (streak % 25 === 0 || streak % 10 === 0)) {
      items.push(`<div class="progreso-highlight-item"><i class="ph ph-fire progreso-highlight-icon"></i><div><strong>${streak} semanas</strong> de racha</div></div>`);
    }

    if (items.length === 0) return '';
    return items.slice(0, 2).join('');
  }

  function calcStreak(sesiones) {
    // Count consecutive weeks with at least 1 session
    const weekSet = new Set();
    for (const s of sesiones) {
      const d = new Date(s.fecha + 'T00:00:00');
      const mon = getMonday(d);
      weekSet.add(formatDateISO(mon));
    }
    const weeks = [...weekSet].sort().reverse();
    let streak = 0;
    const current = getMonday(new Date());
    const check = new Date(current);
    for (let i = 0; i < 52; i++) {
      if (weeks.includes(formatDateISO(check))) {
        streak++;
        check.setDate(check.getDate() - 7);
      } else {
        break;
      }
    }
    return streak;
  }

  function getMonday(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const dow = d.getDay();
    d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
    return d;
  }

  function calcSessionVolume(s) {
    return (s.circuitos || []).reduce((cs, c) =>
      cs + (c.ejercicios || []).reduce((es, e) => {
        const chalecoExtra = e.chaleco ? (e.chalecoPeso || 0) : 0;
        return es + (e.seriesData || []).filter(sr => sr.done).reduce((vs, sr) =>
          vs + (sr.reps || 0) * ((sr.peso || 0) + chalecoExtra), 0);
      }, 0), 0);
  }

  function calcWeeklyVolumes(sesiones, currentMonday, numWeeks) {
    const weeks = [];
    for (let i = numWeeks - 1; i >= 0; i--) {
      const mon = new Date(currentMonday);
      mon.setDate(mon.getDate() - i * 7);
      const monStr = formatDateISO(mon);
      const sun = new Date(mon);
      sun.setDate(sun.getDate() + 7);
      const sunStr = formatDateISO(sun);
      const weekSesiones = sesiones.filter(s => s.fecha >= monStr && s.fecha < sunStr);
      const vol = weekSesiones.reduce((sum, s) => sum + calcSessionVolume(s), 0);
      const d = mon.getDate();
      const m = mon.getMonth() + 1;
      weeks.push({ vol, label: `${d}/${m}`, isCurrent: i === 0 });
    }
    return weeks;
  }

  function buildVolumeBars(weeks, avgVol) {
    const maxVol = Math.max(...weeks.map(w => w.vol), 1);
    const avgH = avgVol > 0 ? Math.round((avgVol / maxVol) * 64) : 0;
    return `
      <div class="progreso-vol-bars">
        ${avgH > 0 ? `<div class="progreso-vol-avg" style="bottom:${avgH + 16}px;"></div>` : ''}
        ${weeks.map(w => {
          const h = w.vol > 0 ? Math.max(4, Math.round((w.vol / maxVol) * 64)) : 0;
          const cls = w.isCurrent ? 'current' : '';
          return `
            <div class="progreso-vol-bar-col">
              <div class="progreso-vol-bar ${cls}" style="height:${h}px;">
                <div class="progreso-vol-tooltip">${formatVol(w.vol)}</div>
              </div>
              <div class="progreso-vol-bar-label">${w.label}</div>
            </div>`;
        }).join('')}
      </div>
    `;
  }

  function formatVol(v) {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}t`;
    return `${Math.round(v)}kg`;
  }
}
