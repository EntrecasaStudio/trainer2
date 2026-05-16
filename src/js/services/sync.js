/**
 * Sync service — bidirectional localStorage ↔ Firestore.
 * Offline-first: localStorage is the local source of truth.
 * Firestore syncs in background when online.
 *
 * Array fields (rutinas, sesiones) use item-level merge by ID.
 */
import { getDb, getCurrentUser } from './firebase.js';

const CDN = 'https://www.gstatic.com/firebasejs/10.8.0';
let _firestoreMod = null;

async function fs() {
  if (!_firestoreMod) {
    _firestoreMod = await import(`${CDN}/firebase-firestore.js`);
  }
  return _firestoreMod;
}

// Keys to sync (localStorage key → Firestore field name)
const SYNC_KEYS = {
  gym_rutinas: 'rutinas',
  gym_sesiones: 'sesiones',
  gym_day_overrides: 'dayOverrides',
  gym_ejercicio_progresion: 'ejercicioProgresion',
  gym_ejercicios_custom: 'ejerciciosCustom',
  gym_theme: 'theme',
};

// Keys that are arrays of items with `id` field — use item-level merge
const MERGEABLE_KEYS = new Set(['gym_rutinas', 'gym_sesiones']);

const _timers = {};
const DEBOUNCE_MS = 2000;
let _unsubscribe = null;
let _suppressSync = false;
const _dirtyKeys = new Set();

// ── Sync status ──────────────────────────
let _syncStatus = (typeof navigator !== 'undefined' && navigator.onLine) ? 'synced' : 'offline';
const _statusListeners = new Set();

export function getSyncStatus() { return _syncStatus; }

export function onSyncStatusChange(fn) {
  _statusListeners.add(fn);
  return () => _statusListeners.delete(fn);
}

function _setSyncStatus(status) {
  if (status === _syncStatus) return;
  _syncStatus = status;
  for (const fn of _statusListeners) try { fn(status); } catch {}
}

// Online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    _setSyncStatus('syncing');
    _flushOfflineQueue().then(() => {
      _setSyncStatus(_dirtyKeys.size > 0 ? 'pending' : 'synced');
    });
  });
  window.addEventListener('offline', () => _setSyncStatus('offline'));
}

async function _flushOfflineQueue() {
  if (!navigator.onLine) return;
  const keys = [..._dirtyKeys];
  if (keys.length === 0) return;
  for (const key of Object.keys(_timers)) {
    clearTimeout(_timers[key]);
    delete _timers[key];
  }
  await Promise.all(keys.map(key => uploadKey(key)));
}

// ── Upload ──────────────────────────────

function getDocRef() {
  const user = getCurrentUser();
  const db = getDb();
  if (!user || !db) return null;
  return { db, uid: user.uid };
}

async function uploadKey(key) {
  const ref = getDocRef();
  if (!ref) return;
  const field = SYNC_KEYS[key];
  if (!field) return;

  try {
    const { doc, setDoc } = await fs();
    const raw = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : null;
    await setDoc(doc(ref.db, 'users', ref.uid), { [field]: data, lastUpdated: Date.now() }, { merge: true });
  } catch (err) {
    console.warn('[sync] upload error:', key, err.message);
  } finally {
    _dirtyKeys.delete(key);
  }
}

export async function uploadAllData() {
  const ref = getDocRef();
  if (!ref) return;

  const { doc, setDoc } = await fs();
  const user = getCurrentUser();

  // Upload each key in its own setDoc so one oversized field doesn't block
  // the others. Log per-key results so sync issues are visible in the console.
  for (const [key, field] of Object.entries(SYNC_KEYS)) {
    try {
      const raw = localStorage.getItem(key);
      const data = raw ? JSON.parse(raw) : null;
      const size = raw ? raw.length : 0;
      await setDoc(doc(ref.db, 'users', ref.uid), { [field]: data, lastUpdated: Date.now() }, { merge: true });
      console.log(`[sync] uploaded ${key}: ${Array.isArray(data) ? data.length + ' items' : 'obj'} (~${Math.round(size / 1024)}KB)`);
    } catch (err) {
      console.warn(`[sync] upload error for ${key}:`, err.message);
    }
  }

  if (user) {
    try {
      await setDoc(doc(ref.db, 'users', ref.uid), {
        profile: {
          nombre: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
        },
      }, { merge: true });
    } catch {}
  }
}

