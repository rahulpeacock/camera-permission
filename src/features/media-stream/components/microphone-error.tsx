import type { PermissionErrorType } from '@/lib/types';

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
      <div>
        <h2>Invalid state error when accessing microphone</h2>
      </div>
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
      <div>
        <h2>Not readable error when accessing microphone</h2>
      </div>
    );
  }

  // type === 'UNKNOWN'
  return (
    <div>
      <h2>Unknown error when accessing microphone</h2>
      <p>Microphone error unhandled by internal team</p>
    </div>
  );
}
