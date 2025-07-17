import type { PermissionErrorType } from '@/lib/types';

interface MicrophoneErrorProps {
  type: PermissionErrorType;
}

export function MicrophoneError({ type }: MicrophoneErrorProps) {
  if (type === 'ABORT_ERROR') {
    return (
      <div>
        <h2>Abort error when accessing microphone</h2>
        <p>
          It happened because the browser the microphone request due to denied permissions or a resource conflict, but rest assured the app is still
          working and can retry audio capture immediately. To resolve this, please open your browser's permission settings to allow microphone access,
          close any other apps that might be using the microphone, reload the page, and try again.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2>Not readable error when accessing microphone</h2>
      <p>
        It happened because your microphone was busy or not responding, but don't worry—the app is still running and can try again. To get back on
        track, please close any other program that might be using your mic, ensure your microphone is properly connected and unmuted, then reload the
        page and retry. Ask ChatGPT
      </p>
    </div>
  );
}
