import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { PermissionErrorType } from '@/lib/types';
import { AlertCircleIcon } from 'lucide-react';

interface MicrophoneErrorProps {
  type: PermissionErrorType;
}

export function MicrophoneError({ type }: MicrophoneErrorProps) {
  if (type === 'ABORT_ERROR') {
    return (
      <div>
        <h2>Abort error when accessing microphone</h2>
      </div>
    );
  }

  if (type === 'INVALID_STATE_ERROR') {
    return (
      <Alert variant='destructive' className='max-w-[560px] rounded-xl bg-gray-50'>
        <AlertCircleIcon />
        <AlertTitle>Microphone Access Unavailable</AlertTitle>
        <AlertDescription>We couldn't check your microphone permission because this page is no longer active.</AlertDescription>
        <div className='col-start-2 text-foreground pt-3'>
          <h3 className='font-medium'>What you can do:</h3>
          <ul className='list-disc pl-5 text-foreground/70 space-y-1 pt-1'>
            <li>Make sure you're on the correct tab or window.</li>
            <li>Reload the page and try again.</li>
          </ul>
        </div>
      </Alert>
    );
  }

  if (type === 'NOT_ALLOWED_ERROR') {
    return (
      <div>
        <h2>Not allowed error when accessing microphone</h2>
      </div>
    );
  }

  if (type === 'NOT_FOUND_ERROR') {
    return (
      <div>
        <h2>Not found error when accessing microphone</h2>
      </div>
    );
  }

  if (type === 'NOT_READABLE_ERROR') {
    return (
      <div>
        <h2>Not readable error when accessing microphone</h2>
      </div>
    );
  }

  if (type === 'OVER_CONSTRAINED_ERROR') {
    return (
      <div>
        <h2>Not readable error when accessing microphone</h2>
      </div>
    );
  }

  if (type === 'SECURITY_ERROR') {
    return (
      <div>
        <h2>Not readable error when accessing microphone</h2>
      </div>
    );
  }

  if (type === 'TYPE_ERROR') {
    return (
      <Alert variant='destructive' className='max-w-[560px] rounded-xl bg-gray-50'>
        <AlertCircleIcon />
        <AlertTitle>Invalid Permission</AlertTitle>
        <AlertDescription>The requested permission type is not supported. Please check the permission name used in your code.</AlertDescription>
      </Alert>
    );
  }

  // type === 'UNKNOWN'
  return (
    <Alert variant='destructive' className='max-w-[560px] rounded-xl bg-gray-50'>
      <AlertCircleIcon />
      <AlertTitle>Unknown Error</AlertTitle>
      <AlertDescription>
        An unexpected issue occurred while requesting microphone access. Please try again, or check your browser and device settings.
      </AlertDescription>
    </Alert>
  );
}