// ── Item-level merge for arrays ─────────

function mergeArraysById(localArr, remoteArr, key) {
  if (!Array.isArray(localArr) || !Array.isArray(remoteArr)) return remoteArr;

  const localMap = new Map(localArr.map(item => [item.id, item]));
  const remoteMap = new Map(remoteArr.map(item => [item.id, item]));
  const merged = new Map();

  for (const [id, item] of remoteMap) merged.set(id, item);

  for (const [id, localItem] of localMap) {
    const remoteItem = remoteMap.get(id);
    if (!remoteItem) {
      merged.set(id, localItem);
    } else {
      const localTs = localItem.updatedAt || localItem.deletedAt || localItem.creada || '';
      const remoteTs = remoteItem.updatedAt || remoteItem.deletedAt || remoteItem.creada || '';
      if (localTs > remoteTs) merged.set(id, localItem);
    }
  }

  let result = [...merged.values()];

  // Deduplicate rutinas by nombre+usuario+lugar (seed creates new IDs each version)
  if (key === 'gym_rutinas') {
    const groups = new Map();
    for (const r of result) {
      const dedupKey = `${r.nombre}__${r.usuario}__${r.lugar}`;
      const group = groups.get(dedupKey);
      if (!group) {
        groups.set(dedupKey, { winner: r, loserIds: [] });
      } else {
        const existTs = group.winner.updatedAt || '';
        const curTs = r.updatedAt || '';
        if (curTs > existTs) {
          group.loserIds.push(group.winner.id);
          group.winner = r;
        } else {
          group.loserIds.push(r.id);
        }
      }
    }
    // Remap overrides for any removed duplicate IDs
    const idRemap = new Map();
    for (const { winner, loserIds } of groups.values()) {
      for (const lid of loserIds) idRemap.set(lid, winner.id);
    }
    if (idRemap.size > 0) {
      try {
        const ovRaw = localStorage.getItem('gym_day_overrides');
        const overrides = ovRaw ? JSON.parse(ovRaw) : {};
        let changed = false;
        for (const usuario of Object.keys(overrides)) {
          for (const date of Object.keys(overrides[usuario])) {
            const oldId = overrides[usuario][date].rutinaId;
            if (idRemap.has(oldId)) {
              overrides[usuario][date].rutinaId = idRemap.get(oldId);
              changed = true;
            }
          }
        }
        if (changed) localStorage.setItem('gym_day_overrides', JSON.stringify(overrides));
      } catch {}
    }
    result = [...groups.values()].map(g => g.winner);
  }

  return result;
}

