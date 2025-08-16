import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { convertToWav, downloadFile } from '@/features/media-stream/utils';
import type { FileWithUrl, RecordingStatus } from '@/lib/types';
import { CirclePause, CirclePlay, CircleStop, Download, Mic, RotateCw } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { MicrophoneGrantedLayout } from './microphone-granted-layout';

interface MicrophoneDeviceProps {
  devices: MediaDeviceInfo[];
}

export function MicrophoneDevices({ devices }: MicrophoneDeviceProps) {
  const [file, setFile] = React.useState<FileWithUrl | null>(null);
  const [recordingName, setRecordingName] = React.useState<string>('');
  const [isPauseRecording, setIsPauseRecording] = React.useState(false);
  const [recordingStatus, setRecordingStatus] = React.useState<RecordingStatus>('TO-RECORD');
  const [defaultDeviceId, setDefaultDeviceId] = React.useState<string | undefined>(undefined);

  const chunksRef = React.useRef<Blob[]>([]);
  const streamRef = React.useRef<MediaStream | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);

  async function handleStartRecording() {
    try {
      const _stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: defaultDeviceId },
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = _stream;

      const mediaRecorder = new MediaRecorder(_stream, {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 128000,
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(await audioBlob.arrayBuffer());
        const wavBlob = convertToWav(audioBuffer);
        const wavFile = new File([wavBlob], 'Live recording.wav', { type: 'audio/wav' });

        const url = URL.createObjectURL(wavFile);
        const fileWithUrl = Object.assign(wavFile, { url: url });

        setFile(fileWithUrl);
        streamRef.current = null;
        chunksRef.current = [];
        mediaRecorderRef.current = null;
      };
      mediaRecorder.start(1000);
      setRecordingStatus('RECORDING');
      toast.info('Recording started');
    } catch (err) {
      // TODO: update the error-handling
      chunksRef.current = [];
      console.log('Error: ', err);
    }
  }

  function handlePauseRecording() {
    setIsPauseRecording((curr) => !curr);
    if (mediaRecorderRef.current) {
      if (isPauseRecording) {
        mediaRecorderRef.current.resume();
        toast.info('Recording resumed');
      } else {
        mediaRecorderRef.current.pause();
        toast.info('Recording paused');
      }
    }
  }

  function handleStopRecording() {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      for (const track of audioTracks) {
        track.stop();
      }
    }
    setRecordingStatus('RECORDED');
    setIsPauseRecording(false);
    toast.info('Recording stopped');
  }

  function handleRerecord() {
    setRecordingStatus('TO-RECORD');
    setFile(null);
    setRecordingName('');
  }

  function handleDownload() {
    if (!file) return;
    downloadFile(file.url, `${recordingName.length > 0 ? `${recordingName}.wav` : 'Live recording.wav'}`);
    toast.info('Recording downloaded');
  }

  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        const audioTracks = streamRef.current.getAudioTracks();
        for (const track of audioTracks) {
          track.stop();
        }
      }
    };
  }, []);

  if (recordingStatus === 'RECORDED') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Card className='relative w-full max-w-[560px] bg-gray-50 rounded-3xl'>
          <CardHeader>
            <CardTitle>
              <h2 className='font-semibold text-lg'>Download Recording</h2>
            </CardTitle>
            <CardDescription>
              <p className='text-muted-foreground text-sm'>Save your recorded audio to your device for future use or sharing.</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <Label htmlFor='recording-name'>File name</Label>
              <Input
                id='recording-name'
                placeholder='Enter a name for your recording'
                value={recordingName}
                onChange={(e) => setRecordingName(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className='grid grid-cols-2 gap-2 w-full'>
              <Button size='lg' className='rounded-xl' variant='outline' onClick={handleRerecord}>
                <RotateCw className='size-5' /> Re-record
              </Button>
              <Button size='lg' className='rounded-xl w-full' onClick={handleDownload}>
                <Download className='size-5' /> Download
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (recordingStatus === 'RECORDING') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Card className='relative w-full max-w-[560px] bg-gray-50 rounded-3xl'>
          <CardHeader>
            <CardTitle>
              <h2 className='font-semibold text-lg'>Recording Audio</h2>
            </CardTitle>
            <CardDescription>
              <p className='text-muted-foreground text-sm'>Your voice is being captured. Speak clearly and press Stop when you are done.</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO: add recording-time and animation */}
            <div>
              <p>Recording</p>
            </div>
          </CardContent>
          <CardFooter>
            <div className='grid grid-cols-2 gap-2 w-full'>
              <Button size='lg' className='rounded-xl' variant='outline' onClick={handlePauseRecording}>
                {isPauseRecording ? (
                  <React.Fragment>
                    <CirclePlay className='size-5' /> Resume
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <CirclePause className='size-5' /> Pause
                  </React.Fragment>
                )}
              </Button>
              <Button size='lg' className='rounded-xl' variant='outline' onClick={handleStopRecording}>
                <CircleStop className='size-5' /> Stop
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // recordingStatus === 'TO-RECORD'
  return (
    <MicrophoneGrantedLayout>
      <CardContent>
        <div className='space-y-2'>
          <Label htmlFor='select-audio-device'>Audio devices</Label>
          <Select value={defaultDeviceId ?? devices[0].deviceId} onValueChange={setDefaultDeviceId}>
            <SelectTrigger id='select-audio-device' className='w-full !h-10 rounded-[10px]'>
              <SelectValue placeholder='Select a device' />
            </SelectTrigger>
            <SelectContent className='rounded-[10px]'>
              {devices.map((device) => (
                <SelectItem className='rounded-md' key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button size='lg' className='rounded-xl w-full' onClick={handleStartRecording}>
          <Mic className='size-5' /> Start recording
        </Button>
      </CardFooter>
    </MicrophoneGrantedLayout>
  );
}
