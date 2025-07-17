import { SemiCircularLoader } from '@/features/global/components/loader';
import type { PermissionError, PermissionErrorType } from '@/lib/types';
import React from 'react';
import { MicrophoneError } from './microphone-error';

export function MicrophoneStream() {
  const [permissionLoading, setPermissionLoading] = React.useState(true);
  const [permissionError, setPermissionError] = React.useState<PermissionError>({ isError: false });

  React.useEffect(() => {
    async function getMicrophonePermission() {
      try {
        setPermissionLoading(true);
        const _localStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          // video: {
          //   deviceId: 'jkljlkjlk',
          // },
        });
        console.log(_localStream);
      } catch (err) {
        let type: PermissionErrorType = 'UNKNOWN';
        if (err instanceof DOMException) {
          console.log('Failed during getMicrophonePermission: ', err.name);
          switch (err.name) {
            case 'AbortError':
              type = 'ABORT_ERROR';
              break;
            case 'InvalidStateError':
              type = 'INVALID_STATE_ERROR';
              break;
            case 'NotAllowedError':
              type = 'NOT_ALLOWED_ERROR';
              break;
            case 'NotFoundError':
              type = 'NOT_FOUND_ERROR';
              break;
            case 'NotReadableError':
              type = 'NOT_READABLE_ERROR';
              break;
            case 'OverconstrainedError':
              type = 'OVER_CONSTRAINED_ERROR';
              break;
            case 'SecurityError':
              type = 'SECURITY_ERROR';
          }
        }
        if (err instanceof TypeError) {
          console.log('Failed during getMicrophonePermission:TypeError: ', err.name);
          console.log(err.message);
          type = 'TYPE_ERROR';
        }
        setPermissionError({ isError: true, type });
      } finally {
        setPermissionLoading(false);
      }
    }
    getMicrophonePermission();
  }, []);

  if (permissionLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='flex items-center justify-center gap-4'>
          <SemiCircularLoader />
          <p className='font-medium text-neutral-700'>Accessing Microphone</p>
        </div>
      </div>
    );
  }

  if (permissionError.isError) {
    return <MicrophoneError type={permissionError.type} />;
  }

  return (
    <div className='p-2'>
      <h3 className='text-2xl font-semibold'>Welcome Home!</h3>
    </div>
  );
}