// ── Post-sync repair ────────────────────
// After downloading remote data, overrides and sesiones may reference rutinaIds
// that don't exist locally (e.g. remote rutinas lost dedup but overrides came
// from remote with old IDs). Remap stale IDs to matching local rutinas.
function repairStaleReferences() {
  try {
    const rutinasRaw = localStorage.getItem('gym_rutinas');
    const rutinas = rutinasRaw ? JSON.parse(rutinasRaw) : [];
    if (!Array.isArray(rutinas) || rutinas.length === 0) return;
    const rutinaById = new Map(rutinas.map(r => [r.id, r]));

    // Repair overrides
    const ovRaw = localStorage.getItem('gym_day_overrides');
    if (ovRaw) {
      const overrides = JSON.parse(ovRaw);
      let repaired = false;
      for (const usuario of Object.keys(overrides || {})) {
        const userOv = overrides[usuario];
        for (const date of Object.keys(userOv || {})) {
          const ov = userOv[date];
          if (!ov?.rutinaId) continue;
          if (rutinaById.has(ov.rutinaId)) continue;
          const lugar = ov.lugar || 'SPORT_FITNESS';
          const tipo = ov.tipo;
          const match = rutinas.find(r =>
            r.usuario === usuario && r.lugar === lugar && r.foco === tipo
          );
          if (match) { ov.rutinaId = match.id; repaired = true; }
          else { delete userOv[date]; repaired = true; }
        }
      }
      if (repaired) {
        localStorage.setItem('gym_day_overrides', JSON.stringify(overrides));
        console.log('[sync] repaired stale override rutinaIds');
      }
    }

    // Repair sesiones (match by rutinaNombre + usuario + lugar)
    const sesRaw = localStorage.getItem('gym_sesiones');
    if (sesRaw) {
      const sesiones = JSON.parse(sesRaw);
      let repaired = false;
      for (const s of sesiones || []) {
        if (!s.rutinaId || rutinaById.has(s.rutinaId)) continue;
        const match = rutinas.find(r =>
          r.usuario === s.usuario &&
          r.lugar === (s.lugar || 'SPORT_FITNESS') &&
          (r.nombre === s.rutinaNombre || r.foco === s.foco)
        );
        if (match) { s.rutinaId = match.id; repaired = true; }
      }
      if (repaired) {
        localStorage.setItem('gym_sesiones', JSON.stringify(sesiones));
        console.log('[sync] repaired stale sesion rutinaIds');
      }
    }
  } catch (err) {
    console.warn('[sync] repair error:', err.message);
  }
}

// ── Download ────────────────────────────

async function flushPendingSyncs() {
  const keys = [..._dirtyKeys];
  if (keys.length === 0) return;
  for (const key of Object.keys(_timers)) {
    clearTimeout(_timers[key]);
    delete _timers[key];
  }
  await Promise.all(keys.map(key => uploadKey(key)));
}

export async function downloadAllData() {
  await flushPendingSyncs();

  const ref = getDocRef();
  if (!ref) return false;

  try {
    const { doc, getDoc } = await fs();
    const snap = await getDoc(doc(ref.db, 'users', ref.uid));
    if (!snap.exists()) {
      console.log('[sync] no remote doc exists yet');
      return false;
    }

    const data = snap.data();
    _suppressSync = true;

    for (const [key, field] of Object.entries(SYNC_KEYS)) {
      try {
        if (_dirtyKeys.has(key)) continue;
        if (data[field] === undefined || data[field] === null) {
          console.log(`[sync] skip ${key}: no remote data`);
          continue;
        }

        if (MERGEABLE_KEYS.has(key) && Array.isArray(data[field])) {
          const localRaw = localStorage.getItem(key);
          const localArr = localRaw ? JSON.parse(localRaw) : [];
          const merged = mergeArraysById(localArr, data[field], key);
          localStorage.setItem(key, JSON.stringify(merged));
          console.log(`[sync] merged ${key}: local ${localArr.length} + remote ${data[field].length} → ${merged.length}`);
        } else {
          localStorage.setItem(key, JSON.stringify(data[field]));
          console.log(`[sync] wrote ${key}`);
        }
      } catch (keyErr) {
        console.warn(`[sync] error processing ${key}:`, keyErr.message);
      }
    }

    repairStaleReferences();

    _suppressSync = false;
    console.log('[sync] downloaded all data');
    return true;
  } catch (err) {
    _suppressSync = false;
    console.warn('[sync] download error:', err.message);
    return false;
  }
}

// ── Real-time listener ──────────────────

