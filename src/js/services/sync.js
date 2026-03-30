// Firestore sync — runs in background, never blocks reads
import { store } from '../../store.js';
import { getDb } from './firebase.js';

let syncStatus = 'offline'; // 'synced' | 'offline' | 'syncing'
let onStatusChange = null;

export function getSyncStatus() { return syncStatus; }

export function onSyncStatusChange(fn) { onStatusChange = fn; }

function setSyncStatus(status) {
  syncStatus = status;
  if (onStatusChange) onStatusChange(status);
}

export async function syncToFirestore() {
  const db = getDb();
  if (!db) {
    setSyncStatus('offline');
    return;
  }

  setSyncStatus('syncing');

  try {
    // Sync pending sesiones
    const pendingSesiones = store.getPendingSync(store.KEYS.sesiones);
    for (const sesion of pendingSesiones) {
      try {
        const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
        await setDoc(doc(db, 'sesiones', sesion.id), sesion);
        store.clearPendingSync(store.KEYS.sesiones, sesion.id);
      } catch (e) {
        console.warn('[Sync] Failed to sync sesion', sesion.id, e);
      }
    }

    setSyncStatus('synced');
  } catch (e) {
    console.warn('[Sync] Error', e);
    setSyncStatus('offline');
  }
}

// Auto-sync when online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => syncToFirestore());
  window.addEventListener('offline', () => setSyncStatus('offline'));
}
