import test from 'node:test';
import assert from 'node:assert/strict';
import { MediaLifecycle, MEDIA_STAGES } from '../src/mediaLifecycle.js';
import { inspectVideoTrack } from '../src/orientationDiagnostics.js';
import { subscribeRemoteTrack } from '../src/remoteTrackRecovery.js';
import { sanitizeError } from '../src/telemetry.js';

test('marks lifecycle stages with timestamps', () => {
  const events = [];
  const lifecycle = new MediaLifecycle({ onStage: event => events.push(event) });
  lifecycle.mark(MEDIA_STAGES.JOIN_SUCCEEDED);
  assert.equal(events[0].stage, 'join_succeeded');
  assert.match(events[0].timestamp, /^20/);
});

test('retries remote subscription and succeeds', async () => {
  let attempts = 0;
  const result = await subscribeRemoteTrack({
    subscribe: async () => {
      attempts += 1;
      if (attempts < 2) throw new Error('temporary failure');
    }
  }, { uid: 'demo-user' }, 'video', { maxAttempts: 3, delayMs: 0 });
  assert.equal(result.ok, true);
  assert.equal(result.attempt, 2);
});

test('returns a bounded failure result', async () => {
  const result = await subscribeRemoteTrack({ subscribe: async () => { throw new Error('failed'); } }, { uid: 'demo-user' }, 'audio', { maxAttempts: 2, delayMs: 0 });
  assert.equal(result.ok, false);
  assert.equal(result.attempts, 2);
});

test('normalizes video track settings', () => {
  const result = inspectVideoTrack({ getSettings: () => ({ width: 1920, height: 1080, facingMode: 'user', deviceId: 'synthetic-device-id' }) });
  assert.deepEqual(result, { ok: true, width: 1920, height: 1080, aspectRatio: 1.7778, facingMode: 'user', deviceIdPresent: true, displaySurface: null, orientationHint: 'landscape' });
});

test('sanitizes error payloads to portable fields', () => {
  const result = sanitizeError(new Error('bad'), { stage: 'remote_media', email: 'do-not-copy@example.com' });
  assert.equal(result.context.stage, 'remote_media');
  assert.equal(result.context.email, undefined);
});

test('correlates only events belonging to active confirmed sessions', async () => {
  const { classifyDevice, classifyBrowser, correlateActiveSessions } = await import('../src/sessionMonitor.js');
  assert.equal(classifyDevice('Mozilla/5.0 (iPhone)'), 'iPhone');
  assert.equal(classifyBrowser('Mozilla/5.0 Chrome/156.0 Safari/537.36'), 'Chrome');
  const result = correlateActiveSessions({
    now: 1000,
    schedule: [
      { sessionId: 'opaque-1', status: 'CONFIRMED', startMs: 0, endMs: 2000 },
      { sessionId: 'opaque-2', status: 'CANCELLED', startMs: 0, endMs: 2000 }
    ],
    events: [
      { sessionId: 'opaque-1', type: 'session_page', timestampMs: 900, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari/605.1' },
      { sessionId: 'opaque-2', type: 'session_page', timestampMs: 900, userAgent: 'Mozilla/5.0 (Windows NT 10.0) Chrome/156.0' }
    ]
  });
  assert.deepEqual(result, [{ sessionId: 'opaque-1', type: 'session_page', device: 'Mac', browser: 'Safari', lastSeenMs: 900 }]);
});
