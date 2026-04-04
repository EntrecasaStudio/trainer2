import { store } from '../../store.js';
import { formatDateISO } from '../../utils/calendar.js';
import { getLugarBadge } from '../../utils/format.js';

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
    const totalKcal = thisWeek.reduce((sum, s) => sum + (s.calorias || 0), 0);
    const totalVol = thisWeek.reduce((sum, s) => {
      return sum + (s.circuitos || []).reduce((cs, c) =>
        cs + (c.ejercicios || []).reduce((es, e) =>
          es + (e.seriesData || []).filter(sr => sr.done).reduce((vs, sr) => vs + (sr.reps || 0) * (sr.peso || 0), 0), 0), 0);
    }, 0);

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

    el.innerHTML = `
      <div class="progreso-dashboard">
        <div class="progreso-stat-grid">
          <div class="progreso-stat-card">
            <div class="progreso-stat-value">${thisWeek.length}</div>
            <div class="progreso-stat-label">Sesiones</div>
            ${sessionsDiff !== 0 ? `<div class="progreso-stat-diff ${sessionsDiff > 0 ? 'up' : 'down'}">${sessionsDiff > 0 ? '+' : ''}${sessionsDiff} vs semana ant.</div>` : ''}
          </div>
          <div class="progreso-stat-card">
            <div class="progreso-stat-value">${totalMin}</div>
            <div class="progreso-stat-label">Minutos</div>
            ${minDiff !== 0 ? `<div class="progreso-stat-diff ${minDiff > 0 ? 'up' : 'down'}">${minDiff > 0 ? '+' : ''}${minDiff} min</div>` : ''}
          </div>
          <div class="progreso-stat-card">
            <div class="progreso-stat-value">${totalKcal > 0 ? totalKcal : '—'}</div>
            <div class="progreso-stat-label">kcal</div>
          </div>
          <div class="progreso-stat-card">
            <div class="progreso-stat-value">${streak}</div>
            <div class="progreso-stat-label">Racha sem.</div>
          </div>
        </div>
        ${totalVol > 0 ? `<div class="progreso-vol">Volumen semanal: <strong>${formatVol(totalVol)}</strong></div>` : ''}
      </div>
    `;
  }

  // ── Per-exercise progression ────────────────────────────────────────────
  function renderList() {
    const listEl = document.getElementById('progreso-list');
    const sesiones = store.getAll(store.KEYS.sesiones).filter(s => s.usuario === currentUser && s.fecha);
    const progresion = store.getObj(store.KEYS.progresion);
    const q = _searchQuery;

    // Build exercise history from sesiones
    const exerciseHistory = buildExerciseHistory(sesiones);

    // Build entries from progresion
    const entries = [];
    for (const [ejercicio, users] of Object.entries(progresion)) {
      const userData = users[currentUser];
      if (!userData) continue;
      if (q && !ejercicio.toLowerCase().includes(q)) continue;

      // New format: userData is { SPORT_FITNESS: {...}, RIO: {...} }
      // Old format: userData is { lastWeight, lastDate, ... }
      const isOldFormat = userData.lastWeight !== undefined;
      const lugares = isOldFormat ? { SPORT_FITNESS: userData } : userData;

      for (const [lugar, data] of Object.entries(lugares)) {
        if (!data.lastWeight) continue;
        const history = exerciseHistory[`${ejercicio}__${lugar}`] || exerciseHistory[`${ejercicio}__`] || [];
        entries.push({ ejercicio, lugar, history, ...data });
      }
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
          ${e.completedAllReps ? `<span class="progreso-suggestion">↑ +2.5kg sugerido</span>` : ''}
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
  function buildExerciseHistory(sesiones) {
    const map = {}; // key: "ejercicio__lugar" → [{fecha, peso, dateShort}]
    const sorted = [...sesiones].sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''));

    for (const s of sorted) {
      const lugar = s.lugar || 'SPORT_FITNESS';
      for (const c of (s.circuitos || [])) {
        for (const e of (c.ejercicios || [])) {
          const done = (e.seriesData || []).filter(sr => sr.done && sr.peso > 0);
          if (done.length === 0) continue;
          const maxPeso = Math.max(...done.map(sr => sr.peso));
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

  function formatVol(v) {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}t`;
    return `${Math.round(v)}kg`;
  }
}