export async function startRealtimeSync(onUpdate) {
  stopRealtimeSync();

  const ref = getDocRef();
  if (!ref) return;

  const { doc, onSnapshot } = await fs();

  _unsubscribe = onSnapshot(doc(ref.db, 'users', ref.uid), (snap) => {
    if (!snap.exists()) return;

    const data = snap.data();
    _suppressSync = true;

    let changed = false;
    for (const [key, field] of Object.entries(SYNC_KEYS)) {
      if (data[field] === undefined || data[field] === null) continue;
      if (_dirtyKeys.has(key)) continue;

      if (MERGEABLE_KEYS.has(key) && Array.isArray(data[field])) {
        const localRaw = localStorage.getItem(key);
        const localArr = localRaw ? JSON.parse(localRaw) : [];
        const merged = mergeArraysById(localArr, data[field], key);
        const mergedJSON = JSON.stringify(merged);
        if (mergedJSON !== localRaw) {
          localStorage.setItem(key, mergedJSON);
          changed = true;
        }
      } else {
        const remoteJSON = JSON.stringify(data[field]);
        const localJSON = localStorage.getItem(key);
        if (remoteJSON !== localJSON) {
          localStorage.setItem(key, remoteJSON);
          changed = true;
        }
      }
    }

    if (changed) repairStaleReferences();

    _suppressSync = false;
    if (changed && onUpdate) onUpdate();
  }, (err) => {
    console.warn('[sync] realtime error:', err.message);
  });
}

export function stopRealtimeSync() {
  if (_unsubscribe) {
    _unsubscribe();
    _unsubscribe = null;
  }
}

export function clearSyncState() {
  for (const key of Object.keys(_timers)) {
    clearTimeout(_timers[key]);
    delete _timers[key];
  }
  _dirtyKeys.clear();
  _suppressSync = false;
}

// ── Debounced sync trigger ──────────────

// Critical keys sync immediately (no debounce) to avoid data loss
const IMMEDIATE_SYNC = new Set(['gym_sesiones', 'gym_ejercicio_progresion']);

export function queueSync(key) {
  if (_suppressSync) return;
  if (!SYNC_KEYS[key]) return;
  if (!getCurrentUser()) return;

  _dirtyKeys.add(key);

  if (!navigator.onLine) {
    _setSyncStatus('offline');
    return;
  }

  _setSyncStatus('pending');
  clearTimeout(_timers[key]);

  if (IMMEDIATE_SYNC.has(key)) {
    // Sync immediately for critical data
    _setSyncStatus('syncing');
    uploadKey(key).then(() => {
      if (_dirtyKeys.size === 0) _setSyncStatus('synced');
    });
  } else {
    _timers[key] = setTimeout(() => {
      _setSyncStatus('syncing');
      uploadKey(key).then(() => {
        if (_dirtyKeys.size === 0) _setSyncStatus('synced');
      });
    }, DEBOUNCE_MS);
  }
}

export function isSyncAvailable() {
  return !!getCurrentUser();
}

// ── Flush on page unload ────────────────
function flushOnExit() {
  const keys = [..._dirtyKeys];
  if (keys.length === 0) return;
  for (const key of Object.keys(_timers)) {
    clearTimeout(_timers[key]);
    delete _timers[key];
  }
  // Try sendBeacon for reliability on page close
  const ref = getDocRef();
  if (ref && navigator.sendBeacon) {
    // Fall back to async upload — sendBeacon can't do Firestore directly
    keys.forEach(key => uploadKey(key));
  } else {
    keys.forEach(key => uploadKey(key));
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushOnExit);
  window.addEventListener('pagehide', flushOnExit);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushOnExit();
    } else if (document.visibilityState === 'visible') {
      resyncOnResume();
    }
  });
}

let _onResumeCallback = null;
export function setOnResumeCallback(fn) { _onResumeCallback = fn; }

async function resyncOnResume() {
  if (!getCurrentUser()) return;
  if (!navigator.onLine) return;
  try {
    await downloadAllData();
    if (_onResumeCallback) _onResumeCallback();
  } catch (e) {
    console.warn('[sync] resync on resume failed:', e.message);
  }
}
