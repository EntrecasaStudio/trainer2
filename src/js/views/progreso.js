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
    const mondayStr = formatDateISO(monday);

    // This week
    const thisWeek = sesiones.filter(s => s.fecha >= mondayStr);
    const totalMin = Math.round(thisWeek.reduce((sum, s) => sum + (s.duracion || 0), 0) / 60);

    // Last week for comparison
    const lastMonday = new Date(monday);
    lastMonday.setDate(lastMonday.getDate() - 7);
    const lastMondayStr = formatDateISO(lastMonday);
    const lastWeek = sesiones.filter(s => s.fecha >= lastMondayStr && s.fecha < mondayStr);
    const lastWeekSessions = lastWeek.length;
    const lastWeekMin = Math.round(lastWeek.reduce((sum, s) => sum + (s.duracion || 0), 0) / 60);

    // Streak
    const streak = calcStreak(sesiones);

    const sessionsDiff = thisWeek.length - lastWeekSessions;
    const minDiff = totalMin - lastWeekMin;

    // Volume trend — last 8 weeks as bars + month comparison
    const weeklyVolumes = calcWeeklyVolumes(sesiones, monday, 8);
    const thisMonthVol = weeklyVolumes.slice(-4).reduce((s, w) => s + w.vol, 0);
    const lastMonthVol = weeklyVolumes.slice(0, 4).reduce((s, w) => s + w.vol, 0);
    const volPctChange = lastMonthVol > 0 ? Math.round(((thisMonthVol - lastMonthVol) / lastMonthVol) * 100) : 0;
    const volBarsHTML = buildVolumeBars(weeklyVolumes);

    // Muscle group distribution (last 4 weeks)
    const fourWeeksAgo = new Date(monday);
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const fourWeeksStr = formatDateISO(fourWeeksAgo);
    const recentSesiones = sesiones.filter(s => s.fecha >= fourWeeksStr);
    const muscleData = buildMuscleDistribution(recentSesiones);

    el.innerHTML = `
      <div class="progreso-dashboard">
        <div class="progreso-stat-grid">
          <div class="progreso-stat-card">
            <div class="progreso-stat-value">${thisWeek.length}</div>
            <div class="progreso-stat-label">Sesiones</div>
            ${sessionsDiff !== 0 ? `<div class="progreso-stat-diff ${sessionsDiff > 0 ? 'up' : 'down'}">${sessionsDiff > 0 ? '+' : ''}${sessionsDiff} vs sem. ant.</div>` : ''}
          </div>
          <div class="progreso-stat-card">
            <div class="progreso-stat-value">${totalMin}</div>
            <div class="progreso-stat-label">Minutos</div>
            ${minDiff !== 0 ? `<div class="progreso-stat-diff ${minDiff > 0 ? 'up' : 'down'}">${minDiff > 0 ? '+' : ''}${minDiff} min</div>` : ''}
          </div>
          <div class="progreso-stat-card">
            <div class="progreso-stat-value">${formatVol(thisMonthVol)}</div>
            <div class="progreso-stat-label">Volumen</div>
            ${volPctChange !== 0 ? `<div class="progreso-stat-diff ${volPctChange > 0 ? 'up' : 'down'}">${volPctChange > 0 ? '+' : ''}${volPctChange}% vs mes ant.</div>` : ''}
          </div>
          <div class="progreso-stat-card">
            <div class="progreso-stat-value">${streak}</div>
            <div class="progreso-stat-label">Racha sem.</div>
          </div>
        </div>
        ${weeklyVolumes.some(w => w.vol > 0) ? `
        <div class="progreso-vol-trend">
          <div class="progreso-vol-title">Tendencia de volumen · 8 semanas</div>
          ${volBarsHTML}
        </div>` : ''}
        ${muscleData.length > 0 ? `
        <div class="progreso-muscle-chart">
          <div class="progreso-muscle-title">Distribución muscular · últimas 4 semanas</div>
          <div class="progreso-muscle-ring">${buildRingSVG(muscleData)}</div>
          <div class="progreso-muscle-bars">
            ${muscleData.map(m => `
              <div class="progreso-muscle-row">
                <div class="progreso-muscle-dot" style="background:${m.color};"></div>
                <div class="progreso-muscle-name">${m.grupo}</div>
                <div class="progreso-muscle-bar-wrap">
                  <div class="progreso-muscle-bar" style="width:${m.pct}%;background:${m.color};"></div>
                </div>
                <div class="progreso-muscle-pct">${m.pct}%</div>
              </div>
            `).join('')}
          </div>
        </div>` : ''}
      </div>
    `;
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
    for (const s of sesiones) {
      for (const c of (s.circuitos || [])) {
        for (const e of (c.ejercicios || [])) {
          const doneSeries = (e.seriesData || []).filter(sr => sr.done).length;
          if (doneSeries === 0) continue;
          const cat = EJERCICIOS_CATALOGO.find(ce => ce.nombre === e.nombre);
          const grupo = cat?.grupo || inferGrupoFromCircuit(c.nombre);
          if (!grupo || grupo === 'HIIT') continue;
          counts[grupo] = (counts[grupo] || 0) + doneSeries;
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

    return Object.entries(counts)
      .map(([grupo, count]) => ({
        grupo,
        count,
        pct: Math.round((count / total) * 100),
        color: COLORS[grupo] || '#94a3b8',
      }))
      .sort((a, b) => b.count - a.count);
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

  function buildVolumeBars(weeks) {
    const maxVol = Math.max(...weeks.map(w => w.vol), 1);
    return `
      <div class="progreso-vol-bars">
        ${weeks.map(w => {
          const h = Math.max(4, Math.round((w.vol / maxVol) * 64));
          const cls = w.isCurrent ? 'current' : '';
          return `
            <div class="progreso-vol-bar-col">
              <div class="progreso-vol-bar ${cls}" style="height:${h}px;"></div>
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
