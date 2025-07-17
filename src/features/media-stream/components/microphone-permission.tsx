import { SemiCircularLoader } from '@/features/global/components/loader';
import type { PermissionQueryError, PermissionQueryErrorType } from '@/lib/types';
import React from 'react';

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
          const _localPermission = await navigator.permissions.query({ name: PERMISSION_NAME });
          console.log('localPermission: ', _localPermission);
          setPermissionState(_localPermission.state);

          if (_localPermission.state === 'granted') {
            // OK - Access has been granted to the microphone
          } else if (_localPermission.state === 'denied') {
            // KO - Access has been denied. Microphone can't be used
          } else {
            // _localPermission should be asked
          }

          _localPermission.onchange = (permissionS) => {
            // React when the permission changed
            console.log('onchange: ', permissionS);
          };
        } catch (err) {
          let type: PermissionQueryErrorType = 'UNKNOWN';
          if (err instanceof DOMException) {
            console.log('[ERROR] at (getMicrophonePermission) of type DOMException: ', err.name);
            switch (err.name) {
              case 'InvalidStateError':
                type = 'INVALID_STATE_ERROR';
            }
          } else if (err instanceof TypeError) {
            console.log('[ERROR] at (getMicrophonePermission) of type TypeError: ', err.name);
            type = 'TYPE_ERROR';
          } else {
            console.log('[ERROR] at (getMicrophonePermission) of type unknown: ', err);
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
    return (
      <div>
        <h2>Permission Prompt</h2>
        <p>Button for permission prompt</p>
      </div>
    );
  }

  if (permissionState === 'granted') {
    return (
      <div>
        <h2>Permission Granted</h2>
        <p>UI for permission granted</p>
      </div>
    );
  }

  // permissionState === 'denied'
  return (
    <div>
      <p>Microphone Permission</p>
    </div>
  );
}
