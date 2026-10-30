const REDACTED = '[REDACTED]';

export function sanitizeError(error, context = {}) {
  const message = String(error?.message || error || 'Unknown error').slice(0, 1000);
  const stack = String(error?.stack || '').slice(0, 8000);
  const safeContext = {};
  for (const key of ['stage', 'event', 'mediaType', 'device', 'browser', 'sdkVersion']) {
    if (context[key] !== undefined && context[key] !== null) {
      safeContext[key] = String(context[key]).slice(0, 200);
    }
  }
  return { message, stack, context: safeContext };
}

export function createTelemetryReporter({ send, sampleRate = 1, clock = () => new Date().toISOString() }) {
  if (typeof send !== 'function') throw new TypeError('send must be a function');
  return async function report(error, context = {}) {
    if (Math.random() > Math.max(0, Math.min(1, sampleRate))) return { sent: false, sampledOut: true };
    const payload = { timestamp: clock(), ...sanitizeError(error, context) };
    await send(payload);
    return { sent: true, payload };
  };
}

export { REDACTED };
