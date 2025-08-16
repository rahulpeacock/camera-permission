import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function MicrophoneGrantedLayout({ children }: React.PropsWithChildren) {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Card className='relative w-full max-w-[560px] bg-gray-50 rounded-3xl'>
        <CardHeader>
          <CardTitle>
            <h2 className='font-semibold text-lg'>Select Microphone Device</h2>
          </CardTitle>
          <CardDescription>
            <p className='text-muted-foreground text-sm'>
              Choose your preferred microphone from the available devices before starting your recording.
            </p>
          </CardDescription>
        </CardHeader>
        {children}
      </Card>
    </div>
  );
}
