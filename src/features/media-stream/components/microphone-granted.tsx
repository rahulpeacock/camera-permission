import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
      queryClient.invalidateQueries({ queryKey: ['get-microphone-devices'] });
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
          <div className='min-h-[62px] flex items-center justify-center gap-2.5 bg-gray-100 rounded-2xl border-2 border-dotted text-muted-foreground text-sm'>
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
    console.log('Error getting microphone devices: ', error);
    return <ErrorLayout />;
  }

  if (data.isErr()) {
    return <ErrorLayout />;
  }

  return <MicrophoneDevices devices={data.value} defaultDevice={data.value[0]} />;
}

function ErrorLayout() {
  return (
    <Card className='relative w-full max-w-[560px] bg-gray-50 rounded-3xl'>
      <CardHeader>
        <CardTitle>
          <h2 className='font-semibold text-lg'>Error Retrieving Devices</h2>
        </CardTitle>
        <CardDescription>
          <p className='text-muted-foreground text-sm'>
            The browser couldn't show your microphone because permission isn't granted, the site isn't secure (HTTPS), or your browser doesn't support
            it.
          </p>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
