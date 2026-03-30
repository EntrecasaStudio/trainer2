// Firebase initialization — lazy loaded
// Will be configured when Firebase project is set up

let firebaseApp = null;
let db = null;
let auth = null;

export async function initFirebase(config) {
  if (firebaseApp) return { db, auth };

  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
    const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
    const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');

    firebaseApp = initializeApp(config);
    db = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);

    console.log('[Firebase] Initialized');
    return { db, auth };
  } catch (e) {
    console.warn('[Firebase] Init failed, running offline-only', e);
    return { db: null, auth: null };
  }
}

export function getDb() { return db; }
export function getAuth() { return auth; }
