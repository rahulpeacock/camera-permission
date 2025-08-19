import { queryOptions } from '@tanstack/react-query';
import { app } from './app';

export const getMicrophoneDevicesOptions = () => {
  return queryOptions({
    queryKey: ['get-microphone-devices'],
    queryFn: () => app.getMicrophoneDevices(),
  });
};
