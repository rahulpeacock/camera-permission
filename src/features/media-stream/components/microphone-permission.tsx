import { SemiCircularLoader } from '@/features/global/components/loader';
import type { PermissionQueryError, PermissionQueryErrorType } from '@/lib/types';
import React from 'react';
import { MicrophoneGranted } from './microphone-granted';
import { MicrophonePrompt } from './microphone-prompt';

const PERMISSION_NAME = 'microphone' as PermissionName;

export function MicrophonePermission() {
  const [permissionLoading, setPermissionLoading] = React.useState(true);
  const [permissionState, setPermissionState] = React.useState<PermissionState>('prompt');
  const [permissionError, setPermissionError] = React.useState<PermissionQueryError>({ isError: false });
  const effectRan = React.useRef(false);

  React.useEffect(() => {
    if (!effectRan.current) {
      async function getMicrophonePermission() {
        try {
          const _localPermissionStatus = await navigator.permissions.query({ name: PERMISSION_NAME });
          setPermissionState(_localPermissionStatus.state);

          _localPermissionStatus.onchange = () => {
            setPermissionState(_localPermissionStatus.state);
          };
        } catch (err) {
          let type: PermissionQueryErrorType = 'UNKNOWN';
          if (err instanceof DOMException) {
            console.log('[ERROR] at function.getMicrophonePermission in component.MicrophonePermission of type.DOMException: ', err.name);
            switch (err.name) {
              case 'InvalidStateError':
                type = 'INVALID_STATE_ERROR';
            }
          } else if (err instanceof TypeError) {
            console.log('[ERROR] at function.getMicrophonePermission in component.MicrophonePermission of type.TypeError: ', err.name);
            type = 'TYPE_ERROR';
          } else {
            console.log('[ERROR] at function.getMicrophonePermission in component.MicrophonePermission of type.unknown: ', err);
            type = 'UNKNOWN';
          }
          setPermissionError({ isError: true, type });
        } finally {
          setPermissionLoading(false);
        }
      }
      getMicrophonePermission();

      effectRan.current = true;
    }
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
    return (
      <div>
        <h2>Permission Error</h2>
        <p>Manage the permission error</p>
      </div>
    );
  }

  if (permissionState === 'prompt') {
    return <MicrophonePrompt />;
  }

  if (permissionState === 'granted') {
    return <MicrophoneGranted />;
  }

  if (permissionState === 'denied') {
    return (
      <div className='min-h-screen flex items-center justify-center text-center'>
        <div>
          <h2 className='text-xl font-semibold'>The application tried to access your microphone, but it was blocked</h2>
          <p className='text-sm max-w-[800px] mt-1.5'>
            This error occurs when the browser does not have permission to access the microphone, due to user denial. Don't worry, this is a common
            issue and can be easily fixed by granting the necessary permissions. To resolve this, please check your browser's settings to ensure
            microphone access is allowed for this site. You can also click the "Allow" button if prompted by your browser when attempting to use the
            microphone.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p>Microphone Permission unhandled by internal team</p>
    </div>
  );
}
