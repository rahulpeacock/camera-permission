import { type Result, ResultAsync, err, ok } from 'neverthrow';
import type { AudioEnumerateDevicesErrorType } from './types';

export const app = {
  getAudioDevices: async (): Promise<Result<MediaDeviceInfo[], AudioEnumerateDevicesErrorType>> => {
    const res = await ResultAsync.fromPromise(navigator.mediaDevices.enumerateDevices(), () => {
      return new Error('Failed to get media-devices');
    });

    if (res.isErr()) {
      return err({ type: 'FAILED_TO_GET_DEVICES' });
    }
    const audioDevices = res.value.filter((device) => device.kind === 'audioinput' && device.deviceId !== 'communications');
    return ok(audioDevices);
  },
};
