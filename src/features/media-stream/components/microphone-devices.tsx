import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SemiCircularLoader } from '@/features/global/components/loader';
import { convertToWav, downloadFile } from '@/features/media-stream/utils';
import type { FileWithUrl, MediaRecorderErrorType, MediaStreamError, MediaStreamErrorType, RecordingStatus, TMediaRecorderError } from '@/lib/types';
import { useBlocker } from '@tanstack/react-router';
import { CirclePause, CirclePlay, CircleStop, Download, Mic, RotateCw } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { AudioWaveform } from './audio-waveform';
import { MediaRecorderError } from './media-recorder-error';
import { MicrophoneError } from './microphone-error';
import { MicrophoneGrantedLayout } from './microphone-granted-layout';
import { MicrophoneTimer } from './microphone-timer';

interface MicrophoneDeviceProps {
  devices: MediaDeviceInfo[];
  defaultDevice: MediaDeviceInfo;
}

export function MicrophoneDevices({ devices, defaultDevice }: MicrophoneDeviceProps) {
  const [file, setFile] = React.useState<FileWithUrl | null>(null);
  const [loadingStream, setLoadingStream] = React.useState(false);
  const [streamError, setStreamError] = React.useState<MediaStreamError>({ isError: false });
  const [recorderErrro, setRecorderError] = React.useState<TMediaRecorderError>({ isError: false });
  const [recordingName, setRecordingName] = React.useState<string>('');
  const [isPauseRecording, setIsPauseRecording] = React.useState(false);
  const [startTimer, setStartTimer] = React.useState(false);
  const [analyserNode, setAnalyserNode] = React.useState<AnalyserNode | null>(null);
  const [recordingStatus, setRecordingStatus] = React.useState<RecordingStatus>('TO-RECORD');
  const [defaultDeviceId, setDefaultDeviceId] = React.useState<string | null>(null);

  const chunksRef = React.useRef<Blob[]>([]);
  const streamRef = React.useRef<MediaStream | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null);

  const cleanup = React.useCallback(() => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      for (const track of audioTracks) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    setAnalyserNode(null);
  }, []);

  const handleStartRecording = React.useCallback(async () => {
    cleanup();
    setLoadingStream(true);
    try {
      const _stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: defaultDeviceId ?? defaultDevice.deviceId },
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

      // biome-ignore lint/suspicious/noExplicitAny: intended behaviour
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(_stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;
      setAnalyserNode(analyser);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });

        const wavBlob = await convertToWav(audioBlob);
        const wavFile = new File([wavBlob], 'Live recording.wav', { type: 'audio/wav' });

        const url = URL.createObjectURL(wavFile);
        const fileWithUrl = Object.assign(wavFile, { url: url });
        setFile(fileWithUrl);
      };

      mediaRecorder.onerror = (e) => {
        let type: MediaRecorderErrorType;
        switch (e.error.name) {
          case 'SecurityError':
            type = 'SECURITY_ERROR';
            break;
          case 'InvalidModificationError':
            type = 'INVALID_MODIFICATION_ERROR';
            break;
          default:
            type = 'UNKNOWN';
        }
        setRecorderError({ isError: true, type });
        cleanup();
      };

      mediaRecorder.start(1000);
      setRecordingStatus('RECORDING');
      setStartTimer(true);
      toast.info('Recording started');
    } catch (err) {
      let type: MediaStreamErrorType;
      if (err instanceof DOMException) {
        console.log('[ERROR] at function.handleClick in component.MicrophonePrompt of type.DOMException: ', err.name);
        switch (err.name) {
          case 'AbortError':
            type = 'ABORT_ERROR';
            break;
          case 'InvalidStateError':
            type = 'INVALID_STATE_ERROR';
            break;
          case 'NotAllowedError':
            type = 'NOT_ALLOWED_ERROR';
            break;
          case 'NotFoundError':
            type = 'NOT_FOUND_ERROR';
            break;
          case 'NotReadableError':
            type = 'NOT_READABLE_ERROR';
            break;
          case 'OverconstrainedError':
            type = 'OVER_CONSTRAINED_ERROR';
            break;
          case 'SecurityError':
            type = 'SECURITY_ERROR';
            break;
          default:
            type = 'UNKNOWN';
        }
      } else if (err instanceof TypeError) {
        console.log('[ERROR] at function.handleClick in component.MicrophonePrompt of type.TypeError: ', err.name);
        type = 'TYPE_ERROR';
      } else {
        console.log('[ERROR] at function.handleClick in component.MicrophonePrompt of type.unknown: ', err);
        type = 'UNKNOWN';
      }
      setStreamError({ isError: true, type });
      cleanup();
    } finally {
      setLoadingStream(false);
    }
  }, [defaultDeviceId, defaultDevice.deviceId, cleanup]);

  const handlePauseRecording = React.useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      setIsPauseRecording(true);
      setStartTimer(false);
      mediaRecorderRef.current.pause();
      toast.info('Recording paused');
    }
  }, []);

  const handleResumeRecording = React.useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      setIsPauseRecording(false);
      setStartTimer(true);
      mediaRecorderRef.current.resume();
      toast.info('Recording resumed');
    }
  }, []);

  const handleStopRecording = React.useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      for (const track of audioTracks) {
        track.stop();
      }
    }
    setStartTimer(false);
    setRecordingStatus('RECORDED');
    setIsPauseRecording(false);
    toast.info('Recording stopped');
  }, []);

  const handleRerecord = React.useCallback(() => {
    cleanup();
    setRecordingStatus('TO-RECORD');
    setFile(null);
    setRecordingName('');
    chunksRef.current = [];
  }, [cleanup]);

  const handleDownload = React.useCallback(() => {
    if (!file) return;
    downloadFile(file.url, `${recordingName.length > 0 ? `${recordingName}.wav` : 'Live recording.wav'}`);
    toast.info('Recording downloaded');
  }, [file, recordingName]);

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

  useBlocker({
    shouldBlockFn: () => {
      if (recordingStatus === 'RECORDING' || recordingStatus === 'RECORDED') {
        const shouldLeave = confirm('Are you sure you want to leave, your recording will be lost?');
        return !shouldLeave;
      }
      return false;
    },
    enableBeforeUnload: recordingStatus === 'RECORDING' || recordingStatus === 'RECORDED',
  });

  if (streamError.isError) {
    return <MicrophoneError type={streamError.type} />;
  }

  if (recorderErrro.isError) {
    return <MediaRecorderError type={recorderErrro.type} />;
  }

  if (recordingStatus === 'RECORDED') {
    return (
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
              className='rounded-[10px]'
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
    );
  }

  if (recordingStatus === 'RECORDING') {
    return (
      <Card className='relative w-full max-w-[560px] rounded-3xl'>
        <CardHeader>
          <CardTitle>
            <h2 className='font-semibold text-lg'>Recording Audio</h2>
          </CardTitle>
          <CardDescription>
            <p className='text-muted-foreground text-sm'>Your voice is being captured. Speak clearly and press Stop when you are done.</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='bg-gray-100 rounded-2xl p-1 space-y-2.5 border'>
            <div className='flex items-center justify-between px-2.5 pt-1.5 text-sm'>
              <div className='flex items-center justify-center gap-2.5'>
                {isPauseRecording ? (
                  <React.Fragment>
                    <span className='relative flex size-3'>
                      <span className='relative inline-flex size-3 rounded-full bg-gray-400' />
                    </span>
                    <p className='text-muted-foreground'>Paused</p>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <span className='relative flex size-3'>
                      <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75' />
                      <span className='relative inline-flex size-3 rounded-full bg-sky-500' />
                    </span>
                    <p className='text-sky-500'>Recording</p>
                  </React.Fragment>
                )}
              </div>
              <MicrophoneTimer startTimer={startTimer} />
            </div>
            <div className='bg-white p-2 rounded-xl'>
              <AudioWaveform analyserNode={analyserNode} isPaused={isPauseRecording} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className='grid grid-cols-2 gap-2 w-full'>
            {isPauseRecording ? (
              <Button size='lg' className='rounded-xl' variant='outline' onClick={handleResumeRecording}>
                <CirclePlay className='size-5' /> Resume
              </Button>
            ) : (
              <Button size='lg' className='rounded-xl' variant='outline' onClick={handlePauseRecording}>
                <CirclePause className='size-5' /> Pause
              </Button>
            )}
            <Button size='lg' className='rounded-xl' variant='outline' onClick={handleStopRecording}>
              <CircleStop className='size-5' /> Stop
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }

  // recordingStatus === 'TO-RECORD'
  return (
    <MicrophoneGrantedLayout>
      <CardContent>
        <div className='space-y-2'>
          <Label htmlFor='select-audio-device'>Audio devices</Label>
          <Select value={defaultDeviceId ?? defaultDevice.deviceId} onValueChange={setDefaultDeviceId}>
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
        <Button size='lg' className='rounded-xl w-full' onClick={handleStartRecording} disabled={loadingStream}>
          {loadingStream ? <SemiCircularLoader className='size-5' /> : <Mic className='size-5' />} Start recording
        </Button>
      </CardFooter>
    </MicrophoneGrantedLayout>
  );
}
