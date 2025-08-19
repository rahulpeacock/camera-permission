import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorIcon } from '@/features/global/components/error-icon';
import type { MediaStreamErrorType, PermissionErrorType } from '@/lib/types';
import { SquareArrowOutUpRight } from 'lucide-react';
import { getChangeMicrophonePermissionLink } from '../utils';

interface MicrophoneErrorProps {
  type: PermissionErrorType | MediaStreamErrorType;
}

export function MicrophoneError({ type }: MicrophoneErrorProps) {
  if (type === 'ABORT_ERROR') {
    return (
      <Card className='relative w-full max-w-[560px] rounded-3xl'>
        <CardHeader>
          <ErrorIcon />
          <CardTitle>
            <h2 className='font-semibold text-lg pt-0.5'>Microphone Access Aborted</h2>
          </CardTitle>
          <CardDescription>
            <p className='text-sm'>
              The request for microphone access was interrupted or canceled. Please try again and ensure no other processes or settings are blocking
              microphone access. If the issue persists, check your browser and system settings for microphone permissions.
            </p>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (type === 'INVALID_STATE_ERROR') {
    return (
      <Card className='relative w-full max-w-[560px] rounded-3xl'>
        <CardHeader>
          <ErrorIcon />
          <CardTitle>
            <h2 className='font-semibold text-lg pt-0.5'>Microphone Access Unavailable</h2>
          </CardTitle>
          <CardDescription>
            <p className='text-sm'>We couldn't check your microphone permission because this page is no longer active. What you can do</p>
            <ul className='list-disc pl-5 space-y-1 pt-2'>
              <li>Make sure you're on the correct tab or window.</li>
              <li>Reload the page and try again.</li>
            </ul>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (type === 'NOT_ALLOWED_ERROR') {
    return (
      <Card className='relative w-full max-w-[560px] rounded-3xl'>
        <CardHeader>
          <ErrorIcon />
          <CardTitle>
            <h2 className='font-semibold text-lg pt-0.5'>Microphone Access Denied</h2>
          </CardTitle>
          <CardDescription>
            <p className='text-sm'>
              You've denied access to the microphone. To continue, please allow microphone access in your browser settings. If you need help resetting
              permissions, check this guide:
            </p>
            <a
              className='flex items-center justify-start gap-1.5 pt-2 text-blue-500 hover:underline'
              href={getChangeMicrophonePermissionLink()}
              target='_blank'
              rel='noreferrer'
            >
              How to reset microphone permission? <SquareArrowOutUpRight size={14} />
            </a>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (type === 'NOT_FOUND_ERROR') {
    return (
      <Card className='relative w-full max-w-[560px] rounded-3xl'>
        <CardHeader>
          <ErrorIcon />
          <CardTitle>
            <h2 className='font-semibold text-lg pt-0.5'>No Microphone Devices Found</h2>
          </CardTitle>
          <CardDescription>
            <p className='text-sm'>
              It looks like no microphone devices were detected. Please ensure your microphone is connected and properly set up. You may need to check
              your device settings or restart your browser. If you're still facing issues, consult the user guide or troubleshooting steps for help.
            </p>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (type === 'NOT_READABLE_ERROR') {
    return (
      <Card className='relative w-full max-w-[560px] rounded-3xl'>
        <CardHeader>
          <ErrorIcon />
          <CardTitle>
            <h2 className='font-semibold text-lg pt-0.5'>Microphone Not Readable</h2>
          </CardTitle>
          <CardDescription>
            <p className='text-sm'>
              We couldn't access the microphone because it may already be in use by another application, or there may be an issue with the device
              itself. Please make sure no other applications are using the microphone and try again. If the issue persists, check the microphone
              connection or restart your device.
            </p>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (type === 'OVER_CONSTRAINED_ERROR') {
    return (
      <Card className='relative w-full max-w-[560px] rounded-3xl'>
        <CardHeader>
          <ErrorIcon />
          <CardTitle>
            <h2 className='font-semibold text-lg pt-0.5'>Microphone Constraints Error</h2>
          </CardTitle>
          <CardDescription>
            <p className='text-sm'>
              We couldn't access the microphone because the requested settings could not be met. Please ensure your microphone supports the required
              configuration. You may also need to reset your preferences or try using a different device.
            </p>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (type === 'SECURITY_ERROR') {
    return (
      <Card className='relative w-full max-w-[560px] rounded-3xl'>
        <CardHeader>
          <ErrorIcon />
          <CardTitle>
            <h2 className='font-semibold text-lg pt-0.5'>Access Blocked</h2>
          </CardTitle>
          <CardDescription>
            <p className='text-sm'>
              It looks like microphone access was blocked for security reasons. To proceed, make sure you're on a secure website (HTTPS) and that your
              browser settings allow microphone access.
            </p>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (type === 'TYPE_ERROR') {
    return (
      <Card className='relative w-full max-w-[560px] rounded-3xl'>
        <CardHeader>
          <ErrorIcon />
          <CardTitle>
            <h2 className='font-semibold text-lg pt-0.5'>Invalid Permission</h2>
          </CardTitle>
          <CardDescription>
            <p className='text-sm'>The requested permission type is not supported. Please check the permission name used in your code.</p>
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
          <p className='text-sm'>
            An unexpected issue occurred while requesting microphone access. Please try again, or check your browser and device settings.
          </p>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
