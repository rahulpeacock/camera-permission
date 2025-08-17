import {} from '@/components/ui/card';
import { SemiCircularLoader } from '@/features/global/components/loader';
import type { PermissionQueryError, PermissionQueryErrorType } from '@/lib/types';
import React from 'react';
import { MicrophoneDenied } from './microphone-denied';
import { MicrophoneError } from './microphone-error';
import { MicrophoneGranted } from './microphone-granted';
import { MicrophonePrompt } from './microphone-prompt';

export function MicrophonePermission() {
  const [permissionLoading, setPermissionLoading] = React.useState(true);
  const [permissionState, setPermissionState] = React.useState<PermissionState>('prompt');
  const [permissionError, setPermissionError] = React.useState<PermissionQueryError>({ isError: false });
  const effectRan = React.useRef(false);

  React.useEffect(() => {
    if (!effectRan.current) {
      async function getMicrophonePermission() {
        try {
          const _localPermissionStatus = await navigator.permissions.query({ name: 'microphone' });
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
      <div className='min-h-14 flex items-center justify-center gap-2.5 bg-gray-100 w-full max-w-[560px] rounded-2xl border-2 border-dotted text-muted-foreground text-sm'>
        <SemiCircularLoader className='size-4' /> <p>Accessing Microphone...</p>
      </div>
    );
  }

  if (permissionError.isError) {
    return <MicrophoneError type={permissionError.type} />;
  }

  if (permissionState === 'prompt') {
    return <MicrophonePrompt />;
  }

  if (permissionState === 'granted') {
    return <MicrophoneGranted />;
  }

  // permissionState === 'denied'
  return <MicrophoneDenied />;
}
