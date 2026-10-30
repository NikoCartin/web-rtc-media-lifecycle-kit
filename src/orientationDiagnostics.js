/**
 * Read camera settings without changing the underlying MediaStreamTrack.
 */
export function inspectVideoTrack(track) {
  if (!track || typeof track.getSettings !== 'function') {
    return { ok: false, reason: 'video_track_settings_unavailable' };
  }
  const settings = track.getSettings() || {};
  const width = Number(settings.width) || null;
  const height = Number(settings.height) || null;
  return {
    ok: true,
    width,
    height,
    aspectRatio: width && height ? Number((width / height).toFixed(4)) : null,
    facingMode: settings.facingMode || null,
    deviceIdPresent: Boolean(settings.deviceId),
    displaySurface: settings.displaySurface || null,
    orientationHint: width && height ? (width >= height ? 'landscape' : 'portrait') : 'unknown'
  };
}
