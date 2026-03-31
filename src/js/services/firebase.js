// Firebase initialization — CDN imports (no bundler)

let app = null;
let _auth = null;
let _db = null;
let _googleProvider = null;
let _isConfigured = false;
let _authHelpers = null;

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyC72hE9OkVdmnt5TuhtNamrfq8DY3bdIlM',
  authDomain: 'entrecasa-treiner.firebaseapp.com',
  projectId: 'entrecasa-treiner',
  storageBucket: 'entrecasa-treiner.firebasestorage.app',
  messagingSenderId: '398542503159',
  appId: '1:398542503159:web:408be61789b3e3938027f2',
};

const CDN = 'https://www.gstatic.com/firebasejs/10.8.0';

export async function initFirebase() {
  if (app) return _isConfigured;

  try {
    const { initializeApp } = await import(`${CDN}/firebase-app.js`);
    const authMod = await import(`${CDN}/firebase-auth.js`);
    const { getFirestore } = await import(`${CDN}/firebase-firestore.js`);

    app = initializeApp(FIREBASE_CONFIG);
    _auth = authMod.getAuth(app);
    _db = getFirestore(app);
    _googleProvider = new authMod.GoogleAuthProvider();
    _isConfigured = true;

    _authHelpers = authMod;

    // Check for redirect result (from signInWithRedirect) — timeout after 3s
    try {
      await Promise.race([
        authMod.getRedirectResult(_auth),
        new Promise(resolve => setTimeout(resolve, 3000)),
      ]);
    } catch (e) {
      // Ignore — only matters if redirect login was in progress
    }

    console.log('[Firebase] Initialized');
    return true;
  } catch (e) {
    console.warn('[Firebase] Init failed, running offline-only', e);
    return false;
  }
}

export function getDb() { return _db; }
export function getFirebaseAuth() { return _auth; }
export function isConfigured() { return _isConfigured; }

export function getCurrentUser() {
  return _auth?.currentUser || null;
}

export async function loginWithGoogle() {
  if (!_auth || !_googleProvider || !_authHelpers) {
    throw new Error('Firebase not configured');
  }
  _googleProvider.setCustomParameters({ prompt: 'select_account' });

  // Try popup first, fall back to redirect (for mobile PWA / iframe)
  try {
    return await _authHelpers.signInWithPopup(_auth, _googleProvider);
  } catch (e) {
    if (e.code === 'auth/popup-blocked' || e.code === 'auth/popup-closed-by-user') {
      console.log('[Auth] Popup blocked, falling back to redirect');
      return _authHelpers.signInWithRedirect(_auth, _googleProvider);
    }
    throw e;
  }
}

export async function logout() {
  if (!_auth || !_authHelpers) return;
  return _authHelpers.signOut(_auth);
}

export function onAuth(callback) {
  if (!_auth || !_authHelpers) {
    setTimeout(() => callback(null), 0);
    return () => {};
  }
  return _authHelpers.onAuthStateChanged(_auth, callback);
}
