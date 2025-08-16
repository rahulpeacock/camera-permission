import { queryOptions } from '@tanstack/react-query';
import { app } from './app';

export const getMicrophoneAudioDevicesOptions = () => {
  return queryOptions({
    queryKey: ['get-microphone-audio-devices'],
    queryFn: () => app.getAudioDevices(),
  });
};
