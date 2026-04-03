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

  const payload = { lastUpdated: Date.now() };
  for (const [key, field] of Object.entries(SYNC_KEYS)) {
    try {
      const raw = localStorage.getItem(key);
      payload[field] = raw ? JSON.parse(raw) : null;
    } catch {
      payload[field] = null;
    }
  }

  const user = getCurrentUser();
  if (user) {
    payload.profile = {
      nombre: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
    };
  }

  try {
    const { doc, setDoc } = await fs();
    await setDoc(doc(ref.db, 'users', ref.uid), payload, { merge: true });
    console.log('[sync] uploaded all data');
  } catch (err) {
    console.warn('[sync] upload all error:', err.message);
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
    if (!snap.exists()) return false;

    const data = snap.data();
    _suppressSync = true;

    for (const [key, field] of Object.entries(SYNC_KEYS)) {
      if (_dirtyKeys.has(key)) continue;
      if (data[field] === undefined || data[field] === null) continue;

      if (MERGEABLE_KEYS.has(key) && Array.isArray(data[field])) {
        const localRaw = localStorage.getItem(key);
        const localArr = localRaw ? JSON.parse(localRaw) : [];
        const merged = mergeArraysById(localArr, data[field], key);
        localStorage.setItem(key, JSON.stringify(merged));
      } else {
        localStorage.setItem(key, JSON.stringify(data[field]));
      }
    }

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
  _timers[key] = setTimeout(() => {
    _setSyncStatus('syncing');
    uploadKey(key).then(() => {
      if (_dirtyKeys.size === 0) _setSyncStatus('synced');
    });
  }, DEBOUNCE_MS);
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
  keys.forEach(key => uploadKey(key));
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushOnExit);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushOnExit();
  });
}
