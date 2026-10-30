/**
 * Defensive remote-track subscription with bounded retries.
 * The client and user objects are intentionally provider-agnostic.
 */
export async function subscribeRemoteTrack(client, user, mediaType, options = {}) {
  const {
    maxAttempts = 3,
    timeoutMs = 5000,
    delayMs = 500,
    onAttempt = () => {},
    onSuccess = () => {},
    onFailure = () => {}
  } = options;

  if (!client || typeof client.subscribe !== 'function') {
    throw new TypeError('A client with subscribe() is required');
  }
  if (!user || !mediaType) {
    throw new TypeError('A remote user and media type are required');
  }

  let lastError;
  for (let attempt = 1; attempt <= Math.max(1, maxAttempts); attempt += 1) {
    onAttempt({ attempt, mediaType, userId: user.uid ?? null });
    try {
      await withTimeout(client.subscribe(user, mediaType), timeoutMs);
      onSuccess({ attempt, mediaType, userId: user.uid ?? null });
      return { ok: true, attempt, mediaType, userId: user.uid ?? null };
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) await wait(delayMs);
    }
  }

  const result = {
    ok: false,
    attempts: Math.max(1, maxAttempts),
    mediaType,
    userId: user.uid ?? null,
    error: lastError
  };
  onFailure(result);
  return result;
}

export function withTimeout(promise, timeoutMs) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return Promise.resolve(promise);
  return Promise.race([
    Promise.resolve(promise),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);
    })
  ]);
}

function wait(delayMs) {
  return new Promise(resolve => setTimeout(resolve, Math.max(0, delayMs)));
}
