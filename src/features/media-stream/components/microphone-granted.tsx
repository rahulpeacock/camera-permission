import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { SemiCircularLoader } from '@/features/global/components/loader';
import { getMicrophoneDevicesOptions } from '@/lib/queries';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Mic } from 'lucide-react';
import React from 'react';
import { MicrophoneDevices } from './microphone-devices';
import { MicrophoneGrantedLayout } from './microphone-granted-layout';

export function MicrophoneGranted() {
  const queryClient = useQueryClient();
  const { isPending, data, isError, error } = useQuery(getMicrophoneDevicesOptions());

  React.useEffect(() => {
    function handleDeviceChange(e: Event) {
      console.log('Device change event: ', e);
      queryClient.invalidateQueries({ queryKey: ['get-microphone-audio-devices'] });
    }

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [queryClient.invalidateQueries]);

  if (isPending) {
    return (
      <MicrophoneGrantedLayout>
        <CardContent>
          <div className='min-h-14 flex items-center justify-center gap-2.5 bg-gray-100 rounded-2xl border-2 border-dotted text-muted-foreground text-sm'>
            <SemiCircularLoader className='size-4' /> <p>Getting devices...</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button size='lg' className='rounded-xl w-full' disabled={true}>
            <Mic className='size-5' /> Start recording
          </Button>
        </CardFooter>
      </MicrophoneGrantedLayout>
    );
  }

  if (isError) {
    console.log('Error: ', error);
    return (
      <MicrophoneGrantedLayout>
        <p>Error</p>
      </MicrophoneGrantedLayout>
    );
  }

  if (data.isErr()) {
    return (
      <MicrophoneGrantedLayout>
        <p>isError</p>
      </MicrophoneGrantedLayout>
    );
  }
  console.log('data', data.value);

  return <MicrophoneDevices devices={data.value} defaultDevice={data.value[0]} />;
}
