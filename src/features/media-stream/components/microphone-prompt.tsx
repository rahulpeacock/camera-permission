import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SemiCircularLoader } from '@/features/global/components/loader';
import type { MediaStreamError, MediaStreamErrorType } from '@/lib/types';
import { Mic } from 'lucide-react';
import React from 'react';
import { MicrophoneError } from './microphone-error';

export function MicrophonePrompt() {
  const [promptLoading, setPromptLoading] = React.useState(false);
  const [promptError, setPromptError] = React.useState<MediaStreamError>({ isError: false });

  async function handleClick() {
    try {
      setPromptLoading(true);
      const _localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioTracks = _localStream.getAudioTracks();
      for (const track of audioTracks) {
        track.stop();
      }
    } catch (err) {
      let type: MediaStreamErrorType;
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
            break;
          default:
            type = 'UNKNOWN';
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
      <div className='min-h-14 flex items-center justify-center gap-2.5 bg-gray-100 w-full max-w-[560px] rounded-2xl border-2 border-dotted text-muted-foreground text-sm'>
        <SemiCircularLoader className='size-4' /> <p>Requesting Microphone</p>
      </div>
    );
  }

  if (promptError.isError) {
    return <MicrophoneError type={promptError.type} />;
  }

  return (
    <Card className='relative w-full max-w-[560px] bg-gray-50 rounded-3xl'>
      <CardHeader>
        <CardTitle>
          <h2 className='font-semibold text-lg'>Microphone Access</h2>
        </CardTitle>
        <CardDescription>
          <p className='text-muted-foreground text-sm'>Allow the app to use your microphone so you can record and interact seamlessly.</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <Button size='lg' className='rounded-xl w-full' onClick={handleClick}>
            <Mic className='size-5' /> Enable microphone
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
