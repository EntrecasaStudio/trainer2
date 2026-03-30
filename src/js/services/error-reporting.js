// Sentry error reporting — lazy loaded
let sentryInitialized = false;

export async function initSentry(dsn) {
  if (sentryInitialized || !dsn) return;

  try {
    // Will be configured when Sentry DSN is available
    console.log('[Sentry] Would init with DSN:', dsn);
    sentryInitialized = true;
  } catch (e) {
    console.warn('[Sentry] Init failed', e);
  }
}

export function captureError(error, context = {}) {
  console.error('[Error]', error, context);
  // Will forward to Sentry when initialized
}
