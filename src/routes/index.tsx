import { MicrophonePermission } from '@/features/media-stream/components/microphone-permission';
import type {} from '@/lib/types';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div>
      <MicrophonePermission />
    </div>
  );
}
