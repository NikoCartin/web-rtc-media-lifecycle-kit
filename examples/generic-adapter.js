import { MediaLifecycle, MEDIA_STAGES, subscribeRemoteTrack } from '../src/index.js';

export async function handleRemotePublication(client, remoteUser, mediaType) {
  const lifecycle = new MediaLifecycle({ onStage: console.info, onError: console.error });
  lifecycle.mark(MEDIA_STAGES.REMOTE_USER_PUBLISHED, { mediaType });
  const result = await subscribeRemoteTrack(client, remoteUser, mediaType, {
    onSuccess: () => lifecycle.mark(mediaType === 'video' ? MEDIA_STAGES.REMOTE_VIDEO_SUBSCRIBED : MEDIA_STAGES.REMOTE_AUDIO_SUBSCRIBED),
    onFailure: failure => lifecycle.fail(failure.error, { mediaType })
  });
  return result;
}
