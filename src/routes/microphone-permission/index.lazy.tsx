import { MicrophonePermission } from '@/features/media-stream/components/microphone-permission';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/microphone-permission/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className='min-h-screen flex items-center justify-center'>
        <MicrophonePermission />
      </div>
    </div>
  );
}
