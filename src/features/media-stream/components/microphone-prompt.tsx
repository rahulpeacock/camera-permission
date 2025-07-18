import { Button } from '@/components/ui/button';
import { SemiCircularLoader } from '@/features/global/components/loader';
import type { PermissionError, PermissionErrorType } from '@/lib/types';
import { Mic } from 'lucide-react';
import React from 'react';
import { MicrophoneError } from './microphone-error';

export function MicrophonePrompt() {
  const [promptLoading, setPromptLoading] = React.useState(false);
  const [promptError, setPromptError] = React.useState<PermissionError>({ isError: false });

  async function handleClick() {
    try {
      setPromptLoading(true);
      const _localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioTracks = _localStream.getAudioTracks();
      for (const track of audioTracks) {
        track.stop();
      }
    } catch (err) {
      let type: PermissionErrorType = 'UNKNOWN';
      if (err instanceof DOMException) {
        console.log('[ERROR] at function.handleClick in component.MicrophonePrompt of type.DOMException: ', err.name);
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
      } else if (err instanceof TypeError) {
        console.log('[ERROR] at function.handleClick in component.MicrophonePrompt of type.TypeError: ', err.name);
        type = 'TYPE_ERROR';
      } else {
        console.log('[ERROR] at function.handleClick in component.MicrophonePrompt of type.unknown: ', err);
        type = 'UNKNOWN';
      }
      setPromptError({ isError: true, type });
    } finally {
      setPromptLoading(false);
    }
  }

  if (promptLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='flex items-center justify-center gap-4'>
          <SemiCircularLoader />
          <p className='font-medium text-neutral-700'>Requesting Microphone</p>
        </div>
      </div>
    );
  }

  if (promptError.isError) {
    return <MicrophoneError type={promptError.type} />;
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div>
        <Button size='lg' onClick={handleClick}>
          <Mic className='!size-5' /> Enable microphone
        </Button>
      </div>
    </div>
  );
}
