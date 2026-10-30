export const MEDIA_STAGES = Object.freeze({
  JOIN_STARTED: 'join_started',
  JOIN_SUCCEEDED: 'join_succeeded',
  REMOTE_USER_PUBLISHED: 'remote_user_published',
  REMOTE_VIDEO_SUBSCRIBED: 'remote_video_subscribed',
  REMOTE_AUDIO_SUBSCRIBED: 'remote_audio_subscribed',
  RECONNECT_STARTED: 'reconnect_started',
  RECONNECT_SUCCEEDED: 'reconnect_succeeded',
  RECOVERY_FAILED: 'recovery_failed'
});

export class MediaLifecycle {
  constructor({ onStage = () => {}, onError = () => {} } = {}) {
    this.onStage = onStage;
    this.onError = onError;
    this.currentStage = null;
  }

  mark(stage, details = {}) {
    this.currentStage = stage;
    this.onStage({ stage, timestamp: new Date().toISOString(), ...details });
  }

  fail(error, details = {}) {
    this.onError(error, { stage: this.currentStage, ...details });
  }
}
