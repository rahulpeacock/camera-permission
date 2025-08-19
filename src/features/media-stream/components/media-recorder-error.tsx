import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorIcon } from '@/features/global/components/error-icon';
import type { MediaRecorderErrorType } from '@/lib/types';

interface MediaRecorderErrorProps {
  type: MediaRecorderErrorType;
}

export function MediaRecorderError({ type }: MediaRecorderErrorProps) {
  if (type === 'SECURITY_ERROR') {
    return (
      <Card className='relative w-full max-w-[560px] rounded-3xl'>
        <CardHeader>
          <ErrorIcon />
          <CardTitle>
            <h2 className='font-semibold text-lg pt-0.5'>Security Error</h2>
          </CardTitle>
          <CardDescription>
            <p className='text-sm'>
              The recorder couldn't start because the device permissions were denied. Please allow microphone/camera access in your browser settings.
            </p>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  if (type === 'INVALID_MODIFICATION_ERROR') {
    return (
      <Card className='relative w-full max-w-[560px] rounded-3xl'>
        <CardHeader>
          <ErrorIcon />
          <CardTitle>
            <h2 className='font-semibold text-lg pt-0.5'>Track Change Error</h2>
          </CardTitle>
          <CardDescription>
            <p className='text-sm'>
              The number of tracks in the recording stream changed unexpectedly. Make sure the media source stays the same throughout the recording.
            </p>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // type === 'UNKNOWN'
  return (
    <Card className='relative w-full max-w-[560px] rounded-3xl'>
      <CardHeader>
        <ErrorIcon />
        <CardTitle>
          <h2 className='font-semibold text-lg pt-0.5'>Unknown Error</h2>
        </CardTitle>
        <CardDescription>
          <p className='text-sm'>An unexpected issue occurred and recording was stopped. Try again or check your settings.</p>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
