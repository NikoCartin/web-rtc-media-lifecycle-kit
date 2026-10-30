/**
 * Privacy-conscious correlation helpers for browser media sessions.
 * Applications provide normalized schedule rows and recent access events.
 * This module does not read logs, call APIs, or transmit data by itself.
 */

export function classifyDevice(userAgent = '') {
  const ua = String(userAgent).toLowerCase();
  if (ua.includes('iphone')) return 'iPhone';
  if (ua.includes('ipad')) return 'iPad';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('cros')) return 'Chromebook';
  if (ua.includes('windows')) return 'Windows';
  if (ua.includes('macintosh')) return 'Mac';
  if (ua.includes('linux')) return 'Linux';
  return 'Unknown';
}

export function classifyBrowser(userAgent = '') {
  const ua = String(userAgent).toLowerCase();
  if (ua.includes('edg/')) return 'Edge';
  if (ua.includes('firefox/')) return 'Firefox';
  if (ua.includes('chrome/') && !ua.includes('edg/')) return 'Chrome';
  if (ua.includes('safari/') && !ua.includes('chrome/')) return 'Safari';
  return 'Unknown';
}

export function correlateActiveSessions({ schedule = [], events = [], now = Date.now() } = {}) {
  const activeIds = new Set(
    schedule
      .filter(row => row && row.status === 'CONFIRMED')
      .filter(row => Number(row.startMs) <= now && Number(row.endMs) >= now)
      .map(row => String(row.sessionId))
  );

  const grouped = new Map();
  for (const event of events) {
    if (!event || !activeIds.has(String(event.sessionId))) continue;
    const key = [event.sessionId, event.type, classifyDevice(event.userAgent), classifyBrowser(event.userAgent)].join('|');
    if (!grouped.has(key)) {
      grouped.set(key, {
        sessionId: String(event.sessionId),
        type: String(event.type || 'unknown'),
        device: classifyDevice(event.userAgent),
        browser: classifyBrowser(event.userAgent),
        lastSeenMs: Number(event.timestampMs) || null
      });
    } else {
      const current = grouped.get(key);
      current.lastSeenMs = Math.max(current.lastSeenMs || 0, Number(event.timestampMs) || 0) || null;
    }
  }

  return [...grouped.values()];
}
